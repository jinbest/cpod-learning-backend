/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

// const rateLimit = require('express-rate-limit');
const slowDown = require("express-slow-down");
const RedisStore = require('rate-limit-redis');

const loginLimiter = new slowDown({
  store: new RedisStore({
    redisURL: 'redis://cpod-production.idthgn.ng.0001.use1.cache.amazonaws.com:6379/4'
  }),
  windowMs: 60 * 1000,
  delayAfter: 5,
  delayMs: 1000
});
//
// const lessonsLimiter = slowDown({
//   store: new RedisStore({
//     redisURL: 'redis://cpod-production.idthgn.ng.0001.use1.cache.amazonaws.com:6379/5'
//   }),
//   delayAfter: 50,
//   delayMs: 500
// });

module.exports.policies = {
  'entrance/login': loginLimiter,
  'onboarding/view-level': 'is-logged-in',
  'onboarding/view-beta-confirm': 'is-logged-in',
  'onboarding/view-beta-confirmed': 'is-logged-in',
  'placement/*': 'is-logged-in',
  'recap/view-current-lesson': 'is-logged-in',
  'recap/set-lesson': 'is-logged-in',
  'dash/*': 'is-logged-in',
  'home/*': 'is-logged-in',
  'podcasts/*': true,

  'redeem/view-redeem-voucher': 'is-logged-in',
  'redeem/redeem-voucher': 'is-logged-in',
  'redeem/view-redeem-access-token': 'is-logged-in',
  'redeem/redeem-access-token': 'is-logged-in',
  'redeem/view-redeem-success': 'is-logged-in',

  'admin/*': ['is-logged-in', 'is-staff'],

  'purchase/paypal/view-paypal-pay': 'is-logged-in',

  'sso/discourse': 'is-logged-in',

  'dashboard/*': 'is-authenticated',
  'lessons/*': 'is-authenticated',
  'exercises/*': 'is-authenticated',
  'search/*': 'is-authenticated',
  'token/check': 'is-authenticated',

  'search/reindex-lessons': 'is-super-admin',
  'search/reindex-lessons-data': 'is-super-admin',

  'octopus/*': 'is-super-admin',

  'lessons/progress/post-lesson-progress': true,

  // SwaggerOldController: {'*': 'is-staff'},

};
