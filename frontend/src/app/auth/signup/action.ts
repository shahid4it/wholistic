"use server";

import { redirect } from "next/navigation";
import { setSession } from "@/utils/session";
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

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const fields: Record<string, string> = {};

  if (!str(firstName)) fields.firstName = "First name is required";
  if (!str(lastName)) fields.lastName = "Last name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str(email))) {
    fields.email = "Enter a valid email address";
  }
  if (typeof password !== "string" || password.length < 8) {
    fields.password = "Password must be at least 8 characters";
  } else if (password !== repassword) {
    fields.repassword = "Passwords do not match";
  }

  if (Object.keys(fields).length) {
    return { error: "validation", success: false, fields };
  }

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
          password: `${salt}:${scryptSync(password as string, salt, 32).toString("hex")}`,
        },
      }),
    }
  );
  if (res.ok) {
    const {
      data: { id },
    } = await res.json();
    setSession(id);
    return redirect("/");
  } else {
    const message = (await res.json().catch(() => null))?.error?.message;
    const duplicate = /unique/i.test(message ?? "");
    return {
      error: "server",
      success: false,
      fields: duplicate ? { email: "An account with this email already exists" } : {},
      message: duplicate ? "An account with this email already exists" : message,
    };
  }
}
