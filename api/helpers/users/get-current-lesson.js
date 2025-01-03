module.exports = {


  friendlyName: 'Get user lesson',


  description: 'Returns relevant User Lesson based on User ID',


  inputs: {

    sessionId: {
      type:  'string',
      description: 'Session ID provided by the PHP site API layer',
      example: '4d99a8f17364d8caedc4b64e8d5b319e973b6abc39addbba58538f594468961a4ce883',
    },
    userId: {
      type: 'number',
      isInteger: true
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
      statusCode: '400',
      description: 'The provided sessionid is invalid.',
    },

    noLesson: {
      statusCode: '404',
      description: 'User Has No Available Relevant Recap Lessons',
    }

  },


  fn: async function (inputs) {

    const minTimer = 60; //minutes

    let user = {};

    if (inputs.sessionId) {
      let session = await sails.helpers.phpApi.checkSession(inputs.sessionId);

      if(!session) {
        throw 'invalid'
      }

      user = await User.findOne({
        email: session.email
      });

    } else if (inputs.userId) {

      user = await User.findOne({
        id: inputs.userId
      });

    }

    if(!user.id) {
      throw 'invalid'
    }

    let latestStudiedLesson = false;

    let currentLesson = await UserOptions.findOne({user_id: user.id, option_key: 'currentLesson'});

    if (currentLesson) {

      latestStudiedLesson = currentLesson['option_value']

      if (currentLesson['updatedAt'] < new Date(Date.now() - 60 * 60 * 1000)) {
        try {
          userInfoQueue.add('SetCurrentLesson', {email: user.email}, {jobId: `SetCurrentLesson-${user.email}`, attempts: 2, timeout: 600000, removeOnComplete: true, removeOnFail: true});
        } catch (e) {
          sails.log.error(e)
        }

      }

    } else {
      try {
        userInfoQueue.add('SetCurrentLesson', {email: user.email}, {jobId: `SetCurrentLesson-${user.email}`, attempts: 2, timeout: 600000, removeOnComplete: true, removeOnFail: true});
      } catch (e) {
        sails.log.error(e)
      }
    }

    let returnData;

    if (!latestStudiedLesson){

      returnData = {
        message: 'No Lesson Available',
        lessonId: `0000`,
        emailAddress: user.email,
      }
    } else {

      let userSettings = await UserSettings.findOne({user_id: user.id});

      let userOptions = await UserOptions.find({user_id: inputs.userId, option_key: {in: ['level', 'charSet', 'interests', 'autoMarkStudied', 'pinyin', 'newDash', 'timezone', 'currentLesson']}});

      function toObject(arr) {
        var rv = {};
        arr.forEach(option => {
          rv[option.option_key] = option.option_value
        });
        return rv;
      }
      userOptions = toObject(userOptions);

      let charSet = userOptions['charSet'] ? userOptions['charSet'] : 'simplified';

      if (!userOptions['charSet']) {
        try {
          let rawChar = userSettings.setting.split('"ctype";i:')[1].slice(0,1);
          if (rawChar == 2) {
            charSet = 'traditional';
          }
        } catch (e) {
          // await sails.helpers.users.setCharSet(user.id, charSet);
        }
      }

      let content = await Contents.findOne({v3_id: latestStudiedLesson});
      let lessonImg = '';
      if (content) {
        lessonImg = !content.image ? '' : content.image.slice(0,4) === 'http' ? content.image : content.type === 'lesson'
          ? `https://s3contents.chinesepod.com/${content.v3_id}/${content.hash_code}/${content.image}`
          : `https://s3contents.chinesepod.com/extra/${content.v3_id}/${content.hash_code}/${content.image}`;
      }

      let access = await sails.helpers.users.getAccessType(user.id);

      returnData = {
        lessonTitle: content ? content.title : 'ChinesePod Lesson',
        lessonId: latestStudiedLesson,
        lessonImg: lessonImg,
        emailAddress: user.email,
        charSet: charSet,
        subscription: access ? access : 'free',
        adv: user.createdAt < new Date(Date.now() - 365.25 * 24 * 60 * 60 * 1000) && access === 'free',
        timestamp: new Date()
      };

    }

    if(inputs.version) {
      await UserOptions.updateOrCreate({user_id: user.id, option_key: 'recapApp'}, {user_id: user.id, option_key: 'recapApp', option_value: inputs.version});
    }

    return returnData

  }
};
