/**
 * googleanalytics hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineGoogleanalyticsHook(sails) {

  return {

    /**
     * Runs when this Sails app loads/lifts.
     */
    initialize: async function(done) {

      // Otherwise, create a compiler so that we can watch files.
      sails.after('hook:http:loaded', function () {


          sails.log.info('Initializing custom hook (`googleanalytics`)');

          const ua = require("universal-analytics");

          const expressApp = sails.hooks.http.app;

          expressApp.use(ua.middleware("UA-1176295-62", {cookieName: '_ga'}));

      });

      // Continue lifting Sails.
      return done();

    }

  };

};
