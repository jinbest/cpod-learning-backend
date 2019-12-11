module.exports = {


  friendlyName: 'Decompose word',


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
    return sails.hooks.hanzi.decomposeMany(inputs.word, 2)

  }


};
