module.exports = {


  friendlyName: 'Get details',


  description: '',


  inputs: {
    word: {
      type: 'string',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs) {

    // All done.
    let definition = sails.hooks.hanzi.definitionLookup(inputs.word);

    if (!definition) {

      let segments = sails.hooks.hanzi.segment(inputs.word);

      if (segments && segments.length) {
        return segments.map(phrase => sails.hooks.hanzi.definitionLookup(phrase))
      }
    }

    let compounds = sails.hooks.hanzi.getCharactersWithComponent(inputs.word);

    if(Array.isArray(compounds)) {
      compounds = compounds.map(character => sails.hooks.hanzi.definitionLookup(character))
    } else {
      compounds = [];
    }

    return {
      definition: definition,
      compounds: compounds,
      decomposition: sails.hooks.hanzi.decomposeMany(inputs.word, 2),
      related: [].concat(...sails.hooks.hanzi.getExamples(inputs.word)),
      idioms: [].concat(...sails.hooks.hanzi.dictionarySearch(inputs.word)).filter(item => item.definition && item.definition.includes('idiom')),
      lessons: []

    }

  }


};
