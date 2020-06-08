module.exports = {


  friendlyName: 'Put score',


  description: '',


  inputs: {
    userId: {
      type: 'number'
    },
    lessonId: {
      type: 'string',
      required: true
    },
    assessmentId: {
      type: 'string',
    },
    userScore: {
      type: 'number',
      isInteger: true,
      required: true
    },
    totalScore: {
      type: 'number',
      isInteger: true,
      required: true
    }

  },


  exits: {

    invalid: {
      responseType: 'badRequest'
    }

  },


  fn: async function (inputs) {

    if(!inputs.userId){
      inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session && this.req.session.userId ? this.req.session.userId : null;
    }

    if(!inputs.userId){
      throw 'invalid'
    }

    return await UserCustomAssessments.updateOrCreate({
      user_id: inputs.userId,
      lesson_id: inputs.lessonId,
      assessment_id: inputs.assessmentId,
      user_score: inputs.userScore,
      total_score: inputs.totalScore,
      updatedAt: {'>': new Date(Date.now() - 1000 * 60 * 60 * 2)}
    },{
      user_id: inputs.userId,
      lesson_id: inputs.lessonId,
      assessment_id: inputs.assessmentId,
      user_score: inputs.userScore,
      total_score: inputs.totalScore,
    })

  }


};
