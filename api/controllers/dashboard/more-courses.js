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

    let userLevel = await sails.helpers.convert.intToLevel(userOptions.option_value);
    let levelHigher = await sails.helpers.convert.oneLevelHigher(userLevel);

    let userCourses = await UserCourses.find({
      where: {user_id: inputs.userId, course: {'>': 0}},
      select: ['course']
    });

    let enrolledCourses = [];

    userCourses.forEach((course) => {
      enrolledCourses.push(course.course)
    });

    sails.log.info(enrolledCourses);

    let leveledCourses = await CourseDetail.find({
      where: {
        pubstatus: 1,
        is_private: 0,
        id: { nin: enrolledCourses},
        channel_id: { in: [await sails.helpers.convert.levelToChannelId(userLevel), await sails.helpers.convert.levelToChannelId(levelHigher)]}
      },
      select: ['id', 'course_title', 'course_introduction'],
      sort: 'id DESC'
    });
    let mixedCourses = await CourseDetail.find({
      where: {
        pubstatus: 1,
        is_private: 0,
        id: { nin: enrolledCourses},
        channel_id: 181
      },
      select: ['id', 'course_title', 'course_introduction'],
      sort: 'id DESC'
    });
    leveledCourses.forEach((course) => {
      course.course_introduction = sanitizeHtml(course.course_introduction, {
        allowedTags: [],
        allowedAttributes: {}
      });
    });

    mixedCourses.forEach((course) => {
      course.course_introduction = sanitizeHtml(course.course_introduction, {
        allowedTags: [],
        allowedAttributes: {}
      });
    });
    return leveledCourses.concat(mixedCourses)
  }


};
