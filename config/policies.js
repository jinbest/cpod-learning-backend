/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

const slowDown = require("express-slow-down");
const RedisStore = require('rate-limit-redis');
const securityLimiter = new slowDown({
  // store: new RedisStore({
  //   redisURL: 'redis://cpod-production.idthgn.ng.0001.use1.cache.amazonaws.com:6379/4'
  // }),
  windowMs: 60 * 1000,
  delayAfter: 5,
  delayMs: 2000
});
const contentLimiter = new slowDown({
  // store: new RedisStore({
  //   redisURL: 'redis://cpod-production.idthgn.ng.0001.use1.cache.amazonaws.com:6379/5'
  // }),
  windowMs: 5 * 60 * 1000,
  delayAfter: 20,
  delayMs: 500
});

module.exports.policies = {
  'entrance/login': securityLimiter,
  'purchase/checkout': securityLimiter,
  'onboarding/view-level': 'is-logged-in',
  'onboarding/view-beta-confirm': 'is-logged-in',
  'onboarding/view-beta-confirmed': 'is-logged-in',
  'placement/*': 'is-logged-in',
  'dash/*': 'is-logged-in',
  'home/*': 'is-logged-in',
  'podcasts/*': true,

  'redeem/view-redeem-voucher': 'is-logged-in',
  'redeem/redeem-voucher': 'is-logged-in',
  'redeem/view-redeem-access-token': 'is-logged-in',
  'redeem/redeem-access-token': 'is-logged-in',
  'redeem/view-redeem-success': 'is-logged-in',

  'recap/view-current-lesson': 'is-logged-in',
  'recap/set-lesson': 'is-logged-in',
  'recap/beta/view-recap-beta-signup': 'is-logged-in',
  'recap/beta/view-recap-beta-feedback': 'is-logged-in',

  'answer/*': 'is-logged-in',

  'admin/*': ['is-logged-in', 'is-staff'],

  'purchase/paypal/view-paypal-pay': 'is-logged-in',

  'sso/discourse': 'is-logged-in',

  'dashboard/*': 'is-authenticated',
  'lessons/*': ['is-authenticated', contentLimiter],
  'lessons/get-sitemap': true,
  'lessons/get-details': true,
  'exercises/*': 'is-authenticated',
  'vocabulary/*': 'is-authenticated',
  'search/*': 'is-authenticated',
  'token/check': 'is-authenticated',
  'account/settings/*': 'is-authenticated',
  'account/subscription/*': 'is-authenticated',
  'account/upload-avatar': 'is-authenticated',
  'account/update-password': 'is-authenticated',
};
