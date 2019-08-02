module.exports = {


  friendlyName: 'View checkout',


  description: 'Display "Checkout" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/checkout'
    }

  },


  fn: async function () {

    const Stripe = require('stripe');

    // Respond with view.
    return {
      Stripe
    };

  }


};
