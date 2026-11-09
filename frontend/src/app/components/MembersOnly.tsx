import Link from "next/link";

/**
 * Shown instead of members-only content (podcasts, videos) to visitors who
 * aren't logged in. `next` is the page to come back to after login/signup.
 */
export function MembersOnly({ next, what = "this content" }: { next: string; what?: string }) {
  const q = `?next=${encodeURIComponent(next)}`;
  return (
    <section className="section members-only">
      <div className="container">
        <div className="members-only__card">
          <span className="members-only__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
              <rect x="5" y="10.5" width="14" height="10" rx="2.2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <h2 className="members-only__title">Members only</h2>
          <p className="members-only__text">
            Please log in or create a free account to access {what}.
          </p>
          <div className="members-only__actions">
            <Link href={`/auth/login${q}`} className="button">
              Login
            </Link>
            <Link href={`/auth/signup${q}`} className="button button-outline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
