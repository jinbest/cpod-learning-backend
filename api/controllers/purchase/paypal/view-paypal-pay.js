module.exports = {


  friendlyName: 'View paypal pay',


  description: 'Display "Paypal pay" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/checkout/paypal-pay'
    }

  },


  fn: async function () {

    let  client = {
      sandbox: 'AZGCQyxdYVNlEao8bzD7tMrccqocSl4hjZmhR6nZ8bL7rCewPXRywjP-uwolycnyIodbL5oQvN8dixZE',
      production: 'AWZiTif-WpZUU8mjN2PbrRy_fTYDj2-_VqswzgiEUepQZc7g-jFJFaB4OjnSeU00UQtsReGPMo_tQ7yu'
    };

    let isProduction = sails.config.environment === 'production';

    if (isProduction) {
      delete client['sandbox']
    }

    // Respond with view.
    return {
      client: client,
      ppMode: isProduction ? 'production' : 'sandbox', // sandbox | production
    };

  }


};
