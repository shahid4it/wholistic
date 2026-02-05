export async function POST(req) {
  const body = await req.json();

  const [firstName, lastName] = body.fullName.split(" ");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/subscribers`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_SUBSCRIBE_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          firstName,
          lastName,
          email: body.email,
        },
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return new Response(JSON.stringify({ error: data.error?.message }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
