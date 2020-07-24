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


    const validApps = {
      dashboard: ['0r6jo0purpo86683joyeq6tpw8n61tyzcw53yrw9', '7X9w@A!AQJ8$4$4#2eNszv*ecY9s09n3c!Py$b8I', '05sQgTin3hXRVYZIif6aR4H0np4YUVzKsrb2Kz2O'], // 7X9w... added on Feb 05
      landing: ['87eEcKeThR5STfLlRPxDhzxto1DXJ5OZ3ZvXcvHr'],
      recap: ['fsl5rctm7rmw4s1byz4hqocwwz2t04b3u36b4dxt'],
      objective: ['XcvgbyVVcbNA8AZ155XM68CjE4WawyikUfACEdvF'],
      testing: ['aaaa1111bbbb2222cccc3333'],

    };

    if (inputs.userId && validApps[inputs.type] && validApps[inputs.type].includes(inputs.key)) {
      return {userId: inputs.userId, token: jwToken.sign({userId: inputs.userId})}
    } else {
      throw 'invalid'
    }
  }
};
