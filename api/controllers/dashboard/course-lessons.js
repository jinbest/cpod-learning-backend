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
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    let courseData = await CourseContents.find({
      where: {course_id: inputs.courseId},
      select: ['course_id', 'lesson', 'displaysort'],
      limit: 50 // inputs.limit ? inputs.limit : 50
    }).populate('lesson.userContents', {
      where: {
        user_id: 1016995,
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

    return (returnData.filter((lesson) => {return lesson.studied === 0})).slice(0, inputs.limit)
  }


};
