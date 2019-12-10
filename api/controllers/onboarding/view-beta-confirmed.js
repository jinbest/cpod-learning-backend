module.exports = {


  friendlyName: 'View beta confirmed',


  description: 'Display "Beta confirmed" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/onboarding/beta-confirmed'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
