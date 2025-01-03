module.exports = {


  friendlyName: 'Get',


  description: 'Get results.',


  inputs: {
    lessonId: {
      type: 'string',
      required: true
    },
    userId: {
      type: 'number'
    }
  },


  exits: {

  },


  fn: async function (inputs) {
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    // All done.
    let assessments = await UserAssessments
      .find({user_id: inputs.userId, lesson_id: inputs.lessonId})
      .sort('createdAt DESC');

    return {
      count: assessments.length,
      results: assessments
    }
  }


};
