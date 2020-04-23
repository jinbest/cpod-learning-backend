/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

const isProduction = sails.config.environment !== 'development';

const slowDown = require("express-slow-down");
const RedisStore = require('rate-limit-redis');

let sensitiveSlowDownOptions = {
  windowMs: 60 * 1000,
  delayAfter: 5,
  delayMs: 2000
};

let slowDownOptions = {
  windowMs: 5 * 60 * 1000,
  delayAfter: 20,
  delayMs: 500
};

if (isProduction) {
  sensitiveSlowDownOptions.store = new RedisStore({
    redisURL: 'redis://cpod-production.idthgn.ng.0001.use1.cache.amazonaws.com:6379/4'
  });
  slowDownOptions.store = new RedisStore({
    redisURL: 'redis://cpod-production.idthgn.ng.0001.use1.cache.amazonaws.com:6379/5'
  });
}

const securityLimiter = new slowDown(sensitiveSlowDownOptions);
const contentLimiter = new slowDown(slowDownOptions);

module.exports.policies = {
  'entrance/login': securityLimiter,
  'purchase/checkout': securityLimiter,
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
  'lessons/*': ['is-authenticated', contentLimiter],
  'exercises/*': 'is-authenticated',
  'search/*': 'is-authenticated',
  'token/check': 'is-authenticated',

  // 'lessons/progress/post-lesson-progress': true,

  'search/reindex-lessons': 'is-super-admin',
  'search/reindex-lessons-data': 'is-super-admin',

  'octopus/*': 'is-super-admin',

  // SwaggerOldController: {'*': 'is-staff'},

};
