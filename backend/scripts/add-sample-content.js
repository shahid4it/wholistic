'use strict';

/**
 * Adds FICTIONAL sample readers/healers, articles and testimonials to the LOCAL
 * database for testing. All names, bios, articles and reviews are invented
 * placeholders: never import this into the live site as real content.
 *
 * Idempotent: skips practitioners/articles whose slug exists and testimonials
 * already attached to the same reader. Avatars are generated (initials on a
 * gradient); article thumbnails reuse service images already in the library.
 *
 * Usage (stop `strapi develop` first, sqlite is single-writer):
 *   node scripts/add-sample-content.js
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');
const { createStrapi, compileStrapi } = require('@strapi/strapi');

const PRACTITIONERS = [
  {
    name: 'Celeste Rowan', slug: 'celeste-rowan', specialty: 'reader', colors: ['#3b2a6b', '#b48ad8'],
    oneliner: 'Clear, honest answers when your heart needs them most.',
    bio: 'Celeste has read Tarot for fourteen years, starting with a worn Rider-Waite deck inherited from her grandmother. She reads quickly and plainly: she will tell you what the cards show, what is still in your hands to change, and what is better released.\n\nMost of her clients come to her about love and relationships, especially reconnection and "should I stay or go" questions. Outside of readings she teaches beginner Tarot circles.',
    tags: 'Love,Tarot', tools: 'Tarot - Oracle cards', topics: 'Love & relationships - Reconnection - Soulmates',
    abilities: 'Clairvoyant - Empath', style: 'Straightforward', rating: 4.8, totalReadings: 6200, services: ['tarot'],
  },
  {
    name: 'Orion Vale', slug: 'orion-vale', specialty: 'reader', colors: ['#14325c', '#5fa8d3'],
    oneliner: 'Reads the timing in your chart so you can plan your next move.',
    bio: 'Orion is a natal and predictive astrologer who came to the stars from a career in project planning, and it shows: his readings are practical, structured and focused on timing. He works with transits, progressions and solar returns to map out when to push forward and when to rest.\n\nHe is especially sought out for career changes, relocations and big-decision years.',
    tags: 'Astrology,Career', tools: 'Astrology - Numerology', topics: 'Career & money - Life path - Timing & forecasts',
    abilities: 'Intuitive - Analytical', style: 'Practical', rating: 4.7, totalReadings: 4100, services: ['astrology'],
  },
  {
    name: 'Mira Solis', slug: 'mira-solis', specialty: 'reader', colors: ['#5c1f3d', '#e58fb1'],
    oneliner: 'A gentle bridge to loved ones who have crossed over.',
    bio: 'Mira is an evidential medium who first noticed her sensitivity as a child. Her sessions are calm and compassionate, and she focuses on bringing through details that help you recognise who has come forward before sharing their message.\n\nMany of her clients come to her in grief; she also reads for spiritual direction and life purpose.',
    tags: 'Mediumship,Grief', tools: 'Mediumship - Spirit guides', topics: 'Loss & grief - Spirit communication - Life purpose',
    abilities: 'Medium - Clairaudient - Empath', style: 'Compassionate', rating: 4.9, totalReadings: 3800, services: ['tarot', 'therapy'],
  },
  {
    name: 'Jonah Reyes', slug: 'jonah-reyes', specialty: 'reader', colors: ['#1f4d3a', '#7fcf9f'],
    oneliner: 'Finds the patterns in your numbers and your dreams.',
    bio: 'Jonah combines numerology with dream interpretation. He starts every reading with your core numbers and then works through recurring dreams and symbols to show the themes running through your life right now.\n\nHis clients describe his readings as "a puzzle finally clicking into place", particularly at turning points like birthdays, new jobs and new relationships.',
    tags: 'Numerology,Dreams', tools: 'Numerology - Dream interpretation - Astrology', topics: 'Destiny & life path - Personal growth - Dreams',
    abilities: 'Intuitive - Claircognizant', style: 'Inspirational', rating: 4.6, totalReadings: 2500, services: ['astrology'],
  },
  {
    name: 'Leila Haddad', slug: 'leila-haddad', specialty: 'healer', colors: ['#6b3a12', '#f0b46a'],
    oneliner: 'Reiki Master helping you release stress and return to balance.',
    bio: 'Leila is a Usui Reiki Master Teacher with ten years of practice. Her sessions blend Reiki with guided breathing and simple grounding exercises you can keep using at home.\n\nShe works with clients facing burnout, anxiety and life transitions, and offers both in-person and distance sessions.',
    tags: 'Reiki,Stress relief', tools: 'Reiki - Breathwork - Chakra balancing', topics: 'Stress & anxiety - Energy balance - Emotional healing',
    abilities: 'Energy healer - Empath', style: 'Nurturing', rating: 4.9, totalReadings: 1900, services: ['reiki-healing', 'yoga'],
  },
  {
    name: 'Theo Marsh', slug: 'theo-marsh', specialty: 'healer', colors: ['#24364d', '#9fb8d9'],
    oneliner: 'Yoga and sound to quiet the mind and restore the body.',
    bio: 'Theo teaches restorative and yin yoga and leads sound-bath sessions with singing bowls and gongs. He trained in movement therapy after a sports injury taught him how closely the body and mind recover together.\n\nHis one-to-one sessions are tailored to your energy on the day, from slow mobility work to deep relaxation.',
    tags: 'Yoga,Sound healing', tools: 'Yoga - Sound bath - Meditation', topics: 'Mind-body balance - Sleep & rest - Recovery',
    abilities: 'Energy healer - Intuitive', style: 'Calm', rating: 4.7, totalReadings: 1500, services: ['yoga', 'therapy'],
  },
  {
    name: 'Priya Nair', slug: 'priya-nair', specialty: 'healer', colors: ['#3d2468', '#c99be8'],
    oneliner: 'Crystal and gemstone healing for clarity and protection.',
    bio: 'Priya has worked with crystals and gemstones for over a decade. Each session begins with an intuitive scan, after which she builds a crystal layout for what you need: grounding, protection, clarity or heart healing.\n\nShe also offers nutrition-aware lifestyle guidance and sends every client home with a simple crystal routine.',
    tags: 'Crystals,Healing', tools: 'Crystal healing - Gemstones - Meditation', topics: 'Protection - Clarity - Heart healing',
    abilities: 'Energy healer - Clairsentient', style: 'Warm', rating: 4.8, totalReadings: 2100, services: ['gemstone-healing', 'divine-nourishment', 'reiki-healing'],
  },
];

const ARTICLES = [
  {
    title: 'Three-Card Tarot Spreads for Love Questions', author: 'celeste-rowan', thumb: 'tarot_content_large_b2dd2cdb98', date: '2026-09-02',
    summary: 'A simple three-card spread can bring surprising clarity to a relationship question. Here are three layouts to try, and how to read them.',
    body: [
      ['h2', 'Why three cards?'],
      ['p', 'Three cards are enough to tell a story with a beginning, a middle and a direction, without overwhelming you with detail. They are ideal for focused love questions.'],
      ['h3', '1. You, them, the connection'],
      ['p', 'Lay one card for your energy, one for theirs and one for what sits between you. Look for whether the first two cards speak the same language, by suit or by tone.'],
      ['h3', '2. Past, present, potential'],
      ['p', 'The classic spread works beautifully for reconnection questions. The third card is a potential, not a verdict: it shows where things are heading if nothing changes.'],
      ['h3', '3. Stay, go, what I need to know'],
      ['p', 'When you are at a crossroads, let each option have its own card, then draw a third for the lesson underneath the decision.'],
    ],
  },
  {
    title: 'Saturn Return: What It Means and How to Prepare', author: 'orion-vale', thumb: 'astrology_content_large_feea8469b0', date: '2026-08-21',
    summary: 'Around ages 29 and 58, Saturn returns to where it was when you were born. Here is what that transit asks of you, and how to work with it.',
    body: [
      ['h2', 'A cosmic check-in'],
      ['p', 'Saturn takes roughly 29 years to orbit the Sun. When it returns to its natal position, many people feel pressure to get serious about career, relationships and responsibility.'],
      ['h3', 'Common themes'],
      ['p', 'Endings that make room for something sturdier, a sudden clarity about what you will no longer tolerate, and a desire to build something that lasts.'],
      ['h3', 'Working with it'],
      ['p', 'Find your natal Saturn sign and house, note the dates the transit is exact, and treat the period as a time to commit rather than to start from scratch.'],
    ],
  },
  {
    title: 'Signs a Loved One Is Reaching Out From Spirit', author: 'mira-solis', thumb: 'intro_image_316b3a5e90', date: '2026-07-30',
    summary: 'Recurring songs, scents and dreams are some of the most common ways people describe feeling a loved one nearby. Here is how to notice and honour them.',
    body: [
      ['h2', 'Paying attention gently'],
      ['p', 'Signs are rarely dramatic. More often they are small, personal and well timed: a song on the radio at the exact moment you think of someone.'],
      ['h3', 'Common signs'],
      ['p', 'Familiar scents with no source, vivid dreams that feel like a visit, repeating numbers with a personal meaning, and a sudden sense of warmth or company.'],
      ['h3', 'Honouring the connection'],
      ['p', 'Keep a short journal of what you notice. Over time patterns emerge, and many people find the practice itself is a comfort in grief.'],
    ],
  },
  {
    title: 'Your Life Path Number, Explained', author: 'jonah-reyes', thumb: 'astrology_content_small_21405fb258', date: '2026-07-12',
    summary: 'Your life path number is the most important number in numerology. Learn how to calculate it from your birth date and what each number says about you.',
    body: [
      ['h2', 'How to calculate it'],
      ['p', 'Add every digit of your full birth date together, then keep reducing until you reach a single digit. 11, 22 and 33 are master numbers and are not reduced.'],
      ['h3', 'What the numbers mean'],
      ['p', '1 is the pioneer, 2 the peacemaker, 3 the communicator, 4 the builder, 5 the adventurer, 6 the nurturer, 7 the seeker, 8 the achiever and 9 the humanitarian.'],
      ['p', 'Your number does not limit you; it describes the lessons and strengths that tend to show up again and again.'],
    ],
  },
  {
    title: 'What to Expect in Your First Reiki Session', author: 'leila-haddad', thumb: 'reiki_content_large_17d6e4b8f1', date: '2026-09-15',
    summary: 'Nervous about trying Reiki? Here is what actually happens in a session, what you might feel, and how to get the most from it.',
    body: [
      ['h2', 'Before the session'],
      ['p', 'Wear comfortable clothes and arrive a few minutes early. Your practitioner will ask what brings you in and whether there is anything you would like to focus on.'],
      ['h3', 'During'],
      ['p', 'You stay fully clothed, lying or sitting comfortably. The practitioner places their hands lightly on or just above the body. Many people feel warmth, tingling or simply deep relaxation.'],
      ['h3', 'Afterwards'],
      ['p', 'Drink water, take it easy for the rest of the day, and notice how you sleep. Several sessions a few weeks apart usually give the best results.'],
    ],
  },
  {
    title: 'A Ten-Minute Evening Yoga Routine for Better Sleep', author: 'theo-marsh', thumb: 'yoga_content_large_3eaf621e1b', date: '2026-08-05',
    summary: 'Five gentle poses to help your nervous system wind down before bed. No experience needed.',
    body: [
      ['h2', 'Slow down to sleep well'],
      ['p', 'Evening practice is not about effort. These poses lengthen the exhale and signal to your body that it is safe to rest.'],
      ['h3', 'The routine'],
      ['p', 'Child’s pose (2 minutes), seated forward fold (2 minutes), reclined twist each side (1 minute each), legs up the wall (3 minutes) and a final minute of slow breathing.'],
      ['p', 'Dim the lights, put your phone in another room and try it for a week.'],
    ],
  },
  {
    title: 'Five Crystals to Keep on Your Desk', author: 'priya-nair', thumb: 'gemstone_large_147e433dc5', date: '2026-09-24',
    summary: 'Clear quartz, amethyst, citrine, black tourmaline and rose quartz: a starter set for focus, calm and protection while you work.',
    body: [
      ['h2', 'A small ritual for a busy day'],
      ['p', 'Crystals work best as anchors for intention. Keeping a few in view gives you a reason to pause and reset.'],
      ['h3', 'The five'],
      ['p', 'Clear quartz for focus, amethyst for calm, citrine for motivation, black tourmaline for protection from stress, and rose quartz for kindness to yourself and others.'],
      ['p', 'Cleanse them weekly with smoke, sound or moonlight, and hold one for a few breaths whenever you feel scattered.'],
    ],
  },
];

const TESTIMONIALS = [
  ['celeste-rowan', 'Hannah P., Portland, OR', 'Celeste was direct but kind. She picked up on the exact situation without me explaining much, and her advice gave me the confidence to finally have the conversation.', 5],
  ['celeste-rowan', 'Marcus T., Atlanta, GA', 'Fast, clear and spot on about the timing. Things unfolded within a few weeks just like she described.', 5],
  ['orion-vale', 'Dana W., Denver, CO', 'Orion explained my chart in a way that actually made sense. I left with real dates to plan around for my career move.', 5],
  ['orion-vale', 'Sam L., Chicago, IL', 'Very practical reading. I appreciated that he focused on what I can do rather than just predictions.', 4],
  ['mira-solis', 'Rosa M., San Antonio, TX', 'Mira brought through details about my father that no one outside the family knew. I cried, but in the best way. Thank you.', 5],
  ['mira-solis', 'Kevin D., Boston, MA', 'Gentle and comforting. I came in skeptical and left feeling lighter than I have in months.', 5],
  ['jonah-reyes', 'Aisha N., Houston, TX', 'Jonah connected my numbers to a dream I have had for years. It finally makes sense.', 5],
  ['jonah-reyes', 'Ben C., Seattle, WA', 'Interesting and thoughtful reading. Gave me a lot to reflect on.', 4],
  ['leila-haddad', 'Grace H., Phoenix, AZ', 'My first Reiki session ever and I slept better that night than I have all year. Leila made me feel completely at ease.', 5],
  ['leila-haddad', 'Omar F., Miami, FL', 'The breathing exercises she taught me have become part of my daily routine. Highly recommend.', 5],
  ['theo-marsh', 'Lily R., Minneapolis, MN', 'Theo’s sound bath was incredible. I felt deeply relaxed for days afterwards.', 5],
  ['theo-marsh', 'Jordan K., Nashville, TN', 'Great session tailored to my back pain. Gentle, patient and knowledgeable.', 4],
  ['priya-nair', 'Elena S., San Diego, CA', 'Priya’s crystal layout and advice helped me feel grounded during a really stressful move.', 5],
  ['priya-nair', 'Chris B., Raleigh, NC', 'Warm, intuitive and generous with her time. I loved the routine she gave me to use at home.', 5],
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const toHtml = (blocks) => blocks.map(([tag, text]) => `<${tag}>${esc(text)}</${tag}>`).join('');
const initials = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

async function avatar(dir, { name, slug, colors: [a, b] }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
    <rect width="600" height="600" fill="url(#g)"/>
    <circle cx="300" cy="300" r="230" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="4"/>
    <text x="300" y="300" dy=".35em" text-anchor="middle" font-family="Georgia, serif" font-size="210" fill="#fff">${initials(name)}</text>
  </svg>`;
  const filepath = path.join(dir, `${slug}.png`);
  await sharp(Buffer.from(svg)).png().toFile(filepath);
  return filepath;
}

async function main() {
  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = 'error';
  const docs = (name) => app.documents(`api::${name}.${name}`);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sample-content-'));

  const upload = async (filepath, name) => {
    const [entry] = await app.plugin('upload').service('upload').upload({
      data: { fileInfo: { name, alternativeText: name } },
      files: { filepath, originalFilename: path.basename(filepath), mimetype: 'image/png', size: fs.statSync(filepath).size },
    });
    return entry.id;
  };
  const libraryImage = async (hash) =>
    (await app.db.query('plugin::upload.file').findOne({ where: { hash }, select: ['id'] }))?.id ?? null;

  const services = Object.fromEntries(
    (await docs('service').findMany({ fields: ['slug'] })).map((s) => [s.slug, s.documentId])
  );

  // --- practitioners
  const preachers = Object.fromEntries(
    (await docs('preacher').findMany({ fields: ['slug'] })).map((p) => [p.slug, p.documentId])
  );
  let added = { preachers: 0, blogs: 0, testimonials: 0 };
  for (const p of PRACTITIONERS) {
    if (preachers[p.slug]) continue;
    const { colors, services: serviceSlugs, ...data } = p;
    const created = await docs('preacher').create({
      data: {
        ...data,
        profile: await upload(await avatar(tmp, p), `${p.name} avatar`),
        services: serviceSlugs.map((s) => services[s]).filter(Boolean),
      },
    });
    preachers[p.slug] = created.documentId;
    added.preachers++;
  }

  // --- service assignments (manyToMany): only adds links, never removes any.
  // Also covers the readers imported from live, whose links don't survive the
  // switch from the old manyToOne relation.
  const assignments = {
    fatima: ['tarot', 'astrology'],
    maricia: ['gemstone-healing', 'tarot'],
    'ana-farooq': ['astrology', 'divine-nourishment'],
    ...Object.fromEntries(PRACTITIONERS.map((p) => [p.slug, p.services])),
  };
  let linked = 0;
  for (const [slug, wanted] of Object.entries(assignments)) {
    if (!preachers[slug]) continue;
    const current = await docs('preacher').findOne({
      documentId: preachers[slug], populate: { services: { fields: ['slug'] } },
    });
    const have = new Set(current.services.map((s) => s.slug));
    const missing = wanted.filter((s) => services[s] && !have.has(s));
    if (!missing.length) continue;
    await docs('preacher').update({
      documentId: preachers[slug],
      data: { services: [...current.services.map((s) => s.documentId), ...missing.map((s) => services[s])] },
    });
    linked += missing.length;
  }
  if (linked) console.log(`linked ${linked} practitioner-service assignments`);

  // --- articles
  const blogSlugs = new Set((await docs('blog').findMany({ fields: ['slug'] })).map((b) => b.slug));
  for (const a of ARTICLES) {
    const slug = a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (blogSlugs.has(slug)) continue;
    await docs('blog').create({
      data: {
        title: a.title, slug, summary: a.summary, content: toHtml(a.body), category: 'blog',
        publishDate: a.date, author: preachers[a.author], thumbnail: await libraryImage(a.thumb),
      },
    });
    added.blogs++;
  }

  // --- testimonials
  const sampleTestimonials = [];
  for (const [reader, client, content, rating] of TESTIMONIALS) {
    const exists = await docs('testimonial').findFirst({
      filters: { client, reader: { slug: reader } }, fields: ['documentId'],
    });
    if (exists) {
      sampleTestimonials.push(exists.documentId);
      continue;
    }
    const created = await docs('testimonial').create({
      data: { client, content, rating, reader: preachers[reader] },
    });
    sampleTestimonials.push(created.documentId);
    added.testimonials++;
  }

  // --- listing pages show curated sections, not every entry: add the samples to
  // the Readers, Testimonials and Home pages' preachers/testimonials sections.
  // Dynamic zones are rewritten whole, so every section is rebuilt from its current
  // data (media -> ids, relations -> documentIds) before appending.
  const appendToSection = async (pageName, component, field, ids) => {
    const ct = app.contentTypes[`api::${pageName}.${pageName}`];
    const deep = (attrs) => {
      const out = {};
      for (const [k, at] of Object.entries(attrs)) {
        if (at.type === 'media' || at.type === 'relation') out[k] = true;
        else if (at.type === 'component') out[k] = { populate: deep(app.components[at.component].attributes) };
        else if (at.type === 'dynamiczone')
          out[k] = { on: Object.fromEntries(at.components.map((c) => [c, { populate: deep(app.components[c].attributes) }])) };
      }
      return out;
    };
    const toData = (attrs, v) => {
      const out = {};
      for (const [k, at] of Object.entries(attrs)) {
        if (!(k in v) || ['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'locale'].includes(k)) continue;
        if (at.type === 'relation' && !at.target?.startsWith('api::')) continue;
        const val = v[k];
        if (at.type === 'media') out[k] = Array.isArray(val) ? val.map((m) => m.id) : val?.id ?? null;
        else if (at.type === 'relation') out[k] = Array.isArray(val) ? val.map((r) => r.documentId) : val?.documentId ?? null;
        else if (at.type === 'component') {
          const ca = app.components[at.component].attributes;
          out[k] = Array.isArray(val) ? val.map((c) => toData(ca, c)) : val ? toData(ca, val) : null;
        } else if (at.type === 'dynamiczone')
          out[k] = (val || []).map((c) => ({ __component: c.__component, ...toData(app.components[c.__component].attributes, c) }));
        else out[k] = val;
      }
      return out;
    };
    const page = await app.documents(ct.uid).findFirst({ populate: deep(ct.attributes) });
    const section = page?.sections?.find((s) => s.__component === component);
    if (!section) return console.warn(`No ${component} section on ${pageName}; skipped.`);
    const data = toData(ct.attributes, page);
    const target = data.sections[page.sections.indexOf(section)];
    const missing = ids.filter((id) => !target[field].includes(id));
    if (!missing.length) return;
    target[field] = [...target[field], ...missing];
    await app.documents(ct.uid).update({ documentId: page.documentId, data });
    console.log(`${pageName}: added ${missing.length} to ${component}.${field}`);
  };
  await appendToSection('psychics-page', 'preachers.preachers', 'preachers',
    PRACTITIONERS.map((p) => preachers[p.slug]));
  await appendToSection('testimonials-page', 'ui.testimonials', 'testimonials', sampleTestimonials);
  await appendToSection('home', 'preachers.preachers', 'preachers', PRACTITIONERS.map((p) => preachers[p.slug]));
  await appendToSection('home', 'ui.testimonials', 'testimonials', sampleTestimonials);

  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`\nAdded ${added.preachers} practitioners, ${added.blogs} articles, ${added.testimonials} testimonials.`);
  // let the upload plugin's background writes settle before closing the pool
  await new Promise((r) => setTimeout(r, 1000));
  await app.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
