'use strict';

/**
 * booking controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Strapi time "14:30:00.000" -> "2:30pm"
const formatTime = (value) => {
  const [h, m] = String(value ?? '').split(':').map(Number);
  if (!Number.isInteger(h) || !Number.isInteger(m)) return '';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')}${h < 12 ? 'am' : 'pm'}`;
};

/**
 * A reader's slots as display labels ("10:00am - 10:30am"), sorted by start.
 * The label is also what a booking stores in `timeSlot`, so the form, the
 * booking and the emails all show the same text.
 */
const slotLabels = (timeSlots = []) =>
  timeSlots
    .filter((s) => s.start)
    .sort((a, b) => String(a.start).localeCompare(String(b.start)))
    .map((s) => [formatTime(s.start), formatTime(s.end)].filter(Boolean).join(' - '))
    .filter((label, i, all) => label && all.indexOf(label) === i);

module.exports = createCoreController('api::booking.booking', ({ strapi }) => ({
  /**
   * GET /api/bookings/availability?reader=<slug>&date=YYYY-MM-DD
   * -> { slots: string[], taken: string[] }
   * `slots` are the reader's time slots (edited on the reader in Strapi);
   * `taken` are those already booked that day by a booking that isn't cancelled.
   */
  async availability(ctx) {
    const { reader, date } = ctx.query;
    if (typeof reader !== 'string' || !reader || typeof date !== 'string' || !DATE_RE.test(date)) {
      return ctx.badRequest('reader and date (YYYY-MM-DD) are required');
    }

    const preacher = await strapi.documents('api::preacher.preacher').findFirst({
      filters: { slug: reader },
      fields: ['slug'],
      populate: { timeSlots: true },
    });
    if (!preacher) return ctx.notFound('Reader not found');

    const bookings = await strapi.documents('api::booking.booking').findMany({
      filters: { readerSlug: reader, date, bookingStatus: { $ne: 'cancelled' } },
      fields: ['timeSlot'],
      limit: 1000,
    });

    const slots = slotLabels(preacher.timeSlots ?? []);
    const taken = [...new Set(bookings.map((b) => b.timeSlot))];
    ctx.body = { slots, taken };
  },
}));
