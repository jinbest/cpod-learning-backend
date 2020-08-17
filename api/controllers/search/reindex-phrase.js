module.exports = {


  friendlyName: 'Reindex phrase',


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

    return await sails.helpers.search.reindexPhrase(inputs.word);

  }


};
