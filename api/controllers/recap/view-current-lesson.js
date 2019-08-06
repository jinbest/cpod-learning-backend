module.exports = {


  friendlyName: 'View current lesson',


  description: 'Display "Current lesson" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/recap/current-lesson'
    }
  },


  fn: async function () {

    const userId = this.req.session.userId;
    // const userId = 101699617;

    if(!userId) {
      this.res.redirect('https://chinesepod.com/dashboard')
    }

    let testers = ['mg@chinesepod.com', 'ugis@chinesepod.com', 'mick@chinesepod.com'];

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
        sql, [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], user.email]
      );
      let latestStudiedLesson = [];
      latestLoggedLessons['rows'].some( function(item) {
        if (availableRecaps.includes(item['accesslog_url'].split('v3_id=')[1].split('&')[0])) {
          return latestStudiedLesson = item['accesslog_url'].split('v3_id=')[1].split('&')[0];
        }
      });

      // sails.log.info(availableRecaps);
      // sails.log.info(latestLoggedLessons['rows']);
      // sails.log.info(latestStudiedLesson);

      if (typeof latestStudiedLesson === 'undefined' || latestStudiedLesson.length === 0){
        sails.log.info(`No Lesson For user ${user.email}`);
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

      let lessonImg = content.type === 'lesson'
          ? `https://s3contents.chinesepod.com/${content.v3_id}/${content.hash_code}/${content.image}`
          : `https://s3contents.chinesepod.com/extra/${content.v3_id}/${content.hash_code}/${content.image}`;
      // Respond with view.
      return {
        syncing: false,
        lessonTitle: content.title,
        lessonId: latestStudiedLesson,
        lessonImg: lessonImg,
        emailAddress: user.email,
        charSet: charSet,
        subscription: subscription,
        rawOutput: `{
          "lessonTitle": "${content.title}",
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
