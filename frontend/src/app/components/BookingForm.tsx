"use client";

import styles from "./BookingForm.module.sass";
import { Calendar } from "./Calender";

export function BookingForm({
  services = ["Tarot", "Gemstone Healing", "Therapy"],
  timeSlots = ["10:00am -  11:00am", "11:15am - 12:15pm", "12:30pm - 1:30pm"],
  onCancel,
}) {
  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        console.log(Object.fromEntries(new FormData(e.target).entries()));
      }}
    >
      <div className={styles.left}>
        <Calendar />
        <label>
          <span>Time Slot</span>
          <select>
            {timeSlots.map((slot) => (
              <option key={slot}>{slot}</option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.right}>
        <label>
          <span>Full Name</span>
          <input name="fullname" />
        </label>
        <div className={styles.group}>
          <label>
            <span>Email</span>
            <input name="email" />
          </label>
          <label>
            <span>Contact</span>
            <input name="contact" />
          </label>
        </div>
        <div className={styles.group}>
          <label>
            <span>Services</span>
            <select name="service">
              {services.map((service) => (
                <option key={service}>{service}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Minutes</span>
            <select name="duration">
              <option>30 Minutes</option>
              <option>45 Minutes</option>
              <option>1 hour</option>
              <option>1 hour 30 Minutes</option>
              <option>2 hours</option>
            </select>
          </label>
        </div>
        <label>
          <span>Message</span>
          <textarea name="message" placeholder="Message"></textarea>
        </label>
        <div className={styles.group}>
          <button type="submit" className="button small">
            Book a Session
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
