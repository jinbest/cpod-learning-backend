module.exports = {


  friendlyName: 'Get user lesson',


  description: 'Returns relevant User Lesson based on User ID',


  inputs: {

    sessionId: {
      type:  'string',
      description: 'Session ID provided by the PHP site API layer',
      example: '4d99a8f17364d8caedc4b64e8d5b319e973b6abc39addbba58538f594468961a4ce883',
    },
    token: {
      type:  'string',
      description: 'JWT access token',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7fSwiaWF0IjoxNTk3MDM1ODM2LCJleHAiOjE1OTk2Mjc4MzZ9.qW7Z3AIikdeXUWiY9TWliPNIf4mbHTNuGZLnIwePNZc',
    },
    version: {
      type: 'string'
    }

  },


  exits: {

    success: {
      description: 'Relevant user lesson sent successfully'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided sessionid or token is invalid.',
    },

    noLesson: {
      statusCode: '404',
      description: 'User Has No Available Relevant Recap Lessons',
    }

  },


  fn: async function (inputs) {

    if (!inputs.sessionId && ! inputs.token) {
      throw 'invalid'
    }

    let user;

    if (inputs.token) {
      let data;
      jwToken.verify(inputs.token, (err, decoded) => {
        if (err) {
          throw 'invalid'
        }
        if (decoded && decoded.data) {
          data = decoded.data
        }
      });
      if (data && data.userId) {
        user = await User.findOne({
          id: data.userId
        });
      }
    } else if (inputs.sessionId) {
      let session = await sails.helpers.phpApi.checkSession(inputs.sessionId);

      sails.log.info(session)

      if(!session) {
        throw 'invalid'
      }

      user = await User.findOne({
        email: session.email
      });
    }



    sails.log.info(user)

    if(!user.id) {
      throw 'invalid'
    }

    //Connect Sails Session to PHP API Session
    this.req.session.userId = user.id;

    return await sails.helpers.users.getCurrentLesson.with({userId: user.id, version: inputs.version})
      .catch(() => {throw 'invalid'})

  }
};
