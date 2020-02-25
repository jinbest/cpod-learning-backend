/**
 * apm hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineApmHook(sails) {

  if (sails.config.environment === 'development') {
    return {
      initialize: async function () {
        sails.log.info('Ignoring hook (`APM`) for DEV')
      }
    }
  }

  let appName = sails.config.environment === 'production' ? 'CPOD-JS-production' : 'CPOD-JS-staging';

  return {

    /**
     * Runs when this Sails app loads/lifts.
     */
    initialize: async function() {

      sails.after('hook:http:loaded', function () {

        sails.log.info('Initializing custom hook (`apm`)');

        var apm = require('elastic-apm-node').start({
          // Override service name from package.json
          // Allowed characters: a-z, A-Z, 0-9, -, _, and space
          serviceName: appName,

          // Use if APM Server requires a token
          // secretToken: '',

          // Set custom APM Server URL (default: http://localhost:8200)
          serverUrl: 'http://52.5.178.72:8200/'
        })

      })

    }

  };

};
