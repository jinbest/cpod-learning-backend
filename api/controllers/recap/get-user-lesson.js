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

    let testers = ['mg@chinesepod.com', 'ugis@chinesepod.com', 'mick@chinesepod.com'];

    let session = await sails.helpers.phpApi.checkSession(inputs.sessionId);

    if(!session) {
      throw 'invalid'
    }

    //TODO REMOVE THIS DUMMY API CALL PROCESS
    if (testers.includes(session.email)) {
      let currentHour = new Date(new Date() - 4 * 60 * 60 * 1000).getHours(); //NY Time
      let latestStudiedLesson = '4121';

      if([1,6,11,16,21].includes(currentHour)) {
        latestStudiedLesson = '4123'
      } else if ([2,7,12,17,22].includes(currentHour)) {
        latestStudiedLesson = '4124'
      } else if ([3,8,13,18,23].includes(currentHour)) {
        latestStudiedLesson = '4125'
      } else if ([4,9,14,19].includes(currentHour)) {
        latestStudiedLesson = '4126'
      }

      let content = await Contents.findOne({v3_id: latestStudiedLesson});

      let lessonTitle = '';
      let lessonImg = '';

      if (!content) {
        sails.log.error('No Recap Lesson for Testers');
        lessonTitle = 'Demo Lesson for Testers';
        lessonImg = 'https://via.placeholder.com/640x360.png?text=Sample+Image+For+Missing+Artwork';
      } else {
        lessonTitle = content.title;
        lessonImg = content.type === 'lesson'
          ? `https://s3contents.chinesepod.com/${content.v3_id}/${content.hash_code}/${content.image}`
          : `https://s3contents.chinesepod.com/extra/${content.v3_id}/${content.hash_code}/${content.image}`;
      }

      return {
        lessonTitle: lessonTitle,
        lessonId: latestStudiedLesson, //latestStudiedLesson
        lessonImg: lessonImg,
        emailAddress: session.email,
        charSet: 'simplified', //charset
        subscription: 'premium' //subscription
      }

    } else {
      let user = await User.findOne({
        email: session.email
      });

      if(!user) {
        throw 'invalid'
      }
      //Connect Sails Session to PHP API Session
      this.req.session.userId = user.id;

      let latestLesson = await Logging.find({
        where: {
          accesslog_user: user.email,
          accesslog_urlbase: 'https://chinesepod.com/lessons/api'
        },
        select: ['accesslog_url'],
        sort: 'id DESC',
        limit: 1
      });

      if (!latestLesson){
        return {
          message: 'No Lesson Available',
          lessonId: `0000`,
          emailAddress: session.email,
        }
      }

      let latestStudiedLesson = [];

      try {
        latestStudiedLesson = latestLesson[0]['accesslog_url'].split('v3_id=')[1].split('&')[0]; // Switching to latest Log
      } catch (e) {
        sails.log.error(e);
        return {
          message: 'No Lesson Available',
          lessonId: `0000`,
          emailAddress: session.email,
        }
      }

      if (!latestStudiedLesson){
        return {
          message: 'No Lesson Available',
          lessonId: `0000`,
          emailAddress: session.email,
        }
      }

      //Select User CharSet
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

      try {
        return {
          lessonTitle: content ? content.title : 'ChinesePod Lesson',
          lessonId: latestStudiedLesson,
          lessonImg: lessonImg,
          emailAddress: session.email,
          charSet: charSet,
          subscription: await sails.helpers.users.getAccessType(user.id),
        };
      } catch (e) {
        sails.log.error(e);
        return {
          lessonId: latestStudiedLesson,
          charSet: charSet,
          subscription: await sails.helpers.users.getAccessType(user.id),
        };
      }
    }
  }

};
