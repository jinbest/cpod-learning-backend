module.exports = {


  friendlyName: 'Get onboarding questions',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    const questions = require('../../../../lib/onboarding');

    let userOptions = await sails.helpers.users.getUserOptions(inputs.userId);

    let toAsk = [];

    questions.forEach(question => {
      if(!userOptions[question.key]) {
        toAsk.push(question)
      }
    });

    return {
      completeness: (questions.length - toAsk.length) / questions.length,
      questions: toAsk
    }

  }


};
