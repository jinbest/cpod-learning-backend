module.exports = {


  friendlyName: 'View holiday gift',


  description: 'Display "Holiday gift" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/promotions/holiday-gift'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
