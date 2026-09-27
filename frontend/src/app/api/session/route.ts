import { getSessionUserId } from "@/utils/session";

// Split out of header.tsx (BUG-14): the header itself no longer calls
// cookies(), so pages that don't otherwise use a dynamic API can be
// statically rendered. The user-specific bit is fetched client-side instead.
export async function GET() {
  const userId = getSessionUserId();
  if (!userId) return Response.json({ user: null });

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/subscribers?filters[id][$eq]=${userId}&fields[0]=firstName&fields[1]=lastName`,
      {
        headers: { authorization: `bearer ${process.env.STRAPI_SUBSCRIBE_TOKEN}` },
      }
    );

    if (!res.ok) return Response.json({ user: null });

    const { data } = await res.json();
    return Response.json({ user: data[0] ?? null });
  } catch {
    return Response.json({ user: null });
  }
}
