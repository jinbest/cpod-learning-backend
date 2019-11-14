module.exports = {


  friendlyName: 'View new dash',


  description: 'Display "New dash" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/onboarding/new-dash'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
