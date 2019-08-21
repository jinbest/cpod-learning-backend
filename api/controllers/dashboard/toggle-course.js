module.exports = {


  friendlyName: 'Toggle course',


  description: '',


  inputs: {
    userId: {
      type: 'number',
      isInteger: true
    },
    courseId: {
      type: 'number',
      isInteger: true
    },
    status: {
      type: 'boolean',
      required: true
    }

  },


  exits: {

  },


  fn: async function (inputs) {
    inputs.userId = 1016995;

    if (inputs.status === true) {
      await UserCourses.create({
        user_id: inputs.userId,
        course: inputs.courseId,
        created_by: inputs.userId,
      })
    } else {
      await UserCourses.destroyOne({
        user_id: inputs.userId,
        course: inputs.courseId
      })
    }
  }


};

