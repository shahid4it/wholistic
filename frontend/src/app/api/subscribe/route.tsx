export async function POST(req) {
  const body = await req.json();

  const res = await fetch(`${process.env.STRAPI_URL}/api/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_URL}`,
    },
    body: JSON.stringify({
      data: {
        fullName: body.fullName,
        email: body.email,
      },
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return new Response(JSON.stringify({ error: data.error?.message }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
