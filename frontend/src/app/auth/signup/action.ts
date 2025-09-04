"use server";

import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { randomBytes, scryptSync } from "crypto";

export async function Subscribe(
  prevState: unknown,
  formdata: FormData
): Promise<
  | {
      error: string;
      success: false;
      message?: string;
      fields: Partial<{
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        repassword: string;
        "g-recaptcha-response": string;
      }>;
    }
  | { error: null; success: true }
  | { error: null; success: false }
> {
  const {
    firstName,
    lastName,
    "g-recaptcha-response": captcha,
    password,
    repassword,
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

  const salt = randomBytes(32).toString("hex");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/subscribers`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${process.env.STRAPI_SUBSCRIBE_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          firstName,
          lastName,
          email,
          password: `${salt}:${scryptSync(password, salt, 32).toString("hex")}`,
        },
      }),
    }
  );
  if (res.ok) {
    const {
      data: { id },
    } = await res.json();
    const token = jwt.sign({ id }, process.env.JWT_SECRET!);
    cookies().set("auth", token);
    return redirect("/");
  } else {
    return {
      error: "server",
      success: false,
      fields: {},
      message: (await res.json()).error?.message,
    };
  }
}
