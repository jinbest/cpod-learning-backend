/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */


module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Sails/Express middleware to run for every HTTP request.                   *
  * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
  *                                                                           *
  * https://sailsjs.com/documentation/concepts/middleware                     *
  *                                                                           *
  ****************************************************************************/

  middleware: {

    /***************************************************************************
    *                                                                          *
    * The order in which middleware should be run for HTTP requests.           *
    * (This Sails app's routes are handled by the "router" middleware below.)  *
    *                                                                          *
    ***************************************************************************/

    passportInit: require('passport').initialize(),
    passportSession: require('passport').session(),

    order: [
      'cookieParser',
      'session',
      'passportInit',
      'passportSession',
      'bodyParser',
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
        sails.log.info(req.session);

        if(req.originalUrl.split('affid=').length > 1) {
          let affid = req.originalUrl.split('affid=')[1].split('&')[0];
          if (req.session.affid) {
            req.session.affid.push({id: affid, timestamp: new Date()});
          } else {
            req.session.affid = [{id: affid, timestamp: new Date()}];
          }
        }

        if(req.affid && req.session.userId) {
            try {
              userInfoQueue.add(
                'UpdateAffiliateLinks',
                {userId: req.session.userId, affid: req.affid},
                {removeOnComplete: true});
              delete req.affid
            } catch (e) {
            }
        }

      }


      return next()
    },

  },

  trustProxy: true,
};
