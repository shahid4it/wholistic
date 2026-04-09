export async function POST(req) {
  const body = await req.json();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/contacts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.STRAPI_CONTACT_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            fullName: body.fullName,
            email: body.email,
            phone: body.phone || null,
            subject: body.subject,
            message: body.message,
          },
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({
          error: data.error?.message || "Failed to send message",
        }),
        { status: 400 }
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Server error. Please try again later." }),
      { status: 500 }
    );
  }
}
