'use strict';

/**
 * Sends a booking notification to the admin inbox and, when the reader has
 * one on file, to the reader too. Never throws — a booking must never be
 * lost or blocked just because email sending failed or isn't configured yet.
 */

async function notify(strapi, booking) {
  if (!process.env.SMTP_HOST) {
    strapi.log.warn(
      `Booking ${booking.id} created, but SMTP_HOST is not configured — skipping notification email.`
    );
    return;
  }

  const reader = await strapi.db
    .query('api::preacher.preacher')
    .findOne({ where: { slug: booking.readerSlug }, select: ['email'] });

  const subject = `New booking: ${booking.fullName} with ${booking.readerName}`;
  const text = [
    `Reader: ${booking.readerName}`,
    `Service: ${booking.service}`,
    `Date: ${booking.date}`,
    `Time slot: ${booking.timeSlot}`,
    '',
    `From: ${booking.fullName} <${booking.email}>`,
    `Contact: ${booking.contact}`,
    booking.message ? `Message: ${booking.message}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const recipients = [process.env.BOOKING_ADMIN_EMAIL, reader?.email].filter(Boolean);

  await Promise.all(
    recipients.map((to) =>
      strapi
        .plugin('email')
        .service('email')
        .send({ to, subject, text })
        .catch((err) => strapi.log.error(`Failed to send booking email to ${to}: ${err.message}`))
    )
  );
}

module.exports = {
  async afterCreate(event) {
    await notify(strapi, event.result);
  },
};
