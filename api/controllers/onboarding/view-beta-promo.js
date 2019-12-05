module.exports = {


  friendlyName: 'View beta promo',


  description: 'Display "Beta promo" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/onboarding/beta-promo'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
