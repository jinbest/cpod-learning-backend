/**
 * bugsnag hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineBugsnagHook(sails) {

  // if (process.env.NODE_ENV !== 'production') {
  //   return {
  //     initialize: async function () {
  //       sails.log.info('Ignoring hook (`bugsnag`) for DEV')
  //     }
  //   }
  // }

  var bugsnag = require('@bugsnag/js');
  var bugsnagExpress = require('@bugsnag/plugin-express');
  let pkjson = require('../../../package.json');
  var bugsnagClient = bugsnag({ apiKey: 'bbd87dc5093af09c41acfb4fc805c784', appVersion: pkjson.version });
  bugsnagClient.use(bugsnagExpress);

  return {

    notify: bugsnagClient.notify,
    /**
     * Runs when this Sails app loads/lifts.
     */
    initialize: async function() {

      sails.log.info('Initializing custom hook (`bugsnag`)');

    }

  };

};
