module.exports = {


  friendlyName: 'Segment phrase',


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
    return sails.hooks.hanzi.segment(inputs.word)

  }


};
