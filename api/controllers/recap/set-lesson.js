module.exports = {


  friendlyName: 'Set lesson',


  description: '',


  inputs: {
    lessonId: {
      type: 'string',
      required: true
    }

  },


  exits: {
    invalid: {
      responseType: "badRequest"
    }

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    if (!inputs.userId) {
      throw 'invalid'
    }

    await UserOptions.updateOrCreate({user_id: inputs.userId, option_key: 'currentLesson'}, {option_value: inputs.lessonId})

    return `Set current lesson to ${inputs.lessonId} for user ${this.req.me && this.req.me.email ? this.req.me.email : inputs.userId}`

  }
};
