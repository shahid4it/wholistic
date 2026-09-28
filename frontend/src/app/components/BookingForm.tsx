"use client";

// import styles from "./BookingForm.module.sass";
import { useState } from "react";
import { Calendar } from "./Calender";

export function BookingForm({
  services = [],
  timeSlots = ["10:00am -  10:30am", "11:15am - 12:15pm", "12:30pm - 1:30pm"],
  reader,
  onCancel,
}) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.get("fullname"),
          email: form.get("email"),
          contact: form.get("contact"),
          date: form.get("date"),
          timeSlot: form.get("timeSlot"),
          service: form.get("service"),
          message: form.get("message"),
          readerName: reader?.name,
          readerSlug: reader?.slug,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to book your session");

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="form">
        <p className="form-message">
          Your session is booked! We&apos;ll be in touch to confirm.
        </p>
        <button type="button" onClick={onCancel} className="button small">
          Done
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="left">
        <Calendar />
        <label>
          <span>Time Slot</span>
          <select name="timeSlot">
            {timeSlots.map((slot) => (
              <option key={slot}>{slot}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="right">
        <label>
          <span>Full Name</span>
          <input name="fullname" required />
        </label>
        <div className="group">
          <label>
            <span>Email</span>
            <input name="email" type="email" required />
          </label>
          <label>
            <span>Contact</span>
            <input name="contact" type="tel" required />
          </label>
        </div>
        <div className="group">
          <label>
            <span>Services</span>
            <select name="service">
              {services.map(({ title: service }) => (
                <option key={service}>{service}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          <span>Message</span>
          <textarea name="message" placeholder="Message"></textarea>
        </label>
        {error && <p className="error-message">{error}</p>}
        <div className="group buttons">
          <button type="submit" className="button small" disabled={loading}>
            {loading ? "Booking..." : "Book a Session"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="button button-outline small"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
