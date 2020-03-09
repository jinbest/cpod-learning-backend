module.exports = {


  friendlyName: 'Get suggestions',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let userOptions = await sails.helpers.users.getUserOptions(inputs.userId);

    // STOP IF NO USER INTERESTS
    if (!userOptions.interests) {
      return
    }

    //STOP IF NO USER LEVEL
    if (!userOptions.level) {
      return
    }

    let level = await sails.helpers.convert.intToLevel(userOptions.level);

    let interests = userOptions.interests.split(', ');

    sails.log.info(interests);

    let relevantCourseIds = [];

    let logic = {
      business: function businessSuggestions (level) {
        switch (level) {
          case 'newbie':
            return [927, 37];
          case 'elementary':
            return [927, 37];
          case 'preInt':
            return [36, 22];
          case 'intermediate':
            return [36, 22];
          case 'upperInt':
            return [38, 925, 926];
          case 'advanced':
            return [38, 925, 926];
          default:
            return []
        }
      },

      sports: function sportsSuggestions (level) {
        return [918, 931]
      },

      movies: function moviesSuggestions (level) {
        return [930]
      },

      technology: function technologySuggestions (level) {
        return []
      },

      history: function historySuggestions (level) {
        return []
      },

      literature: function literatureSuggestions (level) {
        return []
      }
    };

    interests.forEach(interest => {
      relevantCourseIds = relevantCourseIds.concat(logic[interest](level))
    });

    let userCourses = await UserCourses.find({
      where: {user_id: inputs.userId, course: {'>': 0}},
      select: ['course']
    });

    let relevantCourses = await CourseDetail.find({
      where: {
        pubstatus: 1,
        is_private: 0,
        id: { in: relevantCourseIds, nin: userCourses.map(course => course.course)}
      },
      select: ['id', 'course_title', 'course_introduction']
    });


    // All done.
    return {
      suggestions: relevantCourses.length > 0,
      courses: relevantCourses
    }

  }


};
