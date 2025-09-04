"use client";

import { useFormState } from "react-dom";
import { Subscribe } from "./action";
import Script from "next/script";
import { useState } from "react";
import Recaptcha from "react-google-recaptcha";
import Link from "next/link";

export default function Page() {
  const [formState, dispatch] = useFormState(Subscribe, {
    error: null,
    success: false,
  });

  const [captchaToken, setCaptchaToken] = useState("abcd");

  return (
    <main className="signup-page">
      <Script src="https://www.google.com/recaptcha/api.js" async defer />
      <div className="section container">
        <form action={dispatch} className="signup">
          <label>
            <span>Email</span>
            <input type="email" name="email" />
            {formState.error && (
              <small className="error-message">{formState.fields.email}</small>
            )}
          </label>
          <label>
            <span>Password</span>
            <input type="password" name="password" />
            {formState.error && (
              <small className="error-message">
                {formState.fields.password}
              </small>
            )}
          </label>
          <input
            name="g-recaptcha-response"
            value={captchaToken}
            readOnly
            hidden
          />
          {/* <Recaptcha
            sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
            onChange={setCaptchaToken}
          /> */}
          <p>{formState.error === "server" && formState.message}</p>
          <button type="submit" className="button" disabled={!captchaToken}>
            Login
          </button>
          <small>
            Not a member yet? Your missing out.{" "}
            <Link href="/auth/signup">Sign up</Link> Now!
          </small>
        </form>
      </div>
    </main>
  );
}
