module.exports = {


  friendlyName: 'More courses',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {
    let userId = this.req.session.userId;

    let userOptions = await UserOptions.findOne({
      user_id: userId,
      option_key: 'level'
    });

    let userLevel = await sails.helpers.convert.intToLevel(userOptions.option_value);
    let levelHigher = await sails.helpers.convert.oneLevelHigher(userLevel);

    let userCourses = await UserCourses.find({
      where: {user_id: userId},
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
        // id: { nin: enrolledCourses},
        channel_id: { in: [await sails.helpers.convert.levelToChannelId(userLevel), await sails.helpers.convert.levelToChannelId(levelHigher)]}
      },
      select: ['id', 'course_title', 'course_introduction'],
      sort: 'id DESC'
    });
    let mixedCourses = await CourseDetail.find({
      where: {
        pubstatus: 1,
        is_private: 0,
        // id: { nin: enrolledCourses},
        channel_id: 181
      },
      select: ['id', 'course_title', 'course_introduction'],
      sort: 'id DESC'
    });
    return leveledCourses.concat(mixedCourses)
  }


};