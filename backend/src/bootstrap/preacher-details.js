'use strict';

/**
 * Reader/healer facts moved from four fixed text fields (abilities, tools,
 * style, topics) to the repeatable `details` list, where each reader picks
 * their own labels. On every start this copies any text still in the old
 * fields into `details` (as "Abilities", "Tools", ...) and then empties them,
 * so it is safe to deploy without a migration step and also catches content
 * written later by import-live.js or add-sample-content.js.
 *
 * The old fields stay in the schema with `visible: false` (hidden in the
 * admin) only so their data survives until this has run on every database;
 * Strapi drops a removed attribute's column before bootstrap code can read it.
 */

const PREACHER = 'api::preacher.preacher';
const LEGACY = [
  ['abilities', 'Abilities'],
  ['tools', 'Tools'],
  ['style', 'Style'],
  ['topics', 'Topics'],
];

module.exports = async (strapi) => {
  const preachers = await strapi.documents(PREACHER).findMany({
    fields: LEGACY.map(([field]) => field),
    filters: { $or: LEGACY.map(([field]) => ({ [field]: { $notNull: true, $ne: '' } })) },
    populate: { details: true },
    limit: 1000,
  });

  let converted = 0;
  for (const preacher of preachers) {
    const existing = new Set((preacher.details ?? []).map((d) => d.label?.trim().toLowerCase()));
    const added = LEGACY.filter(([field, label]) => preacher[field]?.trim() && !existing.has(label.toLowerCase())).map(
      ([field, label]) => ({ label, description: preacher[field].trim() })
    );

    await strapi.documents(PREACHER).update({
      documentId: preacher.documentId,
      data: {
        // keep what an editor already added, then the converted rows
        details: [...(preacher.details ?? []).map(({ id, ...d }) => d), ...added],
        ...Object.fromEntries(LEGACY.map(([field]) => [field, null])),
      },
    });
    converted++;
  }
  if (converted) strapi.log.info(`[preacher-details] moved legacy fields into details for ${converted} reader(s)`);
};
