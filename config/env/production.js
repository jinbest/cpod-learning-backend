/**
 * Production environment settings
 * (sails.config.*)
 *
 * What you see below is a quick outline of the built-in settings you need
 * to configure your Sails app for production.  The configuration in this file
 * is only used in your production environment, i.e. when you lift your app using:
 *
 * ```
 * NODE_ENV=production node app
 * ```
 *
 * > If you're using git as a version control solution for your Sails app,
 * > this file WILL BE COMMITTED to your repository by default, unless you add
 * > it to your .gitignore file.  If your repository will be publicly viewable,
 * > don't add private/sensitive data (like API secrets / db passwords) to this file!
 *
 * For more best practices and tips, see:
 * https://sailsjs.com/docs/concepts/deployment0
 */


var bugsnag = require('@bugsnag/js');
var bugsnagExpress = require('@bugsnag/plugin-express');
let pkjson = require('../../package.json');
var bugsnagClient = bugsnag({ apiKey: 'bbd87dc5093af09c41acfb4fc805c784', appVersion: pkjson.version });
bugsnagClient.use(bugsnagExpress);

var bugsnagmiddleware = bugsnagClient.getPlugin('express');

const slowDown = require("express-slow-down");
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const securitySlowLimiter = new slowDown({
  store: new RedisStore({
    redisURL: 'redis://cpod-production.idthgn.ng.0001.use1.cache.amazonaws.com:6379/4'
  }),
  windowMs: 60 * 1000,
  delayAfter: 5,
  delayMs: 2000
});
const securityLimiter = new rateLimit({
  store: new RedisStore({
    redisURL: 'redis://cpod-production.idthgn.ng.0001.use1.cache.amazonaws.com:6379/6',
    expiry: 24 * 60 * 60
  }),
  windowMs: 24 * 60 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later."
});
const contentLimiter = new slowDown({
  store: new RedisStore({
    redisURL: 'redis://cpod-production.idthgn.ng.0001.use1.cache.amazonaws.com:6379/5'
  }),
  windowMs: 5 * 60 * 1000,
  delayAfter: 20,
  delayMs: 500
});

const { Nuxt } = require('nuxt');

// Require Nuxt config
const config = require('../../nuxt.config');

config.env.API_URL = 'https://www.chinesepod.com/api/v1'

// Create a new Nuxt instance
const nuxt = new Nuxt(config);

