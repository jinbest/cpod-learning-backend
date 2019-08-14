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

    return await CourseContents.find({
      where: {course_id: inputs.courseId},
      select: ['course_id', 'lesson', 'displaysort'],
      limit: inputs.limit ? inputs.limit : 10
    }).populate('lesson')

  }


};
