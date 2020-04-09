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

    const minTimer = 60; //minutes

    let session = await sails.helpers.phpApi.checkSession(inputs.sessionId);

    if(!session) {
      throw 'invalid'
    }

    const redis = require("redis"),
      client = redis.createClient('redis://cpod-production.idthgn.ng.0001.use1.cache.amazonaws.com:6379/3');

    const {promisify} = require('util');
    const getAsync = promisify(client.get).bind(client);

    let user = await User.findOne({
      email: session.email
    });

    if(!user.id) {
      throw 'invalid'
    }
    //Connect Sails Session to PHP API Session
    this.req.session.userId = user.id;

    let response = await getAsync(user.email);

    if (response) {
      let json = false;
      try {
        json = JSON.parse(response);
      } catch (e) {
        sails.log.error(e)
      }

      if (json && new Date(json['timestamp']) > new Date(Date.now() - minTimer * 60 * 1000)) {

        sails.log.info({result: new Date(json['timestamp']) > new Date(Date.now() - minTimer * 60 * 1000), killdate: new Date(Date.now() - minTimer * 60 * 1000), redisdate: new Date(json['timestamp'])});

        return JSON.parse(response)
      }
    }

    let latestStudiedLesson = false;

    let currentLesson = await UserOptions.findOne({user_id: user.id, option_key: 'currentLesson'});

    if (currentLesson) {
      latestStudiedLesson = currentLesson['option_value']

      if (currentLesson['updatedAt'] < new Date(Date.now() - 60 * 60 * 1000)) {

        userInfoQueue.add('SetCurrentLesson', {email: user.email}, {attempts: 2, timeout: 600000});

      }

    } else {
      userInfoQueue.add('SetCurrentLesson', {email: user.email}, {attempts: 2, timeout: 600000});
    }

    // if (!latestStudiedLesson) {
    //   latestStudiedLesson = await sails.helpers.users.getUserCurrentLessonFromLogs(user.email, 1);
    // }
    //
    // if (!latestStudiedLesson) {
    //   latestStudiedLesson = await sails.helpers.users.getUserCurrentLessonFromLogs(user.email, 3);
    // }
    //
    // if (!latestStudiedLesson) {
    //   latestStudiedLesson = await sails.helpers.users.getUserCurrentLessonFromLogs(user.email, 7);
    // }
    //
    // if (!latestStudiedLesson) {
    //   latestStudiedLesson = await sails.helpers.users.getUserCurrentLessonFromLogs(user.email, 14);
    // }
    //
    // if (!latestStudiedLesson) {
    //   latestStudiedLesson = await sails.helpers.users.getUserCurrentLessonFromLogs(user.email, 30);
    // }

    let returnData;

    if (!latestStudiedLesson){

      client.end(true);

      returnData = {
        message: 'No Lesson Available',
        lessonId: `0000`,
        emailAddress: session.email,
      }
    } else {

      let userSettings = await UserSettings.findOne({user_id: user.id});

      let charSet = 'simplified';

      try {
        let rawChar = userSettings.setting.split('"ctype";i:')[1].slice(0,1);
        if (rawChar == 2) {
          charSet = 'traditional';
        }

      } catch (e) {
        await sails.helpers.users.setCharSet(user.id, charSet);
      }

      let content = await Contents.findOne({v3_id: latestStudiedLesson});
      let lessonImg = '';
      if (content) {
        lessonImg = content.type === 'lesson'
          ? `https://s3contents.chinesepod.com/${content.v3_id}/${content.hash_code}/${content.image}`
          : `https://s3contents.chinesepod.com/extra/${content.v3_id}/${content.hash_code}/${content.image}`;
      }

      let access = await sails.helpers.users.getAccessType(user.id);

      returnData = {
        lessonTitle: content ? content.title : 'ChinesePod Lesson',
        lessonId: latestStudiedLesson,
        lessonImg: lessonImg,
        emailAddress: session.email,
        charSet: charSet,
        subscription: access ? access : 'free',
        adv: user.createdAt < new Date(Date.now() - 365.25 * 24 * 60 * 60 * 1000) && access === 'free',
        timestamp: new Date()
      };

      client.set(user.email, JSON.stringify(returnData));

    }

    client.end(true);

    await UserOptions.updateOrCreate({user_id: user.id, option_key: 'recapApp'}, {user_id: user.id, option_key: 'recapApp', option_value: new Date()});

    return returnData

  }
};
