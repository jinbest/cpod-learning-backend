module.exports = {


  friendlyName: 'Check session ID',


  description: 'Take a PHP Page Session ID and return user email.',


  inputs: {
    sessionId: {
      type: 'string'
    }


  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    // TODO
    let session = await PhpSessions.findOne({id:inputs.sessionId});
    return session.session_user_id;
  }


};

