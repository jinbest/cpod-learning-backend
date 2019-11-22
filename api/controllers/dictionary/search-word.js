module.exports = {


  friendlyName: 'Search word',


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
    return sails.hooks.hanzi.dictionarySearch(inputs.word)

  }


};
