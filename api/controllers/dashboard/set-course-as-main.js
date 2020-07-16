module.exports = {


  friendlyName: 'User courses',


  description: '',


  inputs: {
    courseId: {
      type: 'string',
      required: true
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let mainCourse =  await UserCourses.updateOne({user_id: inputs.userId, course: inputs.courseId}).set({default_status: 1});

    sails.log.info(mainCourse)

    if (mainCourse) {
      await UserCourses.update({user_id: inputs.userId, course: {'!=': inputs.courseId}}).set({default_status: 0});
    }
  }
};
