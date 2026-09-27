const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: object, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const data = {
    fullName: str(body?.fullName),
    email: str(body?.email),
    contact: str(body?.contact),
    date: str(body?.date),
    timeSlot: str(body?.timeSlot),
    service: str(body?.service),
    message: str(body?.message) || undefined,
    readerName: str(body?.readerName),
    readerSlug: str(body?.readerSlug),
  };

  if (!data.fullName) return json({ error: "Please enter your name" }, 400);
  if (!EMAIL_RE.test(data.email)) return json({ error: "Please enter a valid email address" }, 400);
  if (!data.contact) return json({ error: "Please enter a contact number" }, 400);
  if (!data.date) return json({ error: "Please pick a date" }, 400);
  if (!data.timeSlot) return json({ error: "Please pick a time slot" }, 400);
  if (!data.service) return json({ error: "Please pick a service" }, 400);
  if (!data.readerSlug) return json({ error: "Please select a reader or healer" }, 400);

  let res: Response;
  try {
    res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_BOOKING_TOKEN}`,
      },
      body: JSON.stringify({ data }),
    });
  } catch {
    return json({ error: "Something went wrong, please try again later" }, 502);
  }

  if (!res.ok) {
    return json({ error: "Could not book your session, please try again" }, 400);
  }

  return json({ success: true }, 200);
}
