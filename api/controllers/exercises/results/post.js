module.exports = {


  friendlyName: 'Post',


  description: 'Post results.',


  inputs: {
    lessonId: {
      type: 'string',
      required: true
    },
    userId: {
      type: 'number'
    },
    totalScore: {
      type: 'number',
      required: true
    },
    userScore: {
      type: 'number',
      required: true
    }
  },


  exits: {
    invalid: {
      responseType: 'badRequest'
    }
  },


  fn: async function (inputs) {
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    if (!inputs.userId) {
      throw 'invalid'
    }

    let assessment = (await Assessments.find({product_id: 1, v3_id: inputs.lessonId}).limit(1))[0];

    // All done.
    return await UserAssessments.create({
      user_id: inputs.userId,
      assessment_id: assessment.id,
      lesson_id: inputs.lessonId,
      assessment_name: assessment.name,
      total_score: inputs.totalScore,
      user_score: inputs.userScore,
      created_by: inputs.userId
    })
  }


};
