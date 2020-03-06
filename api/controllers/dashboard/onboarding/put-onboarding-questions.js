module.exports = {


  friendlyName: 'Post onboarding questions',


  description: '',


  inputs: {

    question: {
      type: {}
    },
    questionId: {
      type: 'string',
      required: true
    },
    answer: {
      type: 'ref',
      required: true
    }

  },


  exits: {
    invalid: {
      responseType: 'badRequest'
    }
  },


  fn: async function (inputs) {

    sails.log.info(inputs);

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    // TYPECHECKS
    function isObject (value) {
      return value && typeof value === 'object' && value.constructor === Object;
    }

    if (Array.isArray(inputs.answer)) {
      inputs.answer = inputs.answer.join(', ')
    }

    if (isObject(inputs.answer)) {
      inputs.answer = JSON.stringify(inputs.answer)
    }

    return await UserOptions.updateOrCreate({user_id: inputs.userId, option_key: inputs.questionId},
      {user_id: inputs.userId, option_key: inputs.questionId, option_value: inputs.answer})
  }


};
