module.exports = {


  friendlyName: 'Get',


  description: 'Get token.',


  inputs: {

  },


  exits: {
    invalid: {
      responseType: 'badRequest'
    }
  },


  fn: async function (inputs) {
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;
    if (inputs.userId) {
      return {userId: inputs.userId, token: jwToken.sign(inputs.userId)}
    } else {
      throw 'invalid'
    }

  }


};
