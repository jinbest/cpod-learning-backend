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

    sails.log.info({sessionRaw: this.req.session, sessionId: this.req.session.userId, me: this.req.me, reqRaw: this.req});

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.me.id;

    const validApps = {
      dashboard: ['0r6jo0purpo86683joyeq6tpw8n61tyzcw53yrw9', '7X9w@A!AQJ8$4$4#2eNszv*ecY9s09n3c!Py$b8I'], // 7X9w... added on Feb 05
      recap: ['fsl5rctm7rmw4s1byz4hqocwwz2t04b3u36b4dxt'],
      testing: ['aaaa1111bbbb2222cccc3333'],
    };

    sails.log.info(inputs);

    if (inputs.userId && validApps[inputs.type] && validApps[inputs.type].includes(inputs.key)) {
      return {userId: inputs.userId, token: jwToken.sign({userId: inputs.userId})}
    } else {
      throw 'invalid'
    }
  }
};
