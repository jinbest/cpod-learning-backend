module.exports = {


  friendlyName: 'Get code',


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
  },


  exits: {
    invalid: {
      responseType: 'badRequest'
    }
  },


  fn: async function (inputs) {
    const validApps = {
      dashboard: ['0r6jo0purpo86683joyeq6tpw8n61tyzcw53yrw9', '7X9w@A!AQJ8$4$4#2eNszv*ecY9s09n3c!Py$b8I', '05sQgTin3hXRVYZIif6aR4H0np4YUVzKsrb2Kz2O'], // 7X9w... added on Feb 05
      landing: ['87eEcKeThR5STfLlRPxDhzxto1DXJ5OZ3ZvXcvHr'],
      recap: ['fsl5rctm7rmw4s1byz4hqocwwz2t04b3u36b4dxt'],
      objective: ['XcvgbyVVcbNA8AZ155XM68CjE4WawyikUfACEdvF'],
      testing: ['aaaa1111bbbb2222cccc3333'],
    };

    if (validApps[inputs.clientType] && validApps[inputs.clientType].includes(inputs.clientKey)) {

      return _.pick(await LinkDevice.create({
        code: await sails.helpers.strings.random('url-friendly').slice(0,6).toUpperCase(),
        client_id: inputs.clientType
      }).fetch(), ['id', 'code']);

    } else {
      throw 'invalid'
    }

  }


};
