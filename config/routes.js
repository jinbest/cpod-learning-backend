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

  'GET /':                                               { action: 'view-homepage-or-redirect' },

  'GET /login':                                          { action: 'entrance/view-login' },
  'GET /email/confirm':                                  { action: 'entrance/confirm-email' },
  'GET /logout':                                         { action: 'account/logout' },

  'GET /email-signup':                                   { action: 'entrance/view-signup' },
  'GET /get-started':                                    { action: 'entrance/view-signup' },
  'GET /signup':                                         { action: 'entrance/view-signup' },
  'GET /free-signup':                                    { action: 'entrance/view-free-signup' },
  'GET /signup-free':                                    { action: 'view-homepage-or-redirect' },
  'GET /signup-free/:campaignId':                        { action: 'entrance/link-campaign' },
  'GET /email-signup/:campaignId':                       { action: 'entrance/link-campaign' },
  'GET /get-started/:campaignId':                        { action: 'entrance/link-campaign' },
  'GET /signup/:campaignId':                             { action: 'entrance/link-campaign' },
  'GET /free-signup/:campaignId':                        { action: 'entrance/link-campaign' },

  'GET /pricing':                                        { action: 'onboarding/view-pricing' },
  'GET /pricing-alt':                                    { action: 'onboarding/view-pricing-alt' },
  'GET /checkout':                                       { action: 'purchase/view-checkout' },
  'GET /checkout/:promo':                                { action: 'purchase/view-checkout' },
  'GET /upgrade':                                        { action: 'purchase/view-checkout' },
  'GET /upgrade/:promo':                                 { action: 'purchase/view-checkout' },
  'GET /april-fools':                                    '/upgrade/APRILFOOLS',
  'GET /checkout/paypal':                                { action: 'purchase/paypal/view-paypal-pay' },
  'GET /checkout/paypal-success':                        { action: 'purchase/paypal/view-paypal-success' },

  'GET /redeem':                                         { action: 'redeem/view-redeem-voucher' },
  'GET /redeem/:code':                                   { action: 'redeem/redeem-voucher' },
  'GET /redeem-token':                                   { action: 'redeem/view-redeem-access-token' },
  'GET /redeem-token/:code':                             { action: 'redeem/redeem-access-token' },
  'GET /redeem-success':                                 { action: 'redeem/view-redeem-success' },

  'GET /level/:unused?':                                 { action: 'onboarding/view-level' },

  //ONBOARDING
  'GET /choice':                                         { action: 'onboarding/view-new-dash' },
  'GET /switch-page':                                    { action: 'onboarding/view-switch-page' },
  'GET /beta':                                           { action: 'onboarding/view-beta' },
  'GET /beta-how-it-works':                              { action: 'onboarding/view-beta-how-it-works' },
  'GET /beta-confirm':                                   { action: 'onboarding/view-beta-confirm' },
  'GET /beta-confirmed':                                 { action: 'onboarding/view-beta-confirmed' },

  //DASHBOARD
  'GET /dash/:unused?':                                  'HomeController.serve',
  'GET /home/:unused?':                                  'HomeController.serve',
  'GET /latest/:unused?':                                'HomeController.serve',
  'GET /history/:unused?':                               'HomeController.serve',
  'GET /bookmarks/:unused?':                             'HomeController.serve',
  'GET /levels/:unused?':                                'HomeController.serve',
  'GET /feedback/:unused?':                              'HomeController.serve',
  'GET /lesson/:unused?/:unused?':                       'HomeController.serve',
  'GET /explore/:unused?':                               'HomeController.serve',
  'GET /course/:unused?':                                'HomeController.serve',
  'GET /courses/:unused?':                               'HomeController.serve',
  '/podcasts':                                           'https://forum.chinesepod.com/t/weekly-lesson-announcement/6606',
  // 'GET /podcasts/:unused?':                              'PodcastsController.serve',
  // 'GET /dictionary/:unused?':                            'PodcastsController.serve',


  //PLACEMENT TEST
  'GET /placement/:unused?':                             'PlacementController.serve',

  //RECAP LESSON VIEWS
  'GET /secret-page':                                    { action: 'recap/view-secret-page' },
  'GET /secret-page/:level?':                            { action: 'recap/view-secret-page' },
  'GET /recap/list-files/:lessonId?':                    { action: 'recap/view-recap-content-list' },
  'GET /recap/upload-files/:lessonId?':                  'RecapController.serve',
  'GET /super-secret-page':                              { action: 'recap/view-popular-recap-lessons' },
  'GET /current-lesson':                                 { action: 'recap/view-current-lesson' },
  'GET /set-lesson/:lessonId':                           { action: 'recap/set-lesson' },
  'GET /recap':                                          { action: 'recap/view-recap' },
  'GET /recapp':                                         { action: 'recap/view-recap' },
  'GET /app':                                            { action: 'recap/view-recap' },


  //MISC
  'GET /lesson-redirect/:v3id?':                          { action: 'lesson-redirect' },


  //PROMOTIONS
  'GET /expired-promotion':                              { action: 'promotions/view-expired-promo'},
  'GET /live':                                           { action: 'promotions/view-live-stream' },
  'GET /black-friday/:code?':                            { action: 'promotions/view-expired-promo'},
  'GET /black-friday-last-chance/:code?':                { action: 'promotions/view-expired-promo'},
  'GET /cyber-monday/:code?':                            { action: 'promotions/view-expired-promo'},
  'GET /cyber-monday-last-chance/:code?':                { action: 'promotions/view-expired-promo'},
  'GET /holiday-gift/:code?':                            { action: 'promotions/view-expired-promo'},
  'GET /holiday-offer/:code?':                           { action: 'promotions/view-expired-promo'},
  'GET /holiday-offer-card/:code?':                      { action: 'promotions/view-expired-promo'},
  'GET /holiday-offer-alt/:code?':                       { action: 'promotions/view-expired-promo'},
  'GET /holiday-offer-success/:code?':                   { action: 'promotions/view-expired-promo'},
  'GET /cheers/:code?':                                  { action: 'promotions/view-expired-promo'},
  'GET /australia-day/:code?':                           { action: 'promotions/view-expired-promo'},
  'GET /valentines-day/:code?':                          { action: 'promotions/view-expired-promo'},
  'GET /valentines-day-gift/:code?':                     { action: 'promotions/view-expired-promo'},
  'GET /CNY-2020/:code?':                                { action: 'promotions/view-expired-promo'},
  'GET /womens-day/:token':                              { action: 'promotions/create-limited-auth'},
  'GET /womens-day':                                     { action: 'promotions/view-expired-promo'},
  'GET /womens-day-gift':                                { action: 'promotions/view-expired-promo'},
  'GET /easter-2020/:token':                             { action: 'promotions/create-limited-auth'},
  'GET /easter-2020':                                    { action: 'promotions/easter-promo/view-promo'},
  'GET /easter-2020/success':                            { action: 'promotions/easter-promo/view-promo-success'},
  'GET /easter-gift-2020':                               { action: 'promotions/easter-promo/view-gift'},
  'GET /easter-gift-2020/:token':                        { action: 'promotions/create-limited-auth'},
  'GET /easter-gift-2020/success':                       { action: 'promotions/easter-promo/view-gift-success'},

  //PROMOTIONS - REDEEM GIFTS
  'GET /valentines-day-gift/redeem/:code?/:userCode?':   { action: 'promotions/valentines/view-valentines-day-gift-redeem'},
  'GET /valentines-day-gift/redeem/success/:code?':      { action: 'promotions/valentines/view-valentines-day-gift-redeem-success'},
  'GET /redeem-gift/:code?/:userCode?':                  { action: 'redeem/gift-subscription/view-gift-redeem'},
  'GET /redeem-gift/success/:code?':                     { action: 'redeem/gift-subscription/view-gift-redeem-success'},

  //DICTIONARY
  'GET /dictionary-testing/:query?':                     { action: 'view-dictionary' },

  //LEGAL PAGES
  'GET /terms':                                          { action:   'legal/view-terms' },
  'GET /terms-and-conditions':                           { action:   'legal/view-terms' },
  'GET /privacy':                                        { action:   'legal/view-privacy' },

  //DESIGN PAGES
  'GET /logos':                                          { action:   'misc/view-logos' },
  'GET /brand-guidelines':                               { action:   'misc/view-brand-guidelines' },

  //FEEDS
  'GET /feed/:feedType?':                                { action:   'feed/feed' },

  //DOCS
  'GET /api-docs-old/:unused?':                          'SwaggerOldController.serve',
  // 'GET /api-docs/:unused?':                              'SwaggerController.serve',
  '/swagger-old/':                                       '/api-docs-old',
  // '/swagger/':                                           '/api-docs',

  //ADMIN PAGES
  //ACCESS VOUCHER CODES
  'GET /admin/access-code-panel':                        {action: 'admin/access-codes/view-access-code-panel'},
  'GET /admin/comments':                                 {action: 'admin/comments/view-list-all-comments'},
  'GET /admin/livestream':                               {action: 'admin/view-livestream' },
  'GET /admin/lookup/users':                             { action: 'recap/users-by-current-lesson' }, //TODO REMOVE THIS WHEN SAFE
  'GET /admin/lookup/recap/users':                       { action: 'recap/view-list-users' },
  'GET /admin/lookup/charactercrush/users':              { action: 'charactercrush/view-list-users' },

  //MARKETING PAGES
  'GET /marketing/campaign-performance/:code':           {action: 'marketing/view-campaign-performance'},
  'GET /marketing/campaign-performance-all':             {action: 'marketing/view-campaign-performance'},

  //EMAIL MARKETING PAGES
  'GET /unsubscribe/:token':                             { action: 'email/unsubscribe'},
  'GET /unsubscribe':                                    { action: 'email/view-unsubscribe'},
  'GET /unsubscribe/success':                            { action: 'email/view-unsubscribe-success'},

  //  ╔╦╗╦╔═╗╔═╗  ╦═╗╔═╗╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗   ┬   ╔╦╗╔═╗╦ ╦╔╗╔╦  ╔═╗╔═╗╔╦╗╔═╗
  //  ║║║║╚═╗║    ╠╦╝║╣  ║║║╠╦╝║╣ ║   ║ ╚═╗  ┌┼─   ║║║ ║║║║║║║║  ║ ║╠═╣ ║║╚═╗
  //  ╩ ╩╩╚═╝╚═╝  ╩╚═╚═╝═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝  └┘   ═╩╝╚═╝╚╩╝╝╚╝╩═╝╚═╝╩ ╩═╩╝╚═╝
  '/choose':                                             '/choice',
  '/new-dashboard':                                      '/choice',
  '/switch':                                             '/home',
  '/beta-program':                                       '/beta-how-it-works',
  '/beta-promo':                                         '/beta-how-it-works',
  '/switch-back':                                        '/api/v1/account/opt-out-of-new-dashboard',
  '/switchback':                                         '/api/v1/account/opt-out-of-new-dashboard',
  '/old-dashboard':                                      '/api/v1/account/opt-out-of-new-dashboard',


  'GET /api/v1/auth/facebook':                           { controller: 'PassportController', action: 'facebookAuth'},
  'GET /api/v1/auth/facebook/callback':                  { controller: 'PassportController', action: 'facebookCallback'},
  'GET /api/v1/auth/google':                             { controller: 'PassportController', action: 'googleAuth'},
  'GET /api/v1/auth/google/callback':                    { controller: 'PassportController', action: 'googleCallback'},
  'GET /api/v1/sso/discourse':                           { action: 'sso/discourse'},

  'GET /chinese/:unused?/:unused?':                      { action: 'redirect/why-choose-us'},
  'GET /sitemap' :                                       { action: 'sitemap'},

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝
  // …
  'POST /api/v1/webhooks/mautic/update':                 { action: 'webhooks/mautic/update' },
  'POST /api/v1/webhooks/stripe/failed':                 { action: 'webhooks/stripe/failed' },
  'POST /api/v1/webhooks/paypal':                        { action: 'webhooks/paypal' },


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // Note that, in this app, these API endpoints may be accessed using the `Cloud.*()` methods
  // from the Parasails library, or by using those method names as the `action` in <ajax-form>.

  '/api/v1/account/logout':                              { action: 'account/logout' },
  '/api/v1/account/opt-out-of-new-dashboard':            { action: 'account/opt-out-of-new-dashboard' },


  //Payments

  '/api/v1/paypal/cancel':                               { action: 'purchase/paypal/paypal-cancel' },
  'POST /api/v1/paypal/create':                          { action: 'purchase/paypal/paypal-create' },
  'GET /api/v1/paypal/success':                          { action: 'purchase/paypal/paypal-confirm' },
  'GET /api/v1/paypal/cancel':                           { action: 'purchase/paypal/paypal-cancel' },
  'POST /api/v1/paypal/execute':                         { action: 'purchase/paypal/paypal-execute' },
  'POST /api/v1/paypal/execute-checkout':                { action: 'purchase/paypal/paypal-execute-checkout' },
  'POST /api/v1/purchase/paypal/execute-gift-checkout': { action: 'purchase/paypal/paypal-execute-gift-checkout' },

  // ENTRANCE
  'POST   /api/v1/placement/email-results':              { action: 'placement/email-results' },
  'POST  /api/v1/entrance/signup':                       { action: 'entrance/signup' },
  'POST  /api/v1/entrance/login':                        { action: 'entrance/login' },
  'PUT  /api/v1/onboarding/pricing':                     { action: 'onboarding/pricing' },
  'PUT  /api/v1/onboarding/level':                       { action: 'onboarding/level' },
  'PUT  /api/v1/onboarding/redeem':                      { action: 'redeem/redeem-voucher' },
  'PUT  /api/v1/purchase/checkout':                      { action: 'purchase/checkout' },
  'POST  /api/v1/purchase/checkout/paypal/cancel':       { action: 'purchase/checkout' },
  'POST  /api/v1/purchase/check-promo':                  { action: 'purchase/check-promo' },
  'POST /api/v1/purchase/check-email':                   { action: 'purchase/check-email' },
  'PUT   /api/v1/account/update-options':                { action: 'account/update-options' },
  'POST /api/v1/account/subscriptions/update':           { action: 'account/subscription/update-card-details'},
  'POST /api/v1/account/subscriptions/cancel':           { action: 'account/subscription/cancel-stripe-details'},
  'GET /api/v1/account/subscription/subscriptions':      { action: 'account/subscription/get-subscriptions' },
  'GET /api/v1/account/subscription/transactions':       { action: 'account/subscription/get-transactions' },
  'PUT /api/v1/account/settings/update':                 { action: 'account/settings/update-profile'},

  // Information Routes - Health Check
  '/api/v1/request':                                     { action: 'health/request' },
  '/api/v1/health/time':                                 { action: 'health/time' },

  //Lesson Recap Routes
  'GET /api/v1/recap/get-popular-lessons':               { action: 'recap/get-popular-lessons' },
  'GET /api/v1/recap/get-popular-recap-lessons':         { action: 'recap/get-popular-recap-lessons' },
  'GET /api/v1/recap/get-all-recap-lessons':             { action: 'recap/get-all-recap-lessons' },
  'POST /api/v1/recap/get-lessons':                      { action: 'recap/get-user-lesson' },
  'GET  /api/v1/recap/get-content/:lessonId':            { action: 'recap/list-recap-files' },
  'POST /api/v1/recap/request-lesson':                   { action: 'recap/request-lesson' },
  'GET /api/v1/recap/users':                             { action: 'recap/users-by-current-lesson' },
  'POST /api/v1/recap/upload':                           { action: 'recap/upload-recap' },
  // 'POST /api/v1/recap/upload-demo':                      { action: 'recap/upload-recap-demo' },

  //General Info Routes
  'GET /api/v1/health/ip-info':                          { action: 'health/ip-info' },
  'GET /api/v1/health/generate-words':                   { action: 'generate-words' },

  //Dashboard Routes
  'GET /api/v1/dashboard/history':                       { action: 'dashboard/history' },
  'GET /api/v1/dashboard/bookmarks':                     { action: 'dashboard/bookmarks' },
  'GET /api/v1/dashboard/get-course':                    { action: 'dashboard/get-course' },
  'GET /api/v1/dashboard/user-courses':                  { action: 'dashboard/user-courses' },
  'GET /api/v1/dashboard/more-courses':                  { action: 'dashboard/more-courses' },
  'GET /api/v1/dashboard/course-lessons':                { action: 'dashboard/course-lessons' },
  'GET /api/v1/dashboard/all-lessons':                   { action: 'dashboard/all-lessons' },
  'GET /api/v1/dashboard/get-all-lessons':               { action: 'dashboard/get-all-lessons' },
  'GET /api/v1/dashboard/get-bookmarked-lessons':        { action: 'dashboard/get-bookmarked-lessons' },
  'GET /api/v1/dashboard/get-studied-lessons':           { action: 'dashboard/get-studied-lessons' },
  'GET /api/v1/dashboard/all-courses':                   { action: 'dashboard/all-courses' },
  'POST /api/v1/dashboard/toggle-saved':                 { action: 'dashboard/toggle-saved' },
  'POST /api/v1/dashboard/toggle-studied':               { action: 'dashboard/toggle-studied' },
  'POST /api/v1/dashboard/toggle-course':                { action: 'dashboard/toggle-course' },
  'GET /api/v1/dashboard/get-stats':                     { action: 'dashboard/get-stats' },
  'GET /api/v1/dashboard/get-info':                      { action: 'dashboard/get-info' },
  'GET /api/v1/dashboard/onboarding/questions':          { action: 'dashboard/onboarding/get-onboarding-questions'},
  'PUT /api/v1/dashboard/onboarding/questions':          { action: 'dashboard/onboarding/put-onboarding-questions'},
  'GET /api/v1/dashboard/get-suggestions':               { action: 'dashboard/get-suggestions' },
  'PUT /api/v1/dashboard/event':                         { action: 'dashboard/put-event' },

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
  'GET /api/v1/lessons/progress':                        { action: 'lessons/progress/get-lesson-progress' },
  'POST /api/v1/lessons/progress':                       { action: 'lessons/progress/post-lesson-progress',
                                                            cors: {
                                                              allowOrigins: '*',
                                                              allowRequestMethods: 'POST',
                                                              allowAnyOriginWithCredentialsUnsafe: true
                                                            }},

  //Exercise Routes
  'GET /api/v1/exercises/get-questions':                 { action: 'exercises/get-questions' },
  'GET /api/v1/exercises/results':                       { action: 'exercises/results/get' },
  'POST /api/v1/exercises/results':                      { action: 'exercises/results/post' },

  //Feedback Routes
  'POST /api/v1/feedback/dashboard-feedback':            { action: 'feedback/dashboard-feedback' },
  'GET /api/v1/feedback/dashboard-feedback-all':         { action: 'feedback/dashboard-feedback-all' },
  'GET /api/v1/feedback/dashboard-feedback-web':         { action: 'feedback/dashboard-feedback-web' },

  // LOG ROUTES
  'PUT /api/v1/logs/game-logs':                          { action: 'logs/game-logs' },

  // Token Routes
  'GET /api/v1/token':                                   { action: 'token/check'},
  'POST /api/v1/token':                                  { action: 'token/get'},

  //ADS
  'GET /api/v1/ads/android-app':                         { action: 'ads/android-app'},

  //TUTORIALS
  'GET /api/v1/tutorials/android-intro-video':           { action: 'tutorials/android-intro-video'},

  //ACCESS CODES
  'POST /api/v1/admin/access-codes/generate':            { action: 'admin/access-codes/generate-access-codes'},
  'POST /api/v1/admin/access-codes/delete':              { action: 'admin/access-codes/delete-access-codes'},
  'POST /api/v1/admin/livestream/save-livestream-data':  { action: 'admin/livestream/save-livestream-data' },
  'DELETE /api/v1/admin/livestream/delete-livestream-data': { action: 'admin/livestream/delete-livestream-data' },

  //SEARCH
  'GET /api/v1/search/reindex-lessons':                  { action: 'search/reindex-lessons' },
  // 'GET /api/v1/search/reindex-lessons-data':             { action: 'search/reindex-lessons-data' },
  // 'GET /api/v1/search/reindex-courses':                  { action: 'search/reindex-courses' },
  // 'GET /api/v1/search/reindex-vocab':                    { action: 'search/reindex-vocab' },
  // 'GET /api/v1/search/reindex-sentences':                { action: 'search/reindex-sentences' },
  'POST /api/v1/search/search-lessons/:query?':            { action: 'search/search-lessons' },
  'POST /api/v1/search/search-all-lessons/:query?':        { action: 'search/search-all-lessons' },
  'GET /api/v1/search/search-dictionary/:query?':          { action: 'search/search-dictionary' },

  //DICTIONARY
  'GET /api/v1/dictionary/get':                          { action: 'dictionary/get-dictionary-word'},
  'GET /api/v1/dictionary/related':                      { action: 'dictionary/get-related-words'},
  'GET /api/v1/dictionary/search/:word':                 { action: 'dictionary/search-word'},
  'GET /api/v1/dictionary/define/:word':                 { action: 'dictionary/define-word'},
  'GET /api/v1/dictionary/decompose/:word':              { action: 'dictionary/decompose-word'},
  'GET /api/v1/dictionary/examples/:word':               { action: 'dictionary/examples-word'},


  //LABELS
  'GET /api/v1/labels/gift-packages':                    { action: 'labels/gift-package/get-gift-package-labels'},
  'POST /api/v1/labels/gift-packages':                   { action: 'labels/gift-package/post-gift-package-labels'},

  //NOTIFICATIONS
  '/api/v1/notifications':                               { action: 'notifications/subscribe', isSocket: true },

  //Sample Routes
  // 'POST  /api/v1/entrance/send-password-recovery-email': { action: 'entrance/send-password-recovery-email' },
  // 'POST  /api/v1/entrance/update-password-and-login':    { action: 'entrance/update-password-and-login' },
  // 'POST  /api/v1/deliver-contact-form-message':          { action: 'deliver-contact-form-message' },


  //EMAIL MARKETING
  'POST /api/v1/email/unsubscribe-user-email':           { action: 'email/unsubscribe-user'},
  'POST /api/v1/email/subscribe-user-email':             { action: 'email/subscribe-user'},

  'GET /api/v1/octopus/process-inactive':                { action: 'octopus/process-inactive' },
  'GET /api/v1/octopus/process-bounced':                 { action: 'octopus/process-bounced' },
  'GET /api/v1/octopus/process-churned':                 { action: 'octopus/process-churned' },
};
