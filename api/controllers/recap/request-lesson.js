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
    if (!inputs.sessionId) {
      throw 'invalid'
    }

    let session = await sails.helpers.phpApi.checkSession(inputs.sessionId);

    let userData = await User.findOne({email:session.email});

    await sails.helpers.sendTemplateEmail.with({
      to: 'ugis@chinesepod.com', //'recap-request@chinesepod.com',
      subject: 'Recap Lesson Request',
      template: 'internal/email-notification',
      layout: false,
      templateData: {
        contactName: userData.name,
        contactEmail: userData.email,
        topic: 'Requesting a Recap Lesson', //inputs.topic,
        message: 'Some message' //inputs.message
      }
    });

  }


};
