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

    return await CourseDetail.findOne({
      where: {id: inputs.courseId},
    });
  }

};
