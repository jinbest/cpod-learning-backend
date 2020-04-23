module.exports = {


  friendlyName: 'View promo success',


  description: 'Display "Promo success" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/promotions/promo-success'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
