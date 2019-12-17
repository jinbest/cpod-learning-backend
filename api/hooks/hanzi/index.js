/**
 * hanzi hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineHanziHook(sails) {

  const hanzi = require("hanzi");

  hanzi.start();

  return {

    decompose: hanzi.decompose,
    decomposeMany: hanzi.decomposeMany,
    definitionLookup: hanzi.definitionLookup,
    dictionarySearch: hanzi.dictionarySearch,
    getExamples: hanzi.getExamples,
    segment: hanzi.segment,

    /**
     * Runs when this Sails app loads/lifts.
     */
    initialize: async function() {

      sails.log.info('Initializing custom hook (`hanzi`)');

    }

  };

};
