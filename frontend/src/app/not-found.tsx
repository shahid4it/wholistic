import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <div className="row">
          <div className="col-8 offset-2" style={{ textAlign: "center" }}>
            <h3 className="section-title">Page not found</h3>
            <p className="body-large">
              The page you&apos;re looking for doesn&apos;t exist or has moved.
            </p>
            <Link href="/" className="button">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
