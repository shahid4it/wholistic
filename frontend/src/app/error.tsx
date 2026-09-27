"use client";

import Link from "next/link";

// Next.js requires error.tsx to be a client component.
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section">
      <div className="container">
        <div className="row">
          <div className="col-8 offset-2" style={{ textAlign: "center" }}>
            <h3 className="section-title">Something went wrong</h3>
            <p className="body-large">
              Please try again, or head back to the home page.
            </p>
            <button type="button" className="button" onClick={() => reset()}>
              Try again
            </button>{" "}
            <Link href="/" className="button button-outline">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
