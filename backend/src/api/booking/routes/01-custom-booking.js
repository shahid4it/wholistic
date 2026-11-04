'use strict';

module.exports = {
  routes: [
    {
      // Public: returns only slot labels (no customer data), so the booking
      // form can grey out times that are already taken.
      method: 'GET',
      path: '/bookings/availability',
      handler: 'booking.availability',
      config: { auth: false },
    },
  ],
};
