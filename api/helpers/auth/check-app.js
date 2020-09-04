module.exports = {


  friendlyName: 'Check app',


  description: '',


  inputs: {
    id: {
      type: 'string'
    },
    key: {
      type: 'string'
    }

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    const validApps = {
      dashboard: ['0r6jo0purpo86683joyeq6tpw8n61tyzcw53yrw9', '7X9w@A!AQJ8$4$4#2eNszv*ecY9s09n3c!Py$b8I', '05sQgTin3hXRVYZIif6aR4H0np4YUVzKsrb2Kz2O'], // 7X9w... added on Feb 05
      landing: ['87eEcKeThR5STfLlRPxDhzxto1DXJ5OZ3ZvXcvHr'],
      recap: ['fsl5rctm7rmw4s1byz4hqocwwz2t04b3u36b4dxt'],
      objective: ['XcvgbyVVcbNA8AZ155XM68CjE4WawyikUfACEdvF'],
      'interactive-tests': ['uelwWshMbcAT6F7JkYbgJiB9nLl9IQkUir3Ki8hX'],
      testing: ['aaaa1111bbbb2222cccc3333'],
    };

    return validApps[inputs.id] && validApps[inputs.id].includes(inputs.key);

  }


};

