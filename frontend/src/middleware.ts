import { NextRequest, NextResponse } from "next/server";

/**
 * A lightweight in-memory rate limiter for the auth forms (BUG-03/BUG-10:
 * login and signup had no protection against credential stuffing or bot
 * spam). This runs as a single process under pm2 today, so an in-memory
 * counter is the right-sized fix; it resets on restart and wouldn't be
 * shared across multiple instances if this app is ever scaled horizontally
 * — a proper fix at that point would move this to a shared store (Redis).
 */

const WINDOW_MS = 60_000;
// Not trying to be airtight (that would need per-account/exponential
// backoff) — just enough to slow down scripted credential stuffing without
// tripping up a real user retrying a few times, or several people behind
// the same shared/NAT IP.
const MAX_REQUESTS = 20;

const hits = new Map<string, { count: number; resetAt: number }>();

// Bound the map's growth: sweep expired entries every so often instead of on
// every request, so a burst of unique keys can't pin the process open.
let lastSweep = Date.now();
function sweep(now: number) {
  if (now - lastSweep < WINDOW_MS) return;
  lastSweep = now;
  hits.forEach((entry, key) => {
    if (entry.resetAt <= now) hits.delete(key);
  });
}

function isLimited(key: string) {
  const now = Date.now();
  sweep(now);

  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

export function middleware(request: NextRequest) {
  // Login/signup are Server Actions, so a submission is a POST to this same
  // path — only rate-limit those, not the page's own GET page-loads.
  if (request.method !== "POST") return NextResponse.next();

  // Next.js sets NODE_ENV itself ("development" under `next dev`,
  // "production" under a real `next build`/`next start`) — this isn't an
  // env var anyone configures. Skipping it outside production means local
  // dev and the e2e suite (which legitimately bursts well past any sane
  // per-minute human limit across parallel test workers) aren't throttled,
  // without weakening the real protection where it matters.
  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  // Keyed per path too: a burst of signups shouldn't use up a separate
  // person's login attempts, and vice versa.
  const key = `${ip}:${request.nextUrl.pathname}`;

  if (isLimited(key)) {
    return new NextResponse("Too many attempts. Please try again in a minute.", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/login", "/auth/signup"],
};
