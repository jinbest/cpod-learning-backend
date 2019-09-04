module.exports = {


  friendlyName: 'Get stats',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let userOptions = await UserOptions.findOne({user_id: inputs.userId, option_key: 'level'});

    let userData = await User.findOne({id: inputs.userId});

    const targets = {
      newbie: 50,
      elementary: 80,
      preInt: 100,
      intermediate: 120,
      upperInt: 160,
      advanced: 120,
      media: 80
    };

    let level = await sails.helpers.convert.intToLevel(userOptions.option_value);

    let charSet = await UserOptions.findOne({user_id: inputs.userId, option_key: 'charSet'});

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
      return item.lesson.level.toLowerCase() === level
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

    return {
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
      charSet: charSet['option_value'],
    };
  }
};
