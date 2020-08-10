module.exports = {


  friendlyName: 'Link device',


  description: '',


  inputs: {
    clientKey: {
      type: 'string',
      required: true
    },
    clientType: {
      type: 'string',
      required: true
    },
    id: {
      type: 'number',
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

    const validApps = {
      dashboard: ['0r6jo0purpo86683joyeq6tpw8n61tyzcw53yrw9', '7X9w@A!AQJ8$4$4#2eNszv*ecY9s09n3c!Py$b8I', '05sQgTin3hXRVYZIif6aR4H0np4YUVzKsrb2Kz2O'], // 7X9w... added on Feb 05
      landing: ['87eEcKeThR5STfLlRPxDhzxto1DXJ5OZ3ZvXcvHr'],
      recap: ['fsl5rctm7rmw4s1byz4hqocwwz2t04b3u36b4dxt'],
      objective: ['XcvgbyVVcbNA8AZ155XM68CjE4WawyikUfACEdvF'],
      testing: ['aaaa1111bbbb2222cccc3333'],
    };

    if (validApps[inputs.clientType] && validApps[inputs.clientType].includes(inputs.clientKey)) {

      let linkedAccount = await LinkDevice.findOne({id: inputs.id});

      if (linkedAccount && linkedAccount.refreshToken) {

        await LinkDevice.destroyOne({id: inputs.id});

        let token = randomToken.uid(128);

        await RefreshTokens.create({
          user_id: linkedAccount.user_id,
          refresh_token: token,
          expiry: new Date(Date.now() + sails.config.custom.jwtRefreshExpiry),
          ip_address: this.req.ip,
          user_agent: this.req.headers['user-agent']
        })

        return {
          success: 1,
          token: jwToken.sign({userId: linkedAccount.user_id}),
          refreshToken: token
        }

      } else {
        return {success: 0}
      }

    } else {
      throw 'invalid'
    }

  }


};
