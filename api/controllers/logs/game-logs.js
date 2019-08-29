module.exports = {


  friendlyName: 'Game logs',


  description: '',


  inputs: {

    clientId: {
      type: 'string',
      required: true
    },
    sessionId: {
      type: 'string',
    },
    identifier: {
      type: 'string',
      description: 'Identifier string signifying a unique device ID'
    },
    logData: {
      type: ['ref'],
      description: `JSON list of objects containing relevant logs in the following format`
    }

  },


  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'Invalid Client ID'
    }

  },


  fn: async function (inputs) {
    //Check App ID Validity
    let valid = await ApiClients.findOne({id: inputs.clientId});

    if (!valid) {
      throw 'invalid'
    }

    //TODO Check Data for Validity

    sails.log.info(inputs.logData);

    if (!inputs.logData) {
      throw 'invalid'
    } else {
      let userInfo = inputs.sessionId ? await NySession.findOne({id: inputs.sessionId}) : null;
      inputs.logData.forEach((log) => {
        log.app = inputs.clientId;
        log.user = userInfo ? userInfo.id : null;
        log.identifier = inputs.identifier ? inputs.identifier : null
      });
      sails.log.info(inputs.logData)
    }

    const createdLogs = await GameLogs.createEach(inputs.logData).fetch();

    return `Created ${createdLogs.length} log${createdLogs.length===1?'':'s'}`
  }


};
