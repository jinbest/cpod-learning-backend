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
  'GET /login':                   { action: 'entrance/view-login' },
  'GET /email/confirm':           { action: 'entrance/confirm-email' },
  'GET /logout':                  { action: 'account/logout' },

  'GET /pricing':                 { action: 'onboarding/view-pricing' },
  'GET /checkout':                { action: 'view-checkout' },

  'GET /level/:unused?':          { action: 'onboarding/view-level' },

  //DASHBOARD
  'GET /dash/:unused?':           'DashController.serve',
  'GET /lesson/:unused?/:unused?': 'DashController.serve',
  'GET /podcasts/:unused?': 'PodcastsController.serve',

  //PLACEMENT TEST
  'GET /placement/:unused?': 'PlacementController.serve',

  //RECAP LESSON VIEWS
  'GET /secret-page':             { action: 'recap/view-secret-page' },
  'GET /current-lesson':          { action: 'recap/view-current-lesson' },
  'GET /set-lesson/:unused?':     { action: 'recap/set-lesson' },
  'GET /recap':                   { action: 'recap/view-recap' },
  'GET /recapp':                  { action: 'recap/view-recap' },
  'GET /app':                     { action: 'recap/view-recap' },


  //  ╔╦╗╦╔═╗╔═╗  ╦═╗╔═╗╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗   ┬   ╔╦╗╔═╗╦ ╦╔╗╔╦  ╔═╗╔═╗╔╦╗╔═╗
  //  ║║║║╚═╗║    ╠╦╝║╣  ║║║╠╦╝║╣ ║   ║ ╚═╗  ┌┼─   ║║║ ║║║║║║║║  ║ ║╠═╣ ║║╚═╗
  //  ╩ ╩╩╚═╝╚═╝  ╩╚═╚═╝═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝  └┘   ═╩╝╚═╝╚╩╝╝╚╝╩═╝╚═╝╩ ╩═╩╝╚═╝
  // '/terms':                   '/legal/terms',
  // '/logout':                  '/api/v1/account/logout',

  'GET /chinese/:unused?/:unused?': { action: 'redirect/why-choose-us'},
  'GET /sitemap' :                 { action: 'sitemap'},

  'GET /users':                                          { action: 'recap/users-by-current-lesson' }, //TODO REMOVE THIS WHEN SAFE

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

  //Sample Routes
  // '/api/v1/account/logout':                              { action: 'account/logout' },
  // 'PUT   /api/v1/account/update-profile':                { action: 'account/update-profile' },
  // 'PUT   /api/v1/account/update-billing-card':           { action: 'account/update-billing-card' },
  // 'PUT   /api/v1/entrance/login':                        { action: 'entrance/login' },

  'PUT   /api/v1/account/update-options':                { action: 'account/update-options' },
  'POST   /api/v1/placement/email-results':              { action: 'placement/email-results' },
  'POST  /api/v1/entrance/signup':                       { action: 'entrance/signup' },
  'POST  /api/v1/entrance/login':                        { action: 'entrance/login' },
  'PUT  /api/v1/onboarding/pricing':                     { action: 'onboarding/pricing' },
  'PUT  /api/v1/onboarding/level':                       { action: 'onboarding/level' },
  'PUT  /api/v1/purchase/checkout':                      { action: 'purchase/checkout' },
  'POST  /api/v1/purchase/check-promo':                  { action: 'purchase/check-promo' },
  'POST /api/v1/purchase/check-email':                   { action: 'purchase/check-email' },

  // Information Routes - Health Check
  '/api/v1/request':                                     { action: 'health/request' },
  '/api/v1/health/time':                                 { action: 'health/time' },

  //Lesson Recap Routes
  'GET /api/v1/get-popular-lessons':                     { action: 'recap/get-popular-lessons' },
  'POST /api/v1/recap/get-lessons':                      { action: 'recap/get-user-lesson' },
  'POST /api/v1/recap/request-lesson':                   { action: 'recap/request-lesson' },
  'GET /api/v1/recap/users':                             { action: 'recap/users-by-current-lesson' },

  //General Info Routes
  'GET  /api/v1/health/ip-info':                         { action: 'health/ip-info' },
  'GET /api/v1/health/generate-words':                   { action: 'generate-words' },

  //Dashboard Routes
  'GET /api/v1/dashboard/history':                       { action: 'dashboard/history' },
  'GET /api/v1/dashboard/bookmarks':                     { action: 'dashboard/bookmarks' },
  'GET /api/v1/dashboard/user-courses':                  { action: 'dashboard/user-courses' },
  'GET /api/v1/dashboard/more-courses':                  { action: 'dashboard/more-courses' },
  'GET /api/v1/dashboard/course-lessons':                { action: 'dashboard/course-lessons' },
  'GET /api/v1/dashboard/all-lessons':                   { action: 'dashboard/all-lessons' },
  'POST /api/v1/dashboard/toggle-saved':                 { action: 'dashboard/toggle-saved' },
  'POST /api/v1/dashboard/toggle-studied':               { action: 'dashboard/toggle-studied' },
  'POST /api/v1/dashboard/toggle-course':                { action: 'dashboard/toggle-course' },
  'GET /api/v1/dashboard/get-stats':                     { action: 'dashboard/get-stats' },
  'GET /api/v1/dashboard/get-info':                      { action: 'dashboard/get-info' },


  //Lesson Routes
  'GET /api/v1/lessons/get-lesson':                      { action: 'lessons/get-lesson' },
  'GET /api/v1/lessons/get-dialogue':                    { action: 'lessons/get-dialogue' },
  'GET /api/v1/lessons/get-vocab':                       { action: 'lessons/get-vocab' },
  'GET /api/v1/lessons/get-downloads':                   { action: 'lessons/get-downloads' },
  'GET /api/v1/lessons/get-expansion':                   { action: 'lessons/get-expansion' },
  'GET /api/v1/lessons/get-grammar':                     { action: 'lessons/get-grammar' },
  'GET /api/v1/lessons/get-comments':                    { action: 'lessons/get-comments' },
  'POST /api/v1/lessons/comments':                       { action: 'lessons/comments/create' },
  'PATCH /api/v1/lessons/comments':                      { action: 'lessons/comments/update' },
  'DELETE /api/v1/lessons/comments':                     { action: 'lessons/comments/delete' },

  //Exercise Routes
  'GET /api/v1/exercises/get-questions':                 { action: 'exercises/get-questions' },
  'GET /api/v1/exercises/results':                       { action: 'exercises/results/get' },
  'POST /api/v1/exercises/results':                      { action: 'exercises/results/post' },

  // LOG ROUTES
  'PUT /api/v1/logs/game-logs':                          { action: 'logs/game-logs' },

  // Token Routes
  'GET /api/v1/token':                                   {action: 'token/check'},
  'POST /api/v1/token':                                  {action: 'token/get'},

  //Sample Routes
  // 'POST  /api/v1/entrance/send-password-recovery-email': { action: 'entrance/send-password-recovery-email' },
  // 'POST  /api/v1/entrance/update-password-and-login':    { action: 'entrance/update-password-and-login' },
  // 'POST  /api/v1/deliver-contact-form-message':          { action: 'deliver-contact-form-message' },
};
