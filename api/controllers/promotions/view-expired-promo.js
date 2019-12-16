module.exports = {


  friendlyName: 'View expired promo',


  description: 'Display "Expired promo" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/promotions/expired-promo'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
