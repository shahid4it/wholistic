'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/subscribers/login',
      handler: 'subscriber.login',
    },
  ],
};
