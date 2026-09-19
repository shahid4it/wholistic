"use server";

import { redirect } from "next/navigation";
import { setSession } from "@/utils/session";

export async function Subscribe(
  prevState: unknown,
  formdata: FormData
): Promise<
  | {
      error: string;
      success: false;
      message?: string;
      fields: Partial<{
        email: string;
        password: string;
        "g-recaptcha-response": string;
      }>;
    }
  | { error: null; success: true }
  | { error: null; success: false }
> {
  const {
    "g-recaptcha-response": captcha,
    password,
    email,
  } = Object.fromEntries(formdata.entries());

  // const tokenVerification = await fetch(
  //   `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${captcha}`,
  //   {
  //     method: "POST",
  //   }
  // );

  // if (tokenVerification.ok) {
  //   const result = await tokenVerification.json();
  //   if (!result.success) {
  //     return {
  //       error: "captcha",
  //       success: false,
  //       fields: { "g-recaptcha-response": "invalid captcha" },
  //     };
  //   }
  // } else {
  //   return {
  //     error: "captcha",
  //     success: false,
  //     fields: { "g-recaptcha-response": "invalid captcha" },
  //   };
  // }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/subscribers/login`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${process.env.STRAPI_SUBSCRIBE_TOKEN}`,
      },
      body: JSON.stringify({ email, password }),
    }
  );

  if (res.status === 400 || res.status === 401) {
    return {
      error: "authentication",
      success: false,
      fields: { password: "Invalid email or password" },
    };
  }

  if (!res.ok) {
    return {
      error: "server",
      success: false,
      fields: {},
      message: (await res.json().catch(() => null))?.error?.message,
    };
  }

  const { id } = await res.json();
  setSession(id);
  return redirect("/");
}
