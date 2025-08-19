export function fetchStrapi({ query = "", key = "" }) {
  return async (variables = {}) => {
    const res = await fetch(process.env.NEXT_PUBLIC_LANDING_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (res.ok) {
      const json = await res.json();
      return json[key];
    } else {
      throw Error();
    }
  };
}
