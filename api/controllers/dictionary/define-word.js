module.exports = {


  friendlyName: 'Define word',


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

    return definition

  }


};
