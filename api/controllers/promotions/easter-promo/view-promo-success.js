module.exports = {


  friendlyName: 'View promo success',


  description: 'Display "promo success" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/promotions/easter-promo/promo-success'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
