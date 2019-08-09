/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝
  // 'GET /':                   { action: 'view-homepage-or-redirect' },
  // 'GET /welcome/:unused?':   { action: 'dashboard/view-welcome' },
  // //
  // 'GET /faq':                { action:   'view-faq' },
  // 'GET /legal/terms':        { action:   'legal/view-terms' },
  // 'GET /legal/privacy':      { action:   'legal/view-privacy' },
  // 'GET /contact':            { action:   'view-contact' },
  // //
  // 'GET /signup':             { action: 'entrance/view-signup' },
  // 'GET /email/confirm':      { action: 'entrance/confirm-email' },
  // 'GET /email/confirmed':    { action: 'entrance/view-confirmed-email' },
  //
  // 'GET /login':              { action: 'entrance/view-login' },
  // 'GET /password/forgot':    { action: 'entrance/view-forgot-password' },
  // 'GET /password/new':       { action: 'entrance/view-new-password' },
  //
  // 'GET /account':            { action: 'account/view-account-overview' },
  // 'GET /account/password':   { action: 'account/view-edit-password' },
  // 'GET /account/profile':    { action: 'account/view-edit-profile' },

  'GET /email-signup':            { action: 'entrance/view-signup' },
  'GET /get-started':             { action: 'entrance/view-signup' },
  'GET /signup':                  { action: 'entrance/view-signup' },
  'GET /email/confirm':           { action: 'entrance/confirm-email' },

  'GET /pricing':                 { action: 'onboarding/view-pricing' },
  'GET /checkout':                { action: 'view-checkout' },

  'GET /level/:unused?':          { action: 'onboarding/view-level' },

  'GET /logout':                  { action: 'account/logout' },

  //RECAP LESSON VIEWS
  'GET /secret-page':             { action: 'recap/view-secret-page' },
  'GET /current-lesson':          { action: 'recap/view-current-lesson' },
  'GET /set-lesson/:unused?':     { action: 'recap/set-lesson' },




  //  ╔╦╗╦╔═╗╔═╗  ╦═╗╔═╗╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗   ┬   ╔╦╗╔═╗╦ ╦╔╗╔╦  ╔═╗╔═╗╔╦╗╔═╗
  //  ║║║║╚═╗║    ╠╦╝║╣  ║║║╠╦╝║╣ ║   ║ ╚═╗  ┌┼─   ║║║ ║║║║║║║║  ║ ║╠═╣ ║║╚═╗
  //  ╩ ╩╩╚═╝╚═╝  ╩╚═╚═╝═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝  └┘   ═╩╝╚═╝╚╩╝╝╚╝╩═╝╚═╝╩ ╩═╩╝╚═╝
  // '/terms':                   '/legal/terms',
  // '/logout':                  '/api/v1/account/logout',


  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝
  // …
  'POST /api/v1/webhooks/mautic/update':                  { action: 'webhooks/mautic/update' },


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // Note that, in this app, these API endpoints may be accessed using the `Cloud.*()` methods
  // from the Parasails library, or by using those method names as the `action` in <ajax-form>.
  '/api/v1/account/logout':                              { action: 'account/logout' },
  'PUT   /api/v1/account/update-options':                { action: 'account/update-options' },
  'POST   /api/v1/placement/email-results':              { action: 'placement/email-results' },
  // 'PUT   /api/v1/account/update-profile':             { action: 'account/update-profile' },
  // 'PUT   /api/v1/account/update-billing-card':        { action: 'account/update-billing-card' },
  // 'PUT   /api/v1/entrance/login':                        { action: 'entrance/login' },
  'POST  /api/v1/entrance/signup':                       { action: 'entrance/signup' },
  'PUT  /api/v1/onboarding/pricing':                     { action: 'onboarding/pricing' },
  'PUT  /api/v1/onboarding/level':                       { action: 'onboarding/level' },

  // Information Routes - Health Check
  '/api/v1/request':                                     { action: 'health/request' },
  '/api/v1/health/time':                                 { action: 'health/time' },

  //Lesson Recap Routes
  'GET /api/v1/get-popular-lessons':                     { action: 'recap/get-popular-lessons' },
  'POST /api/v1/recap/get-lessons':                      { action: 'recap/get-user-lesson' },
  'POST /api/v1/recap/request-lesson':                           { action: 'recap/request-lesson' },

  //General Info Routes
  'GET  /api/v1/health/ip-info':                         { action: 'health/ip-info' },
  'GET /api/v1/health/generate-words':                   { action: 'generate-words' },
  // 'POST  /api/v1/entrance/send-password-recovery-email': { action: 'entrance/send-password-recovery-email' },
  // 'POST  /api/v1/entrance/update-password-and-login':    { action: 'entrance/update-password-and-login' },
  // 'POST  /api/v1/deliver-contact-form-message':          { action: 'deliver-contact-form-message' },
};
