'use strict';

/**
 * Reader/healer pills moved from the free-text `tags` field ("Love,Tarot") to
 * the `tagList` relation, so editors pick from the Tag collection. On every
 * start this converts any preacher that still has text but no tags yet, which
 * makes it safe to deploy without a separate migration step. Editors' picks are
 * never overwritten: a preacher with at least one tag is left alone.
 *
 * It also lets the public role read tags: GraphQL drops a relation the caller
 * can't read, so without this the pills silently come back empty.
 */

const PREACHER = 'api::preacher.preacher';
const TAG = 'api::tag.tag';

async function convertTextTags(strapi) {
  const preachers = await strapi.documents(PREACHER).findMany({
    fields: ['tags'],
    filters: { tags: { $notNull: true, $ne: '' } },
    populate: { tagList: { fields: ['documentId'] } },
  });

  // name (case-insensitive) -> documentId, so "love" and "Love" share one tag
  const known = new Map(
    (await strapi.documents(TAG).findMany({ fields: ['name'] })).map((t) => [t.name.toLowerCase(), t.documentId])
  );

  let converted = 0;
  for (const preacher of preachers) {
    if (preacher.tagList.length) continue;
    const names = [...new Set(preacher.tags.split(',').map((t) => t.trim()).filter(Boolean))];
    if (!names.length) continue;

    const ids = [];
    for (const name of names) {
      if (!known.has(name.toLowerCase())) {
        const created = await strapi.documents(TAG).create({ data: { name } });
        known.set(name.toLowerCase(), created.documentId);
      }
      ids.push(known.get(name.toLowerCase()));
    }
    await strapi.documents(PREACHER).update({ documentId: preacher.documentId, data: { tagList: [...new Set(ids)] } });
    converted++;
  }
  if (converted) strapi.log.info(`[preacher-tags] converted text tags for ${converted} preacher(s)`);
}

async function allowPublicRead(strapi) {
  const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  if (!role) return;
  for (const action of [`${TAG}.find`, `${TAG}.findOne`]) {
    const permissions = strapi.db.query('plugin::users-permissions.permission');
    if (!(await permissions.findOne({ where: { action, role: role.id } }))) {
      await permissions.create({ data: { action, role: role.id } });
    }
  }
}

module.exports = async (strapi) => {
  await allowPublicRead(strapi);
  await convertTextTags(strapi);
};
