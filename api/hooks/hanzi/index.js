/**
 * hanzi hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineHanziHook(sails) {

  const fs = require('fs');

  fs.copyFile('lib/cedict_ts.u8.js', 'node_modules/hanzi/lib/data/cedict_ts.u8.js', (err) => {
    if (err) throw err;
    else sails.log.info('Hanzi dictionary updated')
  });

  const hanzi = require("hanzi");

  hanzi.start();

  return {

    decompose: hanzi.decompose,
    decomposeMany: hanzi.decomposeMany,
    definitionLookup: hanzi.definitionLookup,
    dictionarySearch: hanzi.dictionarySearch,
    getExamples: hanzi.getExamples,
    segment: hanzi.segment,
    getCharactersWithComponent: hanzi.getCharactersWithComponent,

    /**
     * Runs when this Sails app loads/lifts.
     */
    initialize: async function() {

      sails.log.info('Initializing custom hook (`hanzi`)');

    }

  };

};
