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
      responseType: 'badRequest',
      description: 'User Has No Recent Lessons',
    }

  },


  fn: async function (inputs) {

    let session = await NySession.findOne({
      id: inputs.sessionId.toLowerCase()
    });

    if(!session) {
      throw 'invalid'
    }

    let user = await User.findOne({
      email: session.email
    });

    if(!user) {
      throw 'invalid'
    }
    //Connect Sails Session to PHP API Session
    this.req.session.userId = user.id;

    //TODO Select Relevant lesson REWRITE TO LOG LOOKUP
    let latestStudiedLesson = await UserContents.find({
        user_id: user.id,
        studied: 1
      })
      .sort('createdAt desc')
      .limit(1);

    console.log(latestStudiedLesson);
    if (latestStudiedLesson === undefined || latestStudiedLesson.length === 0){
      throw 'noLesson'
    }

    //TODO Select User CharSet
    let userSettings = await UserSettings.findOne({
      user_id: user.id
    });

    let charSet = 'simplified';

    try {
      let rawChar = userSettings.setting.split('"ctype";i:')[1].slice(0,1);
      if (rawChar == 2) {
        charSet = 'traditional';
      }
      //TODO Implement 'both' as a character output "chars";i:0;
      //  `a:8:{s:5:"ctype";i:1;s:3:"pdf";i:0;s:5:"chars";i:0;s:5:"trans";i:1;s:10:"tweet_post";s:1:"1";s:16:"reply_tweet_post";s:1:"1";s:18:"group_conversation";s:1:"1";s:13:"exercise_lang";s:1:"3";}`

    } catch (e) {
      console.log('No Char Setting');
      //TODO Update Char Settings
    }

    //TODO Select User Subscription Status
    let UserSiteLink = await UserSiteLinks.findOne({
      user_id: user.id
    });

    let subscription = 'free';
    switch (UserSiteLink.usertype_id) {
      case 6: subscription = 'basic';
      case 7: subscription = 'premium';
      case 1: subscription = 'premium'
    }

    //TODO Return All Data

    return {
      lessonId: latestStudiedLesson[0].v3_id,
      charSet: charSet,
      subscription: subscription
    }

  }

};
