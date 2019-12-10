module.exports = {


  friendlyName: 'Discourse',


  description: 'Discourse auth.',


  inputs: {
    payload: {
      type: 'string',
      required: true
    },
    sig: {
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

    const discourse_sso = require('discourse-sso');
    const sso = new discourse_sso('$od1L|2zhqiJ');

    if (sso.validate(inputs.payload, inputs.sig)) {

      let userInfo = this.req.me;

      const nonce = sso.getNonce(payload);
      const userparams = {
        // Required, will throw exception otherwise
        "nonce": nonce,
        "external_id": userInfo.id,
        "email": userInfo.email,
        "username": userInfo.username,
        "name": userInfo.name
      };

      const q = sso.buildLoginString(userparams);

      return this.res.redirect('https://forum.chinesepod.com/session/sso_login?' + q);

    } else {
      throw 'invalid'
    }

  }


};
