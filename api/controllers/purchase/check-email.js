module.exports = {


  friendlyName: 'Check email',


  description: '',


  inputs: {
    emailAddress: {
      type: 'string',
      isEmail: true,
      required: true
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    const userData = await User.findOne({email: inputs.emailAddress.toLowerCase()});

    if (userData) {
      return {
        userData: userData.email
      };
    }

    return
  }


};
