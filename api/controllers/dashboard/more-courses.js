module.exports = {


  friendlyName: 'More courses',


  description: '',


  inputs: {
    userId: {
      type: 'number'
    }

  },


  exits: {

  },


  fn: async function (inputs) {
    const sanitizeHtml = require('sanitize-html');

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let userOptions = await UserOptions.findOne({
      where: {
        user_id: inputs.userId,
        option_key: 'level'
      },
      select: ['option_value']
    });

    let levelInt = 1;

    if (userOptions && userOptions.option_value) {
      levelInt = userOptions.option_value
    }

    let userLevel = await sails.helpers.convert.intToLevel(levelInt);
    let levelHigher = await sails.helpers.convert.oneLevelHigher(userLevel);

    let userCourses = await UserCourses.find({
      where: {user_id: inputs.userId, course: {'>': 0}},
      select: ['course']
    });

    let enrolledCourses = userCourses.map(course => course.course);

    let leveledCourses = await CourseDetail.find({
      where: {
        pubstatus: 1,
        is_private: 0,
        id: { nin: enrolledCourses},
        order_id: {'>=': 1000},
        channel_id: { in: [await sails.helpers.convert.levelToChannelId(userLevel), await sails.helpers.convert.levelToChannelId(levelHigher)]}
      },
      select: ['id', 'course_title', 'course_introduction'],
      sort: 'order_id DESC'
    });

    leveledCourses.forEach((course) => {
      course.course_introduction = sanitizeHtml(course.course_introduction, {
        allowedTags: [],
        allowedAttributes: {}
      });
    });

    return leveledCourses
  }
};
