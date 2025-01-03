module.exports = {


  friendlyName: 'Course lessons',


  description: '',


  inputs: {
    courseId: {
      type: 'number',
      isInteger: true,
      required: true
    },
    limit: {
      type: 'number',
      isInteger: true
    },
    studied: {
      type: 'boolean'
    },
    exclude: {
      type: ['ref'],
      description: 'list of lessonIDs to exclude'
    },
    all: {
      type: 'boolean'
    }
  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let courseData = await CourseContents.find({
      where: {course_id: inputs.courseId},
      select: ['course_id', 'lesson', 'displaysort'],
      sort: 'displaysort ASC'
    }).populate('lesson.userContents', {
      where: {
        user_id: inputs.userId,
        lesson_type: 0
      },
      select: ['saved', 'studied']
    });

    let returnData = [];
    courseData.forEach((lesson) => {
      if (lesson.lesson.userContents[0]) {
        lesson.lesson.saved = lesson.lesson.userContents[0].saved;
        lesson.lesson.studied = lesson.lesson.userContents[0].studied;
        delete lesson.lesson.userContents;
        returnData.push(lesson.lesson);
      } else {
        returnData.push(lesson.lesson);
      }
    });

    if(inputs.all) {
      return returnData
    }

    return (returnData.filter((lesson) => {return lesson.studied !== 1 && (inputs.exclude ? !inputs.exclude.includes(lesson.id) : true)})).slice(0, inputs.limit)
  }


};
