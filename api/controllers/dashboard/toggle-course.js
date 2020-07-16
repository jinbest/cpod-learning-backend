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
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    if (inputs.status === true) {
      let userCourses = await UserCourses.find({
        user_id: inputs.userId,
        course: {'>': 0},
        default_status: 1
      });
      await UserCourses.create({
        user_id: inputs.userId,
        course: inputs.courseId,
        created_by: inputs.userId,
        default_status: userCourses && userCourses.length ? 0 : 1
      });
    } else {
      await UserCourses.destroy({
        user_id: inputs.userId,
        course: inputs.courseId
      })
    }
  }


};

