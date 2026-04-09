export function ContactDetails() {
  return (
    <div className="contact-details">
      <div className="contact-details__item">
        <h3>Email</h3>
        <p>
          <a href="mailto:info@wholistic.com">info@wholistic.com</a>
        </p>
      </div>

      <div className="contact-details__item">
        <h3>Phone</h3>
        <p>
          <a href="tel:+1-555-000-0000">+1 (555) 000-0000</a>
        </p>
      </div>

      <div className="contact-details__item">
        <h3>Address</h3>
        <p>
          123 Spiritual Way
          <br />
          New York, NY 10001
          <br />
          United States
        </p>
      </div>

      <div className="contact-details__item">
        <h3>Hours</h3>
        <p>
          Monday - Friday: 9:00 AM - 6:00 PM EST
          <br />
          Saturday: 10:00 AM - 4:00 PM EST
          <br />
          Sunday: Closed
        </p>
      </div>
    </div>
  );
}
