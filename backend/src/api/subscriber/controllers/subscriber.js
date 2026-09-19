'use strict';

/**
 * subscriber controller
 */

const { scryptSync, timingSafeEqual } = require('crypto');
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::subscriber.subscriber', ({ strapi }) => ({
  // Password hashes are private and never leave Strapi, so credentials are checked here.
  async login(ctx) {
    const { email, password } = ctx.request.body ?? {};

    if (typeof email !== 'string' || typeof password !== 'string') {
      return ctx.badRequest('Email and password are required');
    }

    const user = await strapi.db.query('api::subscriber.subscriber').findOne({ where: { email } });

    // Stored format is "<salt>:<hex scrypt hash>". Hash even when the user is missing so timing doesn't reveal it.
    const [salt = '', hash = ''] = (user?.password ?? '').split(':');
    const expected = Buffer.from(hash, 'hex');
    const actual = scryptSync(password, salt, 32);
    const valid = !!user && !!salt && expected.length === actual.length && timingSafeEqual(expected, actual);

    if (!valid) {
      return ctx.unauthorized('Invalid email or password');
    }

    ctx.body = { id: user.id, firstName: user.firstName, lastName: user.lastName };
  },
}));
