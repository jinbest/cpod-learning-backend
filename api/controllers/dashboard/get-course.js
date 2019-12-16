module.exports = {


  friendlyName: 'Get Course Details',


  description: '',


  inputs: {
    courseId: {
      type: 'number',
      isInteger: true,
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let courseDetails = await CourseDetail.findOne({id: inputs.courseId});

    let courseLessons = await CourseContents.find({course_id: inputs.courseId}).populate('lesson');

    let userLessons = await UserContents.find({
      where: {
        user_id: inputs.userId,
        lesson_type: 0
      },
      select: ['lesson', 'saved', 'studied', 'updatedAt'],  //  'title', 'slug', 'image', 'hash_code', 'publication_timestamp'
      sort: 'updatedAt DESC',
    });

    courseLessons.forEach((lesson) => {
      const savedLesson = userLessons.filter((item) => item.lesson === lesson.lesson.id)
      if (savedLesson.length > 0) {
        lesson.lesson = {...lesson.lesson, ...{saved: savedLesson[0].saved, studied: savedLesson[0].studied}}
      }
    });

    return {
      ...courseDetails,
      ...{lessons: courseLessons}
    }
  }

};
