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

    let session = await NySession.findOne({
      id: inputs.sessionId.toLowerCase()
    });

    if(!session) {
      throw 'invalid'
    }

    //TODO REMOVE THIS DUMMY API CALL PROCESS
    let currentHour = new Date(new Date() - 4 * 60 * 60 * 1000).getHours(); //NY Time
    let latestStudiedLesson = '4121';

    if (currentHour >= 3 && currentHour < 9) {
      latestStudiedLesson = '4123'
    } else if (currentHour >= 9 && currentHour < 15) {
      latestStudiedLesson = '4124'
    } else if (currentHour >= 15 && currentHour < 21) {
      latestStudiedLesson = '4125'
    } else if (currentHour >= 21 && currentHour < 24) {
      latestStudiedLesson = '4126'
    }

      return {
      lessonId: latestStudiedLesson, //latestStudiedLesson
      charSet: 'simplified', //charset
      subscription: 'premium' //subscription
    }

    // let user = await User.findOne({
    //   email: session.email
    // });
    //
    // if(!user) {
    //   throw 'invalid'
    // }
    // //Connect Sails Session to PHP API Session
    // this.req.session.userId = user.id;
    //
    // let availableRecaps = await sails.helpers.listRecapLessons();
    //
    // let sql = `
    // SELECT DISTINCT log.accesslog_url
    // FROM chinesepod_logging.cp_accesslog log
    // WHERE log.accesslog_time > $1
    // AND log.accesslog_user = $2
    // AND log.accesslog_url LIKE '%v3_id%'
    // ORDER BY log.accesslog_time DESC;
    // `;
    //
    // let latestLoggedLessons = await sails.sendNativeQuery(
    //   sql, [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], session.email]
    // );
    // let latestStudiedLesson = [];
    // latestLoggedLessons['rows'].some( function(item) {
    //   if (availableRecaps.includes(item['accesslog_url'].split('v3_id=')[1].split('&')[0])) {
    //     return latestStudiedLesson = item['accesslog_url'].split('v3_id=')[1].split('&')[0];
    //   }
    // });
    //
    // if (latestStudiedLesson === undefined || latestStudiedLesson.length === 0){
    //   throw 'noLesson'
    // }
    //
    // //TODO Select User CharSet
    // let userSettings = await UserSettings.findOne({
    //   user_id: user.id
    // });
    //
    // let charSet = 'simplified';
    //
    // try {
    //   let rawChar = userSettings.setting.split('"ctype";i:')[1].slice(0,1);
    //   if (rawChar == 2) {
    //     charSet = 'traditional';
    //   }
    //   //TODO Implement 'both' as a character output "chars";i:0;
    //   //  `a:8:{s:5:"ctype";i:1;s:3:"pdf";i:0;s:5:"chars";i:0;s:5:"trans";i:1;s:10:"tweet_post";s:1:"1";s:16:"reply_tweet_post";s:1:"1";s:18:"group_conversation";s:1:"1";s:13:"exercise_lang";s:1:"3";}`
    //
    // } catch (e) {
    //   console.log('No Char Setting');
    //   //TODO Update Char Settings
    // }
    //
    // //TODO Select User Subscription Status
    // let UserSiteLink = await UserSiteLinks.findOne({
    //   user_id: user.id
    // });
    //
    // let subscription = 'free';
    // switch (UserSiteLink.usertype_id) {
    //   case 6: subscription = 'basic';
    //   case 7: subscription = 'premium';
    //   case 1: subscription = 'premium'
    // }
    //
    // //TODO FIX THIS TO ACTUAL VARIABLES
    // return {
    //   lessonId: latestStudiedLesson, //latestStudiedLesson
    //   charSet: 'simplified', //charset
    //   subscription: 'premium' //subscription
    // }

  }

};
