'use strict';

/**
 * Booking time slots moved from a list hard-coded in the frontend to the
 * `timeSlots` field on each reader/healer (start/end time pickers). The first
 * time this runs it gives every reader without a usable slot the old default
 * list, so booking keeps working after deploy. It only runs once (flag in
 * Strapi's store), so an editor who later removes a reader's slots on purpose
 * isn't overruled on the next start.
 *
 * The flag is `seeded-v2` because the first version stored free-text labels;
 * those rows have no start time, so they're replaced with the defaults.
 */

const PREACHER = 'api::preacher.preacher';
const DEFAULT_SLOTS = [
  { start: '10:00:00.000', end: '10:30:00.000' },
  { start: '11:15:00.000', end: '12:15:00.000' },
  { start: '12:30:00.000', end: '13:30:00.000' },
];

const COMPONENT = 'preachers.time-slot';

/**
 * Strapi titles a collapsed repeatable entry by its first text field; a slot
 * has only times, so the rows would show just an id. Use the start time,
 * unless an editor has since picked something else under "Configure the view".
 */
async function titleRowsByStart(strapi) {
  const components = strapi.plugin('content-manager').service('components');
  const config = await components.findConfiguration({ uid: COMPONENT });
  if (['id', 'documentId', undefined].includes(config?.settings?.mainField)) {
    const { settings, metadatas, layouts } = config;
    await components.updateConfiguration({ uid: COMPONENT }, { settings: { ...settings, mainField: 'start' }, metadatas, layouts });
  }
}

module.exports = async (strapi) => {
  await titleRowsByStart(strapi).catch((err) =>
    strapi.log.warn(`[booking-slots] couldn't set the time slot entry title: ${err.message}`)
  );

  const store = strapi.store({ type: 'plugin', name: 'booking-slots' });
  if (await store.get({ key: 'seeded-v2' })) return;

  const preachers = await strapi.documents(PREACHER).findMany({
    fields: ['slug'],
    populate: { timeSlots: true },
    limit: 1000,
  });

  let filled = 0;
  for (const preacher of preachers) {
    if (preacher.timeSlots?.some((s) => s.start)) continue;
    await strapi.documents(PREACHER).update({
      documentId: preacher.documentId,
      data: { timeSlots: DEFAULT_SLOTS },
    });
    filled++;
  }

  await store.set({ key: 'seeded-v2', value: true });
  if (filled) strapi.log.info(`[booking-slots] added default time slots to ${filled} reader(s)`);
};