module.exports = {

  nuxt,

  /**************************************************************************
   *                                                                         *
   * Tell Sails what database(s) it should use in production.                *
   *                                                                         *
   * (https://sailsjs.com/config/datastores)                                 *
   *                                                                         *
   **************************************************************************/
  datastores: {

    /***************************************************************************
     *                                                                          *
     * Configure your default production database.                              *
     *                                                                          *
     * 1. Choose an adapter:                                                    *
     *    https://sailsjs.com/plugins/databases                                 *
     *                                                                          *
     * 2. Install it as a dependency of your Sails app.                         *
     *    (For example:  npm install sails-mysql --save)                        *
     *                                                                          *
     * 3. Then set it here (`adapter`), along with a connection URL (`url`)     *
     *    and any other, adapter-specific customizations.                       *
     *    (See https://sailsjs.com/config/datastores for help.)                 *
     *                                                                          *
     ***************************************************************************/
    default: {
      // Staging Test DB
      adapter: require('sails-mysql'),
      url: 'mysql://cpoddba:tr5mai81@kazuya.chinesepod.com:3306/chinesepod_production',
      //--------------------------------------------------------------------------
      //  /\   To avoid checking it in to version control, you might opt to set
      //  ||   sensitive credentials like `url` using an environment variable.
      //
      //  For example:
      //  ```
      //  sails_datastores__default__url=mysql://admin:myc00lpAssw2D@db.example.com:3306/my_prod_db
      //  ```
      //--------------------------------------------------------------------------

      /****************************************************************************
       *                                                                           *
       * More adapter-specific options                                             *
       *                                                                           *
       * > For example, for some hosted PostgreSQL providers (like Heroku), the    *
       * > extra `ssl: true` option is mandatory and must be provided.             *
       *                                                                           *
       * More info:                                                                *
       * https://sailsjs.com/config/datastores                                     *
       *                                                                           *
       ****************************************************************************/
      // ssl: true,

    },

    backuplogging: {
      adapter: require('sails-mysql'),
      url: 'mysql://cpoddba:fr0t3ll@@cpoddbbak.cx6o0r5nidjs.us-east-1.rds.amazonaws.com:3306/chinesepod_logging'
    },

  },



  models: {

    /***************************************************************************
     *                                                                          *
     * To help avoid accidents, Sails automatically sets the automigration      *
     * strategy to "safe" when your app lifts in production mode.               *
     * (This is just here as a reminder.)                                       *
     *                                                                          *
     * More info:                                                               *
     * https://sailsjs.com/docs/concepts/models-and-orm/model-settings#?migrate *
     *                                                                          *
     ***************************************************************************/
    migrate: 'safe',

    /***************************************************************************
     *                                                                          *
     * If, in production, this app has access to physical-layer CASCADE         *
     * constraints (e.g. PostgreSQL or MySQL), then set those up in the         *
     * database and uncomment this to disable Waterline's `cascadeOnDestroy`    *
     * polyfill.  (Otherwise, if you are using a databse like Mongo, you might  *
     * choose to keep this enabled.)                                            *
     *                                                                          *
     ***************************************************************************/
    // cascadeOnDestroy: false,

  },



  /**************************************************************************
   *                                                                         *
   * Always disable "shortcut" blueprint routes.                             *
   *                                                                         *
   * > You'll also want to disable any other blueprint routes if you are not *
   * > actually using them (e.g. "actions" and "rest") -- but you can do     *
   * > that in `config/blueprints.js`, since you'll want to disable them in  *
   * > all environments (not just in production.)                            *
   *                                                                         *
   ***************************************************************************/
  blueprints: {
    shortcuts: false,
  },



  /***************************************************************************
   *                                                                          *
   * Configure your security settings for production.                         *
   *                                                                          *
   * IMPORTANT:                                                               *
   * If web browsers will be communicating with your app, be sure that        *
   * you have CSRF protection enabled.  To do that, set `csrf: true` over     *
   * in the `config/security.js` file (not here), so that CSRF app can be     *
   * tested with CSRF protection turned on in development mode too.           *
   *                                                                          *
   ***************************************************************************/
  security: {

    /***************************************************************************
     *                                                                          *
     * If this app has CORS enabled (see `config/security.js`) with the         *
     * `allowCredentials` setting enabled, then you should uncomment the        *
     * `allowOrigins` whitelist below.  This sets which "origins" are allowed   *
     * to send cross-domain (CORS) requests to your Sails app.                  *
     *                                                                          *
     * > Replace "https://example.com" with the URL of your production server.  *
     * > Be sure to use the right protocol!  ("http://" vs. "https://")         *
     *                                                                          *
     ***************************************************************************/
    cors: {
      allowOrigins: [
        'https://chinesepod.com',
        'http://chinesepod.com',
        'https://www.chinesepod.com',
        'http://www.chinesepod.com',
      ],
    },

  },



  /***************************************************************************
   *                                                                          *
   * Configure how your app handles sessions in production.                   *
   *                                                                          *
   * (https://sailsjs.com/config/session)                                     *
   *                                                                          *
   * > If you have disabled the "session" hook, then you can safely remove    *
   * > this section from your `config/env/production.js` file.                *
   *                                                                          *
   ***************************************************************************/
  session: {

    /***************************************************************************
     *                                                                          *
     * Production session store configuration.                                  *
     *                                                                          *
     * Uncomment the following lines to finish setting up a package called      *
     * "@sailshq/connect-redis" that will use Redis to handle session data.     *
     * This makes your app more scalable by allowing you to share sessions      *
     * across a cluster of multiple Sails/Node.js servers and/or processes.     *
     * (See http://bit.ly/redis-session-config for more info.)                  *
     *                                                                          *
     * > While @sailshq/connect-redis is a popular choice for Sails apps, many  *
     * > other compatible packages (like "connect-mongo") are available on NPM. *
     * > (For a full list, see https://sailsjs.com/plugins/sessions)            *
     *                                                                          *
     ***************************************************************************/
    adapter: '@sailshq/connect-redis',
    url: 'redis://cpod-production.idthgn.ng.0001.use1.cache.amazonaws.com:6379/1',
    //--------------------------------------------------------------------------
    // /\   OR, to avoid checking it in to version control, you might opt to
    // ||   set sensitive credentials like this using an environment variable.
    //
    // For example:
    // ```
    // sails_session__url=redis://admin:myc00lpAssw2D@bigsquid.redistogo.com:9562/0
    // ```
    //
    //--------------------------------------------------------------------------



    /***************************************************************************
     *                                                                          *
     * Production configuration for the session ID cookie.                      *
     *                                                                          *
     * Tell browsers (or other user agents) to ensure that session ID cookies   *
     * are always transmitted via HTTPS, and that they expire 24 hours after    *
     * they are set.                                                            *
     *                                                                          *
     * Note that with `secure: true` set, session cookies will _not_ be         *
     * transmitted over unsecured (HTTP) connections. Also, for apps behind     *
     * proxies (like Heroku), the `trustProxy` setting under `http` must be     *
     * configured in order for `secure: true` to work.                          *
     *                                                                          *
     * > While you might want to increase or decrease the `maxAge` or provide   *
     * > other options, you should always set `secure: true` in production      *
     * > if the app is being served over HTTPS.                                 *
     *                                                                          *
     * Read more:                                                               *
     * https://sailsjs.com/config/session#?the-session-id-cookie                *
     *                                                                          *
     ***************************************************************************/
    cookie: {
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
      domain: '.chinesepod.com',
    },

  },



  /**************************************************************************
   *                                                                          *
   * Set up Socket.io for your production environment.                        *
   *                                                                          *
   * (https://sailsjs.com/config/sockets)                                     *
   *                                                                          *
   * > If you have disabled the "sockets" hook, then you can safely remove    *
   * > this section from your `config/env/production.js` file.                *
   *                                                                          *
   ***************************************************************************/
  sockets: {

    /***************************************************************************
     *                                                                          *
     * Uncomment the `onlyAllowOrigins` whitelist below to configure which      *
     * "origins" are allowed to open socket connections to your Sails app.      *
     *                                                                          *
     * > Replace "https://example.com" etc. with the URL(s) of your app.        *
     * > Be sure to use the right protocol!  ("http://" vs. "https://")         *
     *                                                                          *
     ***************************************************************************/
    onlyAllowOrigins: [
      'https://chinesepod.com',
      'http://chinesepod.com',
      'https://www.chinesepod.com',
      'http://www.chinesepod.com',
    ],


    /***************************************************************************
     *                                                                          *
     * If you are deploying a cluster of multiple servers and/or processes,     *
     * then uncomment the following lines.  This tells Socket.io about a Redis  *
     * server it can use to help it deliver broadcasted socket messages.        *
     *                                                                          *
     * > Be sure a compatible version of @sailshq/socket.io-redis is installed! *
     * > (See https://sailsjs.com/config/sockets for the latest version info)   *
     *                                                                          *
     * (https://sailsjs.com/docs/concepts/deployment/scaling)                   *
     *                                                                          *
     ***************************************************************************/
    adapter: '@sailshq/socket.io-redis',
    url: 'redis://cpod-production.idthgn.ng.0001.use1.cache.amazonaws.com:6379/2',
    //--------------------------------------------------------------------------
    // /\   OR, to avoid checking it in to version control, you might opt to
    // ||   set sensitive credentials like this using an environment variable.
    //
    // For example:
    // ```
    // sails_sockets__url=redis://admin:myc00lpAssw2D@bigsquid.redistogo.com:9562/0
    // ```
    //--------------------------------------------------------------------------

  },



  /**************************************************************************
   *                                                                         *
   * Set the production log level.                                           *
   *                                                                         *
   * (https://sailsjs.com/config/log)                                        *
   *                                                                         *
   ***************************************************************************/
  log: {
    level: 'warn'
  },

  policies: {
    'entrance/login': [securitySlowLimiter, securityLimiter],
    'entrance/signup': [securitySlowLimiter, securityLimiter],
    'purchase/checkout': [securitySlowLimiter, securityLimiter],
    'lessons/*': ['is-authenticated', contentLimiter],
  },

  http: {

    /***************************************************************************
     *                                                                          *
     * The number of milliseconds to cache static assets in production.         *
     * (the "max-age" to include in the "Cache-Control" response header)        *
     *                                                                          *
     ***************************************************************************/
    cache: 30 * 60 * 1000, // 60 Min

    middleware: {

      /***************************************************************************
       *                                                                          *
       * The order in which middleware should be run for HTTP requests.           *
       * (This Sails app's routes are handled by the "router" middleware below.)  *
       *                                                                          *
       ***************************************************************************/


      passportInit: require('passport').initialize(),
      passportSession: require('passport').session(),

      requestHandler: bugsnagmiddleware.requestHandler,
      errorHandler: bugsnagmiddleware.errorHandler,

      // rateLimiter: rateLimiter,
      // lessonsLimiter: lessonsLimiter,

      // rateLimit: function () {
      //   var client = require('redis').createClient();
      //   var limiter = require('express-limiter')(app, client)
      // },



      order: [
        'requestHandler',
        'cookieParser',
        'session',
        'passportInit',
        'passportSession',
        'bodyParser',
        'errorHandler',
        'compress',
        'affiliates',
        'router',
        'www',
        'favicon',
      ],


      /***************************************************************************
       *                                                                          *
       * The body parser that will handle incoming multipart HTTP requests.       *
       *                                                                          *
       * https://sailsjs.com/config/http#?customizing-the-body-parser             *
       *                                                                          *
       ***************************************************************************/

      bodyParser: (function _configureBodyParser(){
        var skipper = require('skipper');
        var middlewareFn = skipper({ strict: true });
        return middlewareFn;
      })(),

      affiliates: function(req, res, next) {

        if (req.session) {

          try {

            let affiliateTag;
            if (req.query.refer) {

              affiliateTag = req.query.refer;

            } else if (req.query.tag) {

              affiliateTag = req.query.tag;

            } else if (req.query.affid) {

              affiliateTag = req.query.affid;

            }


            if(affiliateTag) {
              if(!req.session.affid) {
                req.session.affid = [];
              }

              req.session.affid.push({
                affiliate_id: affiliateTag,
                createdAt: new Date(),
                url: req.originalUrl,
                ip_address: req.ip
              });

            }

            if(req.session.affid && req.session.userId) {
              try {
                userInfoQueue.add(
                  'UpdateAffiliateLinks',
                  {userId: req.session.userId, affid: req.session.affid},
                  {removeOnComplete: true});
                delete req.session.affid
              } catch (e) {
                sails.hooks.bugsnag.notify(e);
              }
            }

          } catch (e) {
            sails.hooks.bugsnag.notify(e);
          }

        }

        return next()
      },
    },

    /***************************************************************************
     *                                                                          *
     * Proxy settings                                                           *
     *                                                                          *
     * If your app will be deployed behind a proxy/load balancer - for example, *
     * on a PaaS like Heroku - then uncomment the `trustProxy` setting below.   *
     * This tells Sails/Express how to interpret X-Forwarded headers.           *
     *                                                                          *
     * This setting is especially important if you are using secure cookies     *
     * (see the `cookies: secure` setting under `session` above) or if your app *
     * relies on knowing the original IP address that a request came from.      *
     *                                                                          *
     * (https://sailsjs.com/config/http)                                        *
     *                                                                          *
     ***************************************************************************/
    trustProxy: true,

  },



  /**************************************************************************
   *                                                                         *
   * Lift the server on port 80.                                             *
   * (if deploying behind a proxy, or to a PaaS like Heroku or Deis, you     *
   * probably don't need to set a port here, because it is oftentimes        *
   * handled for you automatically.  If you are not sure if you need to set  *
   * this, just try deploying without setting it and see if it works.)       *
   *                                                                         *
   ***************************************************************************/
  // port: 80,



  /**************************************************************************
   *                                                                         *
   * Configure an SSL certificate                                            *
   *                                                                         *
   * For the safety of your users' data, you should use SSL in production.   *
   * ...But in many cases, you may not actually want to set it up _here_.    *
   *                                                                         *
   * Normally, this setting is only relevant when running a single-process   *
   * deployment, with no proxy/load balancer in the mix.  But if, on the     *
   * other hand, you are using a PaaS like Heroku, you'll want to set up     *
   * SSL in your load balancer settings (usually somewhere in your hosting   *
   * provider's dashboard-- not here.)                                       *
   *                                                                         *
   * > For more information about configuring SSL in Sails, see:             *
   * > https://sailsjs.com/config/*#?sailsconfigssl                          *
   *                                                                         *
   **************************************************************************/
  // ssl: undefined,



  /**************************************************************************
   *                                                                         *
   * Production overrides for any custom settings specific to your app.      *
   * (for example, production credentials for 3rd party APIs like Stripe)    *
   *                                                                         *
   * > See config/custom.js for more info on how to configure these options. *
   *                                                                         *
   ***************************************************************************/
  custom: {
    baseUrl: 'https://www.chinesepod.com',
    internalEmailAddress: 'support@chinesepod.com',


    //PAYPAL
    paypalAccount: 'finance@chinesepod.com',
    paypalPublishableKey: 'AWZiTif-WpZUU8mjN2PbrRy_fTYDj2-_VqswzgiEUepQZc7g-jFJFaB4OjnSeU00UQtsReGPMo_tQ7yu',
    paypalSecret: 'EISrDXgJ7P515P2hohehA1SwroUkDWdh54qVm1VbCsgKFuKxPSfTJVzZ-rL_wm19xaSdMrf7OKS49-wC',

    // mailgunDomain: 'mg.example.com',
    // mailgunSecret: 'key-prod_fake_bd32301385130a0bafe030c',
    // stripeSecret: 'sk_prod__fake_Nfgh82401348jaDa3lkZ0d9Hm',
    //--------------------------------------------------------------------------
    // /\   OR, to avoid checking them in to version control, you might opt to
    // ||   set sensitive credentials like these using environment variables.
    //
    // For example:
    // ```
    // sails_custom__mailgunDomain=mg.example.com
    // sails_custom__mailgunSecret=key-prod_fake_bd32301385130a0bafe030c
    // sails_custom__stripeSecret=sk_prod__fake_Nfgh82401348jaDa3lkZ0d9Hm
    // ```
    //--------------------------------------------------------------------------

  },

  apianalytics: {
    onRequest: function (report, req) {
      const ignore = [
        '/api/v1/health/time',
        '/api/v1/webhooks/mautic/update'
      ];

      let userId = null;

      if (req.session && req.session.userId) {
        if (req.session.userId.data) {
          userId = req.session.userId.data
        } else {
          userId = req.session.userId
        }
      }

      if(!ignore.includes(req.path)) {

        loggingQueue.add('Logging Requests',
          {
            userId: userId,
            ip: req.ip,
            url: `https://www.chinesepod.com${req.url}`,
            sessionId: req.session ? req.session.id : '',
            urlbase: `https://www.chinesepod.com${req.path}`,
            referer: req.get('referer'),
            timestamp: new Date().toISOString(),
            ua: req.headers['user-agent']
          },
          {
            attempts: 2,
            timeout: 120000
          }
        );
      }
    },
  }


};
