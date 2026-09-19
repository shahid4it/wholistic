/** Safely embeds a value in a GraphQL query as an escaped string literal. */
export const gql = (value) => JSON.stringify(String(value ?? ""));

/** Query results are lists; fetchStrapi returns {} on failure, so normalise. */
export const asList = (value) => (Array.isArray(value) ? value : []);

export function fetchStrapi({ query = "", key = "" }) {
  return async (variables = {}) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LANDING_URL}/graphql`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
        cache: "no-store",
      });

      const json = await res.json().catch(() => null);

      if (res.ok && json?.data) {
        return json.data[key] ?? {};
      }

      console.error("Strapi request failed", res.status, json?.errors?.[0]?.message);
    } catch (e) {
      console.error("Strapi request error", e?.message);
    }

    return {};
  };
}
