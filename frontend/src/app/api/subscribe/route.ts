const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: object, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!fullName) return json({ error: "Please enter your name" }, 400);
  if (!EMAIL_RE.test(email)) return json({ error: "Please enter a valid email address" }, 400);

  // "Mary Ann Smith" -> first "Mary", last "Ann Smith"
  const [firstName, ...rest] = fullName.split(/\s+/);
  const lastName = rest.join(" ");

  let res: Response;
  try {
    res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_SUBSCRIBE_TOKEN}`,
      },
      body: JSON.stringify({ data: { firstName, lastName, email } }),
    });
  } catch {
    return json({ error: "Something went wrong, please try again later" }, 502);
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    if (/unique/i.test(data?.error?.message ?? "")) {
      return json({ error: "This email is already subscribed" }, 409);
    }
    return json({ error: "Could not subscribe, please try again" }, 400);
  }

  return json({ success: true }, 200);
}
