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
  'placement/*': 'is-logged-in',
  'recap/view-current-lesson': 'is-logged-in',
  'recap/set-lesson': 'is-logged-in',

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
