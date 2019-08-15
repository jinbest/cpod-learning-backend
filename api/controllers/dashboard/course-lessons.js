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
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    let courseData = await CourseContents.find({
      where: {course_id: inputs.courseId},
      select: ['course_id', 'lesson', 'displaysort'],
      limit: inputs.limit ? inputs.limit : 10
    }).populate('lesson.userContents', {
      where: {
        user_id: 1016995
      },
      select: ['saved', 'studied']
    });

    let returnData = [];
    courseData.forEach((lesson) => {
      returnData.push(lesson.lesson);
    });

    return returnData
  }


};
