module.exports = {


  friendlyName: 'View Women\'s day gift',


  description: 'Display "Women\'s day gift" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/promotions/easter-promo/gift'
    }

  },


  fn: async function () {

    let trial = false; let promo = false; let plan = 'premium'; let period = 'monthly';

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
          monthly: 19,
          quarterly: 49,
          annually: 199
        },
        discount: 0
      },
    };

  }


};
