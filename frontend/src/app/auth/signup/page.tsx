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
            <span>First Name</span>
            <input type="text" name="firstName" />
            {formState.error && (
              <small className="error-message">
                {formState.fields.firstName}
              </small>
            )}
          </label>
          <label>
            <span>Last Name</span>
            <input type="text" name="lastName" />
            {formState.error && (
              <small className="error-message">
                {formState.fields.lastName}
              </small>
            )}
          </label>
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
          <label>
            <span>Re Enter Password</span>
            <input type="password" name="repassword" />
            {formState.error && (
              <small className="error-message">
                {formState.fields.repassword}
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
            onChange={console.log}
          /> */}
          <p>{formState.error === "server" && formState.message}</p>
          <button type="submit" className="button" disabled={!captchaToken}>
            Subscribe
          </button>
          <small>
            Already a member? <Link href="/auth/login">Login</Link>
          </small>
        </form>
      </div>
    </main>
  );
}
