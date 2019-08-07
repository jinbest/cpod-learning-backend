module.exports = {


  friendlyName: 'View checkout',


  description: 'Display "Checkout" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/checkout'
    }

  },


  fn: async function () {

    // Respond with view.
    return {
    };

  }


};
