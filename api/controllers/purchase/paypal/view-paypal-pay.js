module.exports = {


  friendlyName: 'View paypal pay',


  description: 'Display "Paypal pay" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/checkout/paypal-pay'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
