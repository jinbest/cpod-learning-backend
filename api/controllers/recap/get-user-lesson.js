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
        sails.log.info('No Lesson for Testers');
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

      let availableRecaps = await sails.helpers.recap.listRecapLessons();

      let sql = `
    SELECT log.accesslog_url
    FROM chinesepod_logging.cp_accesslog log
    WHERE log.accesslog_time > $1
    AND log.accesslog_user = $2
    AND log.accesslog_url LIKE '%v3_id%'
    ORDER BY log.accesslog_time DESC;
    `;

      let latestLoggedLessons = await sails.sendNativeQuery(
        sql, [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], session.email]
      );
      let latestStudiedLesson = [];
      latestLoggedLessons['rows'].some( function(item) {
        if (availableRecaps.includes(item['accesslog_url'].split('v3_id=')[1].split('&')[0])) {
          return latestStudiedLesson = item['accesslog_url'].split('v3_id=')[1].split('&')[0];
        }
      });

      if (typeof latestStudiedLesson === 'undefined' || latestStudiedLesson.length === 0){
        throw 'noLesson'
      }

      //Select User CharSet
      let userSettings = await UserSettings.findOne({
        user_id: user.id
      });

      let charSet = 'simplified';

      try {
        let rawChar = userSettings.setting.split('"ctype";i:')[1].slice(0,1);
        if (rawChar == 2) {
          charSet = 'traditional';
        }

      } catch (e) {
        sails.log('No Char Setting');
        await sails.helpers.users.setCharSet(user.id, charSet);
      }

      //Select User Subscription Status
      let UserSiteLink = await UserSiteLinks.findOne({
        user_id: user.id
      });

      let subscription = 'free';
      sails.log.info(UserSiteLink.usertype_id);
      switch (UserSiteLink.usertype_id) {
        case 1:
          subscription = 'premium';
          break;
        case 5:
          subscription = 'premium';
          break;
        case 6:
          subscription = 'basic';
          break;
        case 7:
          subscription = 'free';
          break;
      }

      let content = await Contents.findOne({v3_id: latestStudiedLesson});
      // Respond with view.
      try {
        return {
          lessonTitle: content.title,
          lessonId: latestStudiedLesson,
          lessonImg: content.type === 'lesson'
            ? `https://s3contents.chinesepod.com/${content.v3_id}/${content.hash_code}/${content.image}`
            : `https://s3contents.chinesepod.com/extra/${content.v3_id}/${content.hash_code}/${content.image}`,
          emailAddress: session.email,
          charSet: charSet,
          subscription: subscription,
        };
      } catch (e) {
        sails.log.error(e);
        return {
          lessonId: latestStudiedLesson,
          charSet: charSet,
          subscription: subscription,
        };
      }
    }
  }

};
