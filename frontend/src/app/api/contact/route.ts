const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

const json = (body: object, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const data = {
    fullName: str(body?.fullName),
    email: str(body?.email),
    phone: str(body?.phone) || undefined,
    subject: str(body?.subject),
    message: str(body?.message),
  };

  if (!data.fullName) return json({ error: "Please enter your name" }, 400);
  if (!EMAIL_RE.test(data.email)) return json({ error: "Please enter a valid email address" }, 400);
  if (!data.subject) return json({ error: "Please enter a subject" }, 400);
  if (!data.message) return json({ error: "Please enter a message" }, 400);

  try {
    // "contact" is a Strapi singleType (the Contact page's layout) and can't
    // receive REST creates; submissions are stored as their own collection.
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/contact-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_CONTACT_TOKEN}`,
      },
      body: JSON.stringify({ data }),
    });

    if (!res.ok) return json({ error: "Failed to send message, please try again" }, 400);

    return json({ success: true }, 200);
  } catch {
    return json({ error: "Server error. Please try again later." }, 502);
  }
}
