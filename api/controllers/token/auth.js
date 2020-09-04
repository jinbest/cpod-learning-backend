module.exports = {


  friendlyName: 'Get',


  description: 'Get token.',


  inputs: {
    key: {
      type: 'string',
      required: true
    },
    type: {
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

    try {

      inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    } catch (e) {

    }

    if (!inputs.userId) {
      return {token: ''}
    }

    const valid = await sails.helpers.auth.checkApp(inputs.type, inputs.key);

    if (valid) {
      return {userId: inputs.userId, token: jwToken.sign({userId: inputs.userId})}
    } else {
      throw 'invalid'
    }
  }
};
