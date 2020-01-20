module.exports = {


  friendlyName: 'View current lesson',


  description: 'Display "Current lesson" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/recap/current-lesson'
    }
  },


  fn: async function () {

    const userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId; //1016995

    if(!userId) {
      this.res.redirect('https://www.chinesepod.com/login')
    }

    let testers = ['mg@chinesepod.com', 'mick@chinesepod.com'];

    let user = await User.findOne({id: userId});

    //TODO REMOVE THIS DUMMY API CALL PROCESS
    if (testers.includes(user.email)) {
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
        syncing: false,
        lessonTitle: lessonTitle,
        lessonId: latestStudiedLesson, //latestStudiedLesson
        lessonImg: lessonImg,
        emailAddress: user.email,
        charSet: 'simplified', //charset
        subscription: 'premium', //subscription
        rawOutput: `{
          "lessonTitle": "${lessonTitle}",
          "lessonId": "${latestStudiedLesson}",
          "lessonImg": "${lessonImg}",
          "emailAddress": "${user.email}",
          "charSet": "simplified",
          "subscription": "premium"
          }`
      }
    } else {

      let latestLesson = await Logging.find({
        where: {
          id: user.email,
          accesslog_urlbase: {
            'in': [
              'https://chinesepod.com/lessons/api',
              'https://ws.chinesepod.com:444/1.0.0/instances/prod/lessons/get-lesson-detail',
              'https://server4.chinesepod.com:444/1.0.0/instances/prod/lessons/get-lesson-detail',
              'https://server4.chinesepod.com:444/1.0.0/instances/prod/lessons/get-dialogue'
            ]}
        },
        select: ['accesslog_url', 'createdAt'],
        sort: 'createdAt DESC',
        limit: 1
      });

      let latestJSLesson = await Logging.find({
        where: {
          id: user.email,
          accesslog_urlbase: 'https://www.chinesepod.com/api/v1/lessons/get-dialogue'
        },
        select: ['accesslog_url', 'createdAt'],
        sort: 'createdAt DESC',
        limit: 1
      });

      if (!latestLesson && !latestJSLesson){
        return {
          message: 'No Lesson Available',
          lessonId: `0000`,
          emailAddress: session.email,
        }
      }

      let latestStudiedLesson = [];

      // sails.log.info({php:latestLesson, js: latestJSLesson, jsTime: new Date(latestJSLesson[0]['createdAt']), phpTime: new Date(latestLesson[0]['createdAt']),time: new Date(latestJSLesson[0]['createdAt']) > new Date(latestLesson[0]['createdAt'])});

      try {
        if (latestJSLesson && latestJSLesson[0] && latestJSLesson[0]['createdAt'] && latestLesson && latestLesson[0] && latestLesson[0]['createdAt']) {

          if (new Date(latestJSLesson[0]['createdAt']) > new Date(latestLesson[0]['createdAt'])) {

            latestStudiedLesson = latestJSLesson[0]['accesslog_url'].split('lessonId=')[1]

          } else {

            latestStudiedLesson = latestLesson[0]['accesslog_url'].split('v3_id=')[1].split('&')[0];

          }

        } else if (latestJSLesson && latestJSLesson[0] && latestJSLesson[0]['accesslog_url']) {

          latestStudiedLesson = latestJSLesson[0]['accesslog_url'].split('lessonId=')[1]

        } else if (latestLesson && latestLesson[0] && latestLesson[0]['accesslog_url']) {

          latestStudiedLesson = latestLesson[0]['accesslog_url'].split('v3_id=')[1].split('&')[0]; // Switching to latest Log

        }
      } catch (e) {
        sails.log.error(e);
        return {
          syncing: false,
          error: 'No Lesson Available. Please try again Later.'
        }
      }

      if (typeof latestStudiedLesson === 'undefined' || latestStudiedLesson.length === 0){
        return {
          syncing: false,
          error: 'No Lesson Available. Please try again Later.'
        }
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


      let content = await Contents.findOne({v3_id: latestStudiedLesson});
      let lessonImg = '';
      if (content) {
        lessonImg = content.type === 'lesson'
          ? `https://s3contents.chinesepod.com/${content.v3_id}/${content.hash_code}/${content.image}`
          : `https://s3contents.chinesepod.com/extra/${content.v3_id}/${content.hash_code}/${content.image}`;
      }

      let subscription = await sails.helpers.users.getAccessType(user.id);

      // Respond with view.
      return {
        syncing: false,
        lessonTitle: content ? content.title : 'ChinesePod Lesson',
        lessonId: latestStudiedLesson,
        lessonImg: lessonImg,
        emailAddress: user.email,
        charSet: charSet,
        subscription: subscription,
        rawOutput: `{
          "lessonTitle": "${content ? content.title : 'ChinesePod Lesson'}",
          "lessonId": "${latestStudiedLesson}",
          "lessonImg": "${lessonImg}",
          "emailAddress": "${user.email}",
          "charSet": "${charSet}",
          "subscription": "${subscription}"
          }`
      };
    }
  }
};
