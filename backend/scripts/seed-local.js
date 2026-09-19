'use strict';

/**
 * Seeds a LOCAL Strapi database (sqlite) with minimal content, public read
 * permissions, a throw-away admin and a subscribe API token, so the frontend
 * and e2e suite can run without the online server.
 *
 * Usage (stop `strapi develop` first, sqlite is single-writer):
 *   node scripts/seed-local.js
 */

const path = require('path');
const { createStrapi, compileStrapi } = require('@strapi/strapi');

const ADMIN = { email: 'qa-admin@example.com', password: 'Admin!12345', firstname: 'QA', lastname: 'Admin' };
const IMAGES = path.join(__dirname, '..', '..', 'frontend', 'public', 'images');

const uid = (name) => `api::${name}.${name}`;

async function upload(strapi, file) {
  const filepath = path.join(IMAGES, file);
  const stat = require('fs').statSync(filepath);
  const [entry] = await strapi.plugin('upload').service('upload').upload({
    data: { fileInfo: { name: file } },
    files: { filepath, originalFilename: file, mimetype: file.endsWith('.svg') ? 'image/svg+xml' : 'image/png', size: stat.size },
  });
  return entry;
}

async function main() {
  const app = await createStrapi(await compileStrapi()).load();
  const docs = (name) => app.documents(uid(name));

  if ((await docs('preacher').findMany()).length) {
    console.log('Already seeded, nothing to do.');
    return app.destroy();
  }

  // --- media
  const [logo, hero, tarot, reader, founder, intro, faq, tbg] = await Promise.all(
    ['logo.svg', 'hero.png', 'service-tarot.png', 'reader.png', 'founder.png', 'intro-image.png', 'image-faq.png', 'testimonials-bg.png'].map(
      (f) => upload(app, f)
    )
  );

  // --- services
  const services = [];
  for (const [title, slug, type] of [
    ['Tarot Reading', 'tarot-reading', 'reader'],
    ['Astrology', 'astrology', 'reader'],
    ['Reiki Healing', 'reiki-healing', 'healer'],
  ]) {
    services.push(
      await docs('service').create({
        data: {
          title, slug, type, thumbnail: tarot.id, content: `<p>${title} sessions.</p>`,
          sections: [{ __component: 'ui.section', title, content: `Learn more about ${title}.` }],
        },
      })
    );
  }

  // --- preachers (readers + healer)
  const preachers = [];
  for (const [name, slug, specialty, svc] of [
    ['Aria Moon', 'aria-moon', 'reader', [0, 1]],
    ['Leo Sterling', 'leo-sterling', 'reader', [0]],
    ['Sage Willow', 'sage-willow', 'healer', [2]],
  ]) {
    preachers.push(
      await docs('preacher').create({
        data: {
          name, slug, specialty, bio: `${name} has years of experience guiding clients.`, oneliner: `Guidance with ${name}`,
          tags: 'love, career', tools: 'Tarot', topics: 'Relationships', abilities: 'Clairvoyance', style: 'Compassionate',
          rating: 4.8, profile: reader.id, services: svc.map((i) => services[i].documentId),
        },
      })
    );
  }

  // --- testimonials
  const testimonials = [];
  for (const [client, i] of [['Jane D.', 0], ['Mark T.', 1], ['Priya S.', 0]]) {
    testimonials.push(
      await docs('testimonial').create({
        data: { client, content: `<p>${client} loved the session.</p>`, rating: 5, reader: preachers[i].documentId },
      })
    );
  }

  // --- blogs / resources
  const blogs = [];
  for (const [title, slug, category] of [
    ['Understanding Tarot', 'understanding-tarot', 'blog'],
    ['Moon Rituals', 'moon-rituals', 'blog'],
    ['Meditation Basics', 'meditation-basics', 'video'],
    ['Wholistic Podcast #1', 'podcast-1', 'podcast'],
  ]) {
    blogs.push(
      await docs('blog').create({
        data: {
          title, slug, category, summary: `${title} summary`, content: `<p>${title} body.</p>`, tags: 'wellness',
          publishDate: '2026-01-15', thumbnail: tarot.id, author: preachers[0].documentId,
          resourceUrl: category === 'blog' ? undefined : 'https://example.com/resource',
        },
      })
    );
  }

  // --- horoscopes
  for (const sign of ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']) {
    await docs('horoscope').create({
      data: { starName: sign, title: `${sign} Monthly`, content: `<p>${sign} horoscope for the month.</p>`, publishDate: '2026-09-01', image: tbg.id },
    });
  }

  // --- single types
  const testimonialsSection = { __component: 'ui.testimonials', title: 'Kind words', content: 'What clients say', background: tbg.id, testimonials: testimonials.map((t) => t.documentId) };
  const preachersSection = { __component: 'preachers.preachers', title: 'Our Readers', content: 'Meet the team', marquee: 'READERS', preachers: preachers.map((p) => p.documentId) };
  const servicesSection = { __component: 'services.services', title: 'Services', content: 'What we offer', marquee: 'SERVICES', services: services.map((s) => s.documentId) };
  const banner = { __component: 'ui.banner', title: 'Your companion in wholeness', content: 'Readings and healing.', backdrop: hero.id };
  const faqs = {
    __component: 'ui.faqs', title: 'FAQs', content: 'Common questions', image: faq.id,
    faqs: [{ question: 'How do sessions work?', answer: 'Book online and meet by video.' }, { question: 'Can I cancel?', answer: 'Yes, up to 24 hours before.' }],
  };

  await docs('home').create({
    data: {
      sections: [banner, { __component: 'ui.intro', content: '<p>Welcome to Wholistic.</p>', images: [intro.id] }, servicesSection, preachersSection, testimonialsSection, faqs],
    },
  });
  await docs('header').create({
    data: {
      logo: logo.id,
      links: [
        { title: 'Readers', href: '/readers' },
        { title: 'Services', href: '/services' },
        { title: 'Resources', href: '/resources', links: [{ title: 'Blog', href: '/blog' }, { title: 'Videos', href: '/video' }, { title: 'Horoscope', href: '/horoscope' }] },
        { title: 'About', href: '/about' },
        { title: 'Contact', href: '/contact' },
      ],
    },
  });
  await docs('footer').create({
    data: {
      logo: logo.id,
      links: [{ title: 'About', href: '/about' }, { title: 'Contact', href: '/contact' }],
      socials: [{ title: 'Instagram', href: 'https://instagram.com' }],
      copyright: '&copy; 2026 Wholistic',
    },
  });
  await docs('about').create({ data: { sections: [banner, { __component: 'ui.intro', content: '<p>About us.</p>', images: [intro.id] }] } });
  await docs('contact').create({ data: { sections: [banner, { __component: 'ui.section', title: 'Get in touch', content: 'hello@example.com' }] } });
  await docs('services-page').create({ data: { sections: [banner, servicesSection] } });
  await docs('psychics-page').create({ data: { sections: [banner, preachersSection] } });
  await docs('testimonials-page').create({ data: { sections: [banner, testimonialsSection] } });
  await docs('newsletter').create({ data: { title: 'Newsletter', content: 'Stay in touch' } });

  // --- public read permissions (REST + GraphQL share these)
  const publicRole = await app.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  const apis = ['about', 'blog', 'contact', 'footer', 'header', 'home', 'horoscope', 'newsletter', 'preacher', 'psychics-page', 'service', 'services-page', 'testimonial', 'testimonials-page'];
  for (const name of apis) {
    for (const action of ['find', 'findOne']) {
      await app.db.query('plugin::users-permissions.permission').create({ data: { action: `${uid(name)}.${action}`, role: publicRole.id } });
    }
  }

  // --- admin + subscribe token
  const superRole = await app.db.query('admin::role').findOne({ where: { code: 'strapi-super-admin' } });
  await app.service('admin::user').create({ ...ADMIN, isActive: true, roles: [superRole.id] });
  const token = await app.service('admin::api-token').create({
    name: 'local-subscribe', description: 'local e2e', type: 'custom', lifespan: null,
    permissions: ['api::subscriber.subscriber.find', 'api::subscriber.subscriber.create', 'api::subscriber.subscriber.login'],
  });

  console.log('\nSeed complete.');
  console.log(`Admin:  ${ADMIN.email} / ${ADMIN.password}`);
  console.log(`STRAPI_SUBSCRIBE_TOKEN=${token.accessKey}`);
  await app.destroy();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
