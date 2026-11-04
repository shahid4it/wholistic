"use client";

// import styles from "./BookingForm.module.sass";
import { useEffect, useState } from "react";
import { Calendar } from "./Calender";
import { StrapiImage } from "./StrapiImage";

type Availability = { slots: string[]; taken: string[] };

/**
 * When a slot starts on `date` ("YYYY-MM-DD"), in the visitor's local time,
 * read from the start of its label: "10:00am - 10:30am", "9am", "14:30 - 15:30".
 * Labels are free text in Strapi, so an unreadable one returns null and is
 * never treated as past.
 */
function slotStart(date: string, label: string): Date | null {
  const t = label.trim().match(/^(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)?/i);
  const [y, m, d] = date.split("-").map(Number);
  if (!t || !y) return null;
  let hour = Number(t[1]);
  const minute = Number(t[2] ?? 0);
  const meridiem = t[3]?.toLowerCase();
  if (meridiem === "pm" && hour < 12) hour += 12;
  if (meridiem === "am" && hour === 12) hour = 0;
  if (hour > 23 || minute > 59 || (!meridiem && !t[2])) return null;
  return new Date(y, m - 1, d, hour, minute);
}

export function BookingForm({ services = [], reader, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState("");

  // Time slots are set per reader in Strapi; the ones already booked on the
  // chosen date come back as `taken` and are shown greyed out.
  const [date, setDate] = useState("");
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [slotsError, setSlotsError] = useState(false);
  const [timeSlot, setTimeSlot] = useState("");
  const [reloadSlots, setReloadSlots] = useState(0);
  // re-checked every minute so a slot greys out once its start time passes
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  const isPast = (slot: string) => {
    const start = slotStart(date, slot);
    return !!start && start.getTime() <= now;
  };
  // drop a chosen slot once it's no longer bookable
  useEffect(() => {
    if (timeSlot && (isPast(timeSlot) || availability?.taken.includes(timeSlot))) setTimeSlot("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, date, availability, timeSlot]);

  useEffect(() => {
    if (!reader?.slug || !date) return;
    const ctrl = new AbortController();
    setAvailability(null);
    setSlotsError(false);
    fetch(`/api/booking/availability?${new URLSearchParams({ reader: reader.slug, date })}`, {
      signal: ctrl.signal,
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Availability) => {
        setAvailability(data);
        // drop a choice that isn't bookable on this date
        setTimeSlot((t) => (data.slots.includes(t) && !data.taken.includes(t) ? t : ""));
      })
      .catch(() => !ctrl.signal.aborted && setSlotsError(true));
    return () => ctrl.abort();
  }, [reader?.slug, date, reloadSlots]);

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
      // someone else took the slot after it was shown: refresh the list
      if (data.taken) setReloadSlots((n) => n + 1);
      if (!res.ok) throw new Error(data.error || "Failed to book your session");

      setSubmitted({
        date: String(form.get("date") || ""),
        timeSlot: String(form.get("timeSlot") || ""),
        service: String(form.get("service") || ""),
        email: String(form.get("email") || ""),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    // "YYYY-MM-DD" from the calendar, built as a local date so it can't shift a day
    const [y, m, d] = submitted.date.split("-").map(Number);
    const day = y ? new Date(y, m - 1, d) : null;
    const fmt = (opts: Intl.DateTimeFormatOptions) => day?.toLocaleDateString(undefined, opts) ?? "";

    // Same two-column shape as the form: the peach "ticket" sits where the
    // calendar was, the message where the fields were.
    return (
      <div className="booking-success" role="status">
        <div className="booking-success__ticket">
          {day && (
            <div className="booking-success__date">
              <span className="booking-success__month">{fmt({ month: "short" })}</span>
              <span className="booking-success__day">{d}</span>
              <span className="booking-success__weekday">{fmt({ weekday: "long" })}</span>
            </div>
          )}
          <dl className="booking-success__when">
            {submitted.timeSlot && (
              <div>
                <dt>Time</dt>
                <dd>{submitted.timeSlot}</dd>
              </div>
            )}
            {day && (
              <div>
                <dt>Date</dt>
                <dd>{fmt({ month: "long", day: "numeric", year: "numeric" })}</dd>
              </div>
            )}
          </dl>
          {reader?.name && (
            <div className="booking-success__reader">
              {reader.profile?.url ? (
                <StrapiImage src={reader.profile.url} width={56} height={56} alt="" />
              ) : (
                <span className="booking-success__initial" aria-hidden="true">
                  {reader.name.trim().charAt(0)}
                </span>
              )}
              <div>
                <span className="booking-success__label">Your session with</span>
                <span className="booking-success__name">{reader.name.trim()}</span>
              </div>
            </div>
          )}
        </div>

        <div className="booking-success__body">
          <span className="booking-success__badge">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Booking received
          </span>
          <h3 className="booking-success__title">Your session is booked!</h3>
          <p className="booking-success__text">
            We&apos;ll be in touch{submitted.email ? <> at <strong>{submitted.email}</strong></> : ""} to
            confirm{reader?.name ? ` your session with ${reader.name.trim()}` : ""}.
          </p>
          <dl className="booking-success__details">
            {submitted.service && (
              <div>
                <dt>Service</dt>
                <dd>{submitted.service}</dd>
              </div>
            )}
            <div>
              <dt>Status</dt>
              <dd>
                <span className="booking-success__status">Pending confirmation</span>
              </dd>
            </div>
          </dl>
          <button type="button" onClick={onCancel} className="button small booking-success__done">
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="left">
        <Calendar onChange={setDate} />
        <fieldset className="time-slots">
          <legend>Time Slot</legend>
          {slotsError ? (
            <p className="time-slots__note">
              Couldn&apos;t load time slots.{" "}
              <button type="button" className="time-slots__retry" onClick={() => setReloadSlots((n) => n + 1)}>
                Try again
              </button>
            </p>
          ) : !availability ? (
            <p className="time-slots__note">Loading time slots…</p>
          ) : availability.slots.length === 0 ? (
            <p className="time-slots__note">No time slots are available for this reader yet.</p>
          ) : (
            <div className="time-slots__list">
              {availability.slots.map((slot) => {
                const taken = availability.taken.includes(slot);
                const past = !taken && isPast(slot);
                return (
                  // a radio styled as a button: keeps FormData, keyboard and `required`
                  <label
                    key={slot}
                    className={`time-slot${taken ? " is-taken" : ""}${past ? " is-past" : ""}`}
                  >
                    <input
                      type="radio"
                      name="timeSlot"
                      value={slot}
                      required
                      disabled={taken || past}
                      checked={timeSlot === slot}
                      onChange={() => setTimeSlot(slot)}
                    />
                    <span title={taken ? "Already booked" : past ? "This time has passed" : undefined}>
                      {slot}
                    </span>
                  </label>
                );
              })}
              {availability.slots.every((s) => availability.taken.includes(s) || isPast(s)) && (
                <p className="time-slots__note">No times left on this day. Please pick another date.</p>
              )}
            </div>
          )}
        </fieldset>
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
            <select name="service" required defaultValue="">
              <option value="" disabled>
                Choose a service
              </option>
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
