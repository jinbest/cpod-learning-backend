/**
 * elastic hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */


module.exports = function defineElasticHook(sails) {

  const { Client } = require('@elastic/elasticsearch');
  const client = new Client({ node: 'https://search-chinesepod-search-4kecnvmvk5xvsmnrym5jtqbfwe.us-east-1.es.amazonaws.com' });

  return {

    client: client,

    /**
     * Runs when this Sails app loads/lifts.
     */
    initialize: async function() {

      sails.log.info('Initializing custom hook (`elastic-search`)');

    }

  };

};
