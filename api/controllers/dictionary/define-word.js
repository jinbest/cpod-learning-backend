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
    return sails.hooks.hanzi.definitionLookup(inputs.word)

  }


};
