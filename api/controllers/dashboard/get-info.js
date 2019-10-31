module.exports = {


  friendlyName: 'Get info',


  description: '',


  inputs: {

  },


  exits: {
    invalid: {
      responseType: 'badRequest'
    }
  },


  fn: async function (inputs) {
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    if (!inputs.userId || typeof inputs.userId === 'undefined') {
      throw 'invalid'
    }

    let returnData = {};

    let userData = await User.findOne({id: inputs.userId});

    if (!userData) {
      throw 'invalid'
    }

    let userOptions = await UserOptions.find({user_id: inputs.userId, option_key: 'level'}).sort('updatedAt DESC').limit(1);

    let level = 'newbie';

    if (userOptions.length > 0 && userOptions[0].option_value) {
      level = await sails.helpers.convert.intToLevel(userOptions[0].option_value);
    } else {
      returnData.levelUnset = true;
    }

    let charSet = 'simplified';
    let charData = await UserOptions.find({user_id: inputs.userId, option_key: 'charSet'}).sort('updatedAt DESC').limit(1);

    if (charData.length > 0) {
      charSet = charData[0]['option_value'] ? charSet[0]['option_value'] : 'simplified'
    } else {
      returnData.charSetUnset = true;
    }

    let userPreferences = await UserPreferences.findOne(inputs.userId);

    let access = await sails.helpers.users.getAccessType(inputs.userId);

    returnData.upgradePath = 0;

    if (!['premium', 'admin'].includes(access)) {
    // if (true) {
      let lessonTimeline = await Logging.find({
        where: {
          id: userData.email,
          accesslog_urlbase: {
            'in': [
              // 'https://chinesepod.com/lessons/api',
              // 'https://www.chinesepod.com/lessons/api',
              'https://www.chinesepod.com/api/v1/lessons/get-lesson'
            ]},
          createdAt: {
            '>': new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        select: ['accesslog_url', 'createdAt'],
        sort: 'createdAt DESC',
        limit: 30   // Upper Limit Trigger
      });

      let lessonCount = [...new Set(lessonTimeline.map(x => x.accesslog_url))].length;

      if (lessonCount < 10) {
        access = 'premium';
        returnData.upgrade = {
          needsUpgrade: true,
          allowedCount:10,
          lessonCount: lessonCount,
          lessonTimeline: lessonTimeline,
        }
      } else {
        access = 'free';
        returnData.upgrade = {
          needsUpgrade: false,
          allowedCount:10,
          lessonCount: lessonCount,
          lessonTimeline: lessonTimeline,
          canDismiss: true,
          upgradePath: 2 // 3 , 2 , 1
        }
      }
    }

    return {...returnData, ...{
        userId: inputs.userId,
        name: userData.name,
        username: userData.username,
        trial: userData.trial,
        userAvatar: userPreferences ? userPreferences['avatar_url'] : 'https://www.chinesepod.com/dash/img/brand/symbol-black-center.svg',
        lastLogin: userPreferences ? userPreferences['last_login'] : '',
        level: level,
        charSet: charSet,
        pinyin: false,
        access: access
      }};
  }


};
