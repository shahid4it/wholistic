import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const COOKIE = "auth";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function setSession(id: number) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET!, {
    algorithm: "HS256",
    expiresIn: MAX_AGE,
  });

  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    // The site can be served over plain HTTP (bare IP), where a Secure cookie would never be sent.
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function clearSession() {
  cookies().delete(COOKIE);
}

/** Returns the subscriber id from a valid, unexpired session cookie. */
export function getSessionUserId(): number | undefined {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return undefined;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ["HS256"],
    });
    return typeof payload === "object" && typeof payload.id === "number"
      ? payload.id
      : undefined;
  } catch {
    return undefined;
  }
}
