module.exports = {


  friendlyName: 'Get token',


  description: '',


  inputs: {

    email: {
      type: 'string',
      required: true
    }

  },


  exits: {
    invalid: {
      responseType: 'badRequest'
    }
  },


  fn: async function (inputs) {

    const Hashids = require('hashids/cjs');
    const hashids = new Hashids('lithographer-defeater');

    let userData = await User.findOne({email: inputs.email});

    return hashids.encode(userData.id)

  }


};
