/** Safely embeds a value in a GraphQL query as an escaped string literal. */
export const gql = (value) => JSON.stringify(String(value ?? ""));

/** Query results are lists; fetchStrapi returns {} on failure, so normalise. */
export const asList = (value) => (Array.isArray(value) ? value : []);

/** Pill labels for a reader: the `tagList` relation, else the legacy comma-separated `tags` text. */
export const tagNames = ({ tagList, tags } = {}) =>
  asList(tagList).length
    ? asList(tagList).map((t) => t.name)
    : String(tags ?? "").split(",").map((t) => t.trim()).filter(Boolean);

/** Tag filters from a `tag` search param (one or repeated), trimmed, de-duplicated ignoring case. */
export const parseTags = (value) => {
  const seen = new Set();
  const tags = [];
  for (const raw of [].concat(value ?? [])) {
    const tag = String(raw).trim();
    if (tag && !seen.has(tag.toLowerCase())) {
      seen.add(tag.toLowerCase());
      tags.push(tag);
    }
  }
  return tags.slice(0, 10);
};

/**
 * The Readers page filtered to readers with all of these tags. Navigate with
 * scroll: false; ScrollToReaders brings the list into view instead of a #hash.
 */
export const tagsHref = (tags) => {
  const query = asList(tags).map((t) => `tag=${encodeURIComponent(t)}`).join("&");
  return `/readers${query ? `?${query}` : ""}`;
};

export function fetchStrapi({ query = "", key = "" }) {
  return async (variables = {}) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LANDING_URL}/graphql`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ query, variables }),
          cache: "no-store",
        },
      );

      const json = await res.json().catch(() => null);

      if (res.ok && json?.data) {
        return json.data[key] ?? {};
      }

      console.error(
        "Strapi request failed",
        res.status,
        json?.errors?.[0]?.message,
      );
    } catch (e) {
      // During `next build`, a no-store fetch throws this to mark the page as
      // dynamic; swallowing it makes Next prerender the page with no data.
      if (e?.digest === "DYNAMIC_SERVER_USAGE") throw e;
      console.error("Strapi request error", e?.message);
    }

    return {};
  };
}
