/**
 * Where to send a visitor after login/signup (`?next=` on the auth pages).
 * Only same-site paths are allowed, so the link can't bounce someone to
 * another site ("//evil.com" and "/\evil.com" are protocol-relative).
 */
export function safeNext(value: unknown): string {
  return typeof value === "string" && /^\/(?![/\\])/.test(value) ? value : "/";
}
