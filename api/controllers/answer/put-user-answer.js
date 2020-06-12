module.exports = {


  friendlyName: 'Put user answer',


  description: '',


  inputs: {

    questionId: {
      type: 'string',
      required: true
    },
    answer: {
      type: 'string',
      required: true
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    await UserOptions.updateOrCreate(
      {user_id: inputs.userId, option_key: inputs.questionId},
      {user_id: inputs.userId, option_key: inputs.questionId, option_value: inputs.answer})

    return this.res.view('pages/answers/thank-you.ejs');

  }


};
