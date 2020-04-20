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
      charSet = charData[0]['option_value'] ? charData[0]['option_value'] : 'simplified'
    } else {
      returnData.charSetUnset = true;
    }

    let userPreferences = (await UserPreferences.find(inputs.userId).sort('updatedAt DESC').limit(1))[0];

    let accessInfo = await sails.helpers.users.getAccessTypeAndExpiry(inputs.userId);

    let access = accessInfo.type;

    let trial = userData.trial;

    if (!['premium', 'admin', 'basic'].includes(access)) {

      const currentDate = new Date();

      if (!this.req.location) {

        try {
          const geoip = require('geoip-country');
          const geo = geoip.lookup(this.req.ip);
          this.req.location = geo ? geo['country'] : false;
        } catch (e) {

        }

      }

      if (userData.email.split('@')[1] === 'chinesepod.com') {
      // if (false) {

        access = 'premium'

      } else if (sails.config.custom.coreMarkets.includes(this.req.location) && sails.config.custom.coreFreeMonths.includes(currentDate.getMonth())) {

        access = 'premium'

      } else if (!sails.config.custom.coreMarkets.includes(this.req.location) && sails.config.custom.nonCoreFreeMonths.includes(currentDate.getMonth())) {

        access = 'premium'

      } else {

        returnData.upgrade = {
          needsUpgrade: false,
          allowedCount:10,
          // lessonCount: lessonCount,
          // lessonTimeline: lessonTimeline,
          canDismiss: true,
          upgradePath: 2, // 3 , 2 , 1,
          prerollAdId: sails.config.custom.prerollAdId,
          prerollAds: sails.config.custom.prerollAds,
          upgradeLink: sails.config.custom.upgradeLink
        };
        trial = new Date(); //OVERRIDE TRIAL DATE TO FORCE ONLY PREMIUM OPTIONS IN DAS
      }


    } else if (access === 'basic') {

      returnData.upgrade = {
        needsUpgrade: false,
        canDismiss: true,
        upgradePath: 2 // 3 , 2 , 1
      };

    }

    let newLastLogin = 0; let oldLastLogin = 0;

    if (userData.admin_note && Number.isInteger(userData.admin_note)) {
      newLastLogin = new Date(userData.admin_note)
    }

    if (userPreferences && userPreferences['last_login']) {
      oldLastLogin = new Date(userPreferences['last_login'])
    }

    let lastLogin = newLastLogin > oldLastLogin ? newLastLogin : oldLastLogin;

    return {...returnData, ...{
        userId: inputs.userId,
        name: userData.name,
        email: userData.email,
        username: userData.username,
        confirmed: userData.confirm_status,
        trial: trial,
        userAvatar: userPreferences ? userPreferences['avatar_url'] : 'https://www.chinesepod.com/dash/img/brand/symbol-black-center.svg',
        lastLogin: lastLogin,
        location: this.req.location,
        level: level,
        charSet: charSet,
        access: access,
        expiry: accessInfo.expiry
      }};
  }
};
