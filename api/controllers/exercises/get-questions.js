module.exports = {


  friendlyName: 'Get questions',


  description: '',


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
    let lessonQuestions = await Questions.find({scope: inputs.lessonId, product_id: 1, status: 1});

    return {
      matching: lessonQuestions.filter((question) => {return question.type_id === 1}),
      audio: lessonQuestions.filter((question) => {return question.type_id === 4}),
      choice: lessonQuestions.filter((question) => {return question.type_id === 5}),
      rearrange: lessonQuestions.filter((question) => {return question.type_id === 2}),
    }

  }


};
