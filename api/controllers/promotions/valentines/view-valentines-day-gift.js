module.exports = {


  friendlyName: 'View valentines day gift',


  description: 'Display "Valentines day gift" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/promotions/valentines/valentines-day-gift'
    }

  },


  fn: async function () {

    let trial = false; let promo = false; let plan = 'premium'; let period = 'quarterly';

    let ipData = {};

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
      layout: 'layouts/layout-promo',
      expiry: null,
      needsAccount: true,
      trial: trial,
      plan: plan,
      billingCycle: period,
      client: client,
      ppMode: isProduction ? 'production' : 'sandbox', // sandbox | production
      formData: {
        emailAddress: '',
        country: ipData['country'] ? ipData['country'] : 'US',
        state: '',
        city: '',
        postal: '',
        currency: 'USD'
      },
      pricing:{
        premium: {
          monthly: 20,
          quarterly: 39,
          annually: 149
        },
        discount: 0
      },
    };

  }


};
