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
    'invalid': {
      responseType: 'notFound'
    }
  },


  fn: async function (inputs) {

    sails.log.info(inputs);

    return await sails.helpers.dictionary.getDetails.with(inputs);

  }


};
