module.exports = {


  friendlyName: 'Request Recap Lesson',


  description: 'Request a recap lesson.',


  inputs: {
    emailAddress: {
      type: 'string',
      isEmail: true,
      description: 'Requesting user\'s email address'
    },
    lessonId: {
      type: 'string',
      description: 'Lesson ID of requested lesson'
    },
    sessionId: {
      type: 'string',
      description: 'Logged in user\'s session id'
    }

  },


  exits: {
    success: {
      description: 'Recap lesson request has been filed'
    },
    invalid: {
      responseType: 'badRequest',
      description: 'Provided information had faults.'
    }
  },


  fn: async function (inputs) {
    if (sessionId) {
      await sails.helpers.phpApi.checkSession(inputs.sessionId);
    }

    return;

  }


};
