import { clearSession } from "@/utils/session";

// POST-only so a third-party page can't log users out with an <img>/link (CSRF).
export async function POST() {
  clearSession();
  // 303 turns the POST into a GET; relative Location keeps the public host behind the proxy.
  return new Response(null, { status: 303, headers: { Location: "/" } });
}
