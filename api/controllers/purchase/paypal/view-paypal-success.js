/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */

module.exports = {


  friendlyName: 'View paypal pay',


  description: 'Display "Paypal Success" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/checkout/paypal-success'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
