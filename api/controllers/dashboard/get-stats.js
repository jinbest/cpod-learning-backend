module.exports = {


  friendlyName: 'Get stats',


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

    let userOptions = (await UserOptions.find({user_id: inputs.userId, option_key: 'level'}).limit(1))[0];

    const targets = {
      newbie: 50,
      elementary: 80,
      preInt: 100,
      intermediate: 120,
      upperInt: 160,
      advanced: 120,
      media: 80
    };

    const levelMap = {
      'upper intermediate': 'upperInt',
      'pre intermediate': 'preInt'
    };

    let level = 'newbie';

    if (userOptions && userOptions.option_value) {
      level = await sails.helpers.convert.intToLevel(userOptions.option_value);
    } else {
      returnData.levelUnset = true;
    }

    let charSet = (await UserOptions.find({user_id: inputs.userId, option_key: 'charSet'}).limit(1))[0];

    let userLessons = await UserContents.find({
      where: {
        user_id: inputs.userId,
        studied: 1,
        lesson_type: 0
      },
      select: ['lesson', 'saved', 'studied', 'updatedAt'],  //  'title', 'slug', 'image', 'hash_code', 'publication_timestamp'
      sort: 'updatedAt DESC'
    })
      .populate('lesson');

    let progressData = userLessons.filter(function (item) {
      return levelMap[item.lesson.level.toLowerCase()] ? levelMap[item.lesson.level.toLowerCase()] === level : item.lesson.level.toLowerCase() === level
    });

    let thisMonth = userLessons.filter(function (item) {
      return item.updatedAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && item.updatedAt < new Date()
    });

    let lastMonth = userLessons.filter(function (item) {
      return item.updatedAt > new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000) && item.updatedAt < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    });

    let thisWeek = userLessons.filter(function (item) {
      return item.updatedAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && item.updatedAt < new Date()
    });

    let lastWeek = userLessons.filter(function (item) {
      return item.updatedAt > new Date(Date.now() - 2 * 7 * 24 * 60 * 60 * 1000) && item.updatedAt < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    });

    return {...returnData, ...{
      userId: inputs.userId,
      name: userData.name,
      goals: {
        thisWeek: thisWeek.length,
        lastWeek: lastWeek.length,
        thisMonth: thisMonth.length,
        lastMonth: lastMonth.length,
      },
      progress: {
        current: progressData.length,
        target: targets[level]
      },
      level: level,
      charSet: (charSet && charSet['option_value']) ? charSet['option_value'] : 'simplified',
      access: await sails.helpers.users.getAccessType(inputs.userId)
    }};
  }
};
