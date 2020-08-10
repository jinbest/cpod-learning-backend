module.exports = {


  friendlyName: 'Link device',


  description: '',


  inputs: {

    code: {
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
    let randomToken = require('rand-token');

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let linkedAccount = await LinkDevice.findOne({code: inputs.code, status: 1});

    if (linkedAccount) {

      let token = randomToken.uid(128);

      let userData = await User.findOne({id: inputs.userId}).select('email')

      await NySession.create({
        id: token,
        email: userData.email,
        session_ip_address: this.req.ip,
        client_id: 'CPODJS-dashboard'
      });

      await LinkDevice.updateOne({id: linkedAccount.id}).set({
        status: 2,
        user_id: inputs.userId,
        refreshToken: token
      });

    } else {
      throw 'invalid'
    }

  }


};
