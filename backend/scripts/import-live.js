'use strict';

/**
 * Copies the PUBLIC content of the live Strapi into the LOCAL database, so the
 * local site looks like production. Reads only the public REST API, so private
 * data (subscribers, bookings, contact messages, private fields like
 * preacher.email) is never fetched.
 *
 * Replaces all local entries of the imported types; subscribers, bookings and
 * contact messages are left alone. Media is downloaded and re-uploaded.
 *
 * Usage (stop `strapi develop` first, sqlite is single-writer):
 *   node scripts/import-live.js [remoteBase]
 * remoteBase defaults to LIVE_STRAPI_URL or http://195.35.56.144/cms
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const qs = require('qs');
const { createStrapi, compileStrapi } = require('@strapi/strapi');

const REMOTE = (process.argv[2] || process.env.LIVE_STRAPI_URL || 'http://195.35.56.144/cms').replace(/\/$/, '');
const SKIP = new Set(['subscriber', 'booking', 'contact-message']);
const META = new Set(['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'locale', 'localizations']);

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const err = new Error(`${res.status} ${url}`);
    err.status = res.status;
    err.body = await res.json().catch(() => null);
    throw err;
  }
  return res.json();
}

// Fetches with `populate`, dropping keys the remote schema doesn't have yet
// (the live server can lag behind the local schema) instead of failing.
async function getWithPopulate(buildUrl, populate, label) {
  for (;;) {
    try {
      return await getJson(buildUrl(populate));
    } catch (e) {
      const key = e.status === 400 && e.body?.error?.details?.key;
      if (!key || !(key in populate)) throw e;
      console.warn(`${label}: remote has no "${key}", skipping it`);
      const { [key]: _, ...rest } = populate;
      populate = rest;
    }
  }
}

async function main() {
  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = 'error';

  const types = Object.values(app.contentTypes).filter(
    (ct) => ct.uid.startsWith('api::') && !SKIP.has(ct.modelName)
  );

  // own fields only: not Strapi's createdBy/updatedBy/localizations, not private fields
  const isContent = (key, attr) =>
    !META.has(key) && !attr.private && (attr.type !== 'relation' || attr.target?.startsWith('api::'));

  // --- populate tree from the local schema (dynamic zones need `on` fragments)
  const populateFor = (attributes) => {
    const out = {};
    for (const [key, attr] of Object.entries(attributes)) {
      if (!isContent(key, attr)) continue;
      if (attr.type === 'media') out[key] = true;
      else if (attr.type === 'relation') out[key] = { fields: ['documentId'] };
      else if (attr.type === 'component') out[key] = componentPopulate(attr.component);
      else if (attr.type === 'dynamiczone')
        out[key] = { on: Object.fromEntries(attr.components.map((c) => [c, componentPopulate(c)])) };
    }
    return out;
  };
  const componentPopulate = (uid) => {
    const nested = populateFor(app.components[uid].attributes);
    return Object.keys(nested).length ? { populate: nested } : true;
  };

  // --- fetch everything first, so a network failure leaves local data untouched
  const remote = {};
  for (const ct of types) {
    const populate = populateFor(ct.attributes);
    if (ct.kind === 'singleType') {
      const url = (p) => `${REMOTE}/api/${ct.info.singularName}?${qs.stringify({ populate: p }, { encodeValuesOnly: true })}`;
      try {
        remote[ct.uid] = [(await getWithPopulate(url, populate, ct.uid)).data].filter(Boolean);
      } catch (e) {
        console.warn(`skip ${ct.uid}: ${e.message}`);
      }
      continue;
    }
    const rows = [];
    try {
      for (let page = 1; ; page++) {
        const url = (p) =>
          `${REMOTE}/api/${ct.info.pluralName}?${qs.stringify({ populate: p, pagination: { page, pageSize: 100 } }, { encodeValuesOnly: true })}`;
        const json = await getWithPopulate(url, populate, ct.uid);
        rows.push(...json.data);
        if (page >= json.meta.pagination.pageCount) break;
      }
    } catch (e) {
      // type not on the live server yet: leave the local entries alone
      if (e.status !== 404 && e.status !== 403) throw e;
      console.warn(`skip ${ct.uid}: ${e.message}`);
      continue;
    }
    remote[ct.uid] = rows;
  }
  for (const [uid, rows] of Object.entries(remote)) console.log(`fetched ${uid}: ${rows.length}`);

  // --- media: download once per remote file id, upload locally
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'strapi-import-'));
  const media = new Map();
  const uploadMedia = async (file) => {
    if (media.has(file.id)) return media.get(file.id);
    const url = file.url.startsWith('http') ? file.url : `${REMOTE}${file.url}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`media ${res.status}: ${url}`);
      media.set(file.id, null);
      return null;
    }
    const filepath = path.join(tmp, `${file.hash}${file.ext}`);
    fs.writeFileSync(filepath, Buffer.from(await res.arrayBuffer()));
    const [entry] = await app.plugin('upload').service('upload').upload({
      data: { fileInfo: { name: file.name, alternativeText: file.alternativeText, caption: file.caption } },
      files: { filepath, originalFilename: file.name, mimetype: file.mime, size: fs.statSync(filepath).size },
    });
    media.set(file.id, entry.id);
    return entry.id;
  };

  // remote documentId -> local documentId, filled as collection entries are created
  const docIds = new Map();

  // Converts a remote value into create/update data for the local schema.
  // withRelations=false drops relations (first pass, before targets exist).
  const convert = async (attributes, value, withRelations) => {
    const out = {};
    for (const [key, attr] of Object.entries(attributes)) {
      if (!isContent(key, attr) || !(key in value)) continue;
      const v = value[key];
      if (attr.type === 'media') {
        if (Array.isArray(v)) out[key] = (await Promise.all(v.map(uploadMedia))).filter(Boolean);
        else out[key] = v ? await uploadMedia(v) : null;
      } else if (attr.type === 'relation') {
        if (!withRelations) continue;
        const map = (r) => docIds.get(r.documentId);
        out[key] = Array.isArray(v) ? v.map(map).filter(Boolean) : (v && map(v)) || null;
      } else if (attr.type === 'component') {
        const attrs = app.components[attr.component].attributes;
        if (Array.isArray(v)) out[key] = await Promise.all(v.map((c) => convert(attrs, c, withRelations)));
        else out[key] = v ? await convert(attrs, v, withRelations) : null;
      } else if (attr.type === 'dynamiczone') {
        out[key] = await Promise.all(
          (v || []).map(async (c) => ({
            __component: c.__component,
            ...(await convert(app.components[c.__component].attributes, c, withRelations)),
          }))
        );
      } else {
        out[key] = v;
      }
    }
    return out;
  };

  // --- replace local content of the imported types
  for (const uid of Object.keys(remote)) {
    for (const doc of await app.documents(uid).findMany({ fields: ['documentId'] })) {
      await app.documents(uid).delete({ documentId: doc.documentId });
    }
  }

  // pass 1: create without relations; pass 2: set relations now that every target exists.
  // Dynamic zones/components are rewritten whole in pass 2 so their relations land too.
  for (const [uid, rows] of Object.entries(remote)) {
    const ct = app.contentTypes[uid];
    for (const row of rows) {
      const created = await app.documents(uid).create({ data: await convert(ct.attributes, row, false) });
      docIds.set(row.documentId, created.documentId);
    }
  }
  for (const [uid, rows] of Object.entries(remote)) {
    const ct = app.contentTypes[uid];
    for (const row of rows) {
      await app.documents(uid).update({
        documentId: docIds.get(row.documentId),
        data: await convert(ct.attributes, row, true),
      });
    }
  }

  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`\nImport complete: ${docIds.size} entries, ${[...media.values()].filter(Boolean).length} media files.`);
  await app.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
