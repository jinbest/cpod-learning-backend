/**
 * jobs hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineJobsHook(sails) {

  if (process.env.NODE_ENV !== 'production' || process.env.sails_environment === 'staging') {
    return {
      initialize: async function () {
        sails.log.info('Ignoring Rozkalns\' hook (`Bull Jobs`) 😎 for DEV')
      }
    }
  } else {
    var Queue = require('bull');

    let loggingQueue = require('./loggingQueue.js');

    let userInfoQueue = require('./userQueue.js');

    return {
      userInfoQueue: userInfoQueue,

      loggingQueue: loggingQueue,

      initialize: async function () {
        sails.log.info('Initializing Rozkalns\' hook (`Bull Jobs`) 😎')
      }
    };
  }
};
