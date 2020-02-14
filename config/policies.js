/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  'onboarding/view-level': 'is-logged-in',
  'onboarding/view-beta-confirm': 'is-logged-in',
  'onboarding/view-beta-confirmed': 'is-logged-in',
  'placement/*': 'is-logged-in',
  'recap/view-current-lesson': 'is-logged-in',
  'recap/set-lesson': 'is-logged-in',
  'dash/*': 'is-logged-in',
  'home/*': 'is-logged-in',
  'podcasts/*': true,

  'redeem/*': 'is-logged-in',

  'admin/*': 'is-staff',

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


  // // Bypass the `is-logged-in` policy for:
  // 'entrance/*': true,
  // 'account/logout': true,
  // 'onboarding/view-pricing': true,
  // 'view-checkout': true,
  //
  //
  // // Admin Pages
  // 'view-secret-page': true,

};
