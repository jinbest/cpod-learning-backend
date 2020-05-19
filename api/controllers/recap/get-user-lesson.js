module.exports = {


  friendlyName: 'Get user lesson',


  description: 'Returns relevant User Lesson based on User ID',


  inputs: {

    sessionId: {
      type:  'string',
      description: 'Session ID provided by the PHP site API layer',
      example: '4d99a8f17364d8caedc4b64e8d5b319e973b6abc39addbba58538f594468961a4ce883',
      required: true
    }

  },


  exits: {

    success: {
      description: 'Relevant user lesson sent successfully'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided sessionid is invalid.',
    },

    noLesson: {
      statusCode: '404',
      description: 'User Has No Available Relevant Recap Lessons',
    }

  },


  fn: async function (inputs) {

    let session = await sails.helpers.phpApi.checkSession(inputs.sessionId);

    if(!session) {
      throw 'invalid'
    }

    let user = await User.findOne({
      email: session.email
    });

    if(!user.id) {
      throw 'invalid'
    }

    //Connect Sails Session to PHP API Session
    this.req.session.userId = user.id;

    return await sails.helpers.users.getCurrentLesson(inputs.sessionId)
      .catch(() => {throw 'invalid'})

  }
};
