module.exports = {


  friendlyName: 'Post onboarding questions',


  description: '',


  inputs: {

    question: {
      type: {},
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

    if (!inputs.question.key || !inputs.question.answers) {
      throw 'invalid'
    }

    return await UserOptions.updateOrCreate({user_id: inputs.userId, option_key: inputs.question.key},
      {user_id: inputs.userId, option_key: inputs.question.key, option_value: inputs.question.answers.join(', ')})
  }


};
