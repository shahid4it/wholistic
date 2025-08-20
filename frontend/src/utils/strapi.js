export function fetchStrapi({ query = "", key = "" }) {
  return async (variables = {}) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_LANDING_URL}/graphql`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      const data = json.data[key];

      return data;
    } else {
      console.log(await res.json());
      // return {};
      throw Error();
    }
  };
}
