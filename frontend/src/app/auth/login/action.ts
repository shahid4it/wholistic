"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { scryptSync } from "crypto";

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
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/subscribers?filters[email][$eq]=${email}`,
    {
      headers: {
        authorization: `bearer ${process.env.STRAPI_SUBSCRIBE_TOKEN}`,
      },
    }
  );

  if (res.ok) {
    const {
      data: [{ id, password: targetPassword } = {}],
    } = await res.json();
    if (!id) {
      return {
        error: "authentication",
        success: false,
        fields: { email: "invalid email entered" },
      };
    }
    const [salt, hash] = targetPassword.split(":");
    console.log(salt, hash);
    if (hash !== scryptSync(password, salt, 32).toString("hex")) {
      return {
        error: "authentication",
        success: false,
        fields: { password: "incorrect password entered" },
      };
    }
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
