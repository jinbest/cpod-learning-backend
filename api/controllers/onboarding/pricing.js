module.exports = {


  friendlyName: 'Plan Selection',


  description: 'Page to select subscription plan',


  inputs: {

    plan: {
      type: 'string',
      description: 'Selected subscription plan',
    }
  },


  exits: {

    success: {
      description: 'Session updated with the selected plan.'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The options are invalid.',
    },

  },

  fn: async function (inputs) {
    let plan = inputs.plan;
    this.req.session.selectedPlan = plan;
    //TODO implement Cart abandonment
    return;
  }
};
