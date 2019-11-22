module.exports = {


  friendlyName: 'Examples word',


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
    return sails.hooks.hanzi.getExamples(inputs.word)

  }


};
