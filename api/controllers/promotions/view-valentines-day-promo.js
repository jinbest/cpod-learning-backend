module.exports = {


  friendlyName: 'View valentines day',


  description: 'Display "Valentines day" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/promotions/valentines-day'
    }

  },


  fn: async function (inputs) {

    let trial = false; let promo = true; let plan = 'premium'; let period = 'annually'; let promoCode = 'CNY2020';

    const addressfield = require('../../../lib/addressfield.json');

    let ipData = {};

    let  client = {
      sandbox: 'AZGCQyxdYVNlEao8bzD7tMrccqocSl4hjZmhR6nZ8bL7rCewPXRywjP-uwolycnyIodbL5oQvN8dixZE',
      production: 'AWZiTif-WpZUU8mjN2PbrRy_fTYDj2-_VqswzgiEUepQZc7g-jFJFaB4OjnSeU00UQtsReGPMo_tQ7yu'
    };

    // Respond with view.
    return {
      layout: 'layouts/layout-promo',
      expiry: null,
      needsAccount: true,
      trial: trial,
      plan: plan,
      billingCycle: period,
      promoShow: promo,
      client: client,
      formData: {
        emailAddress: this.req.me ? this.req.me.email : '',
        promoCode: promoCode,
        country: ipData['country'] ? ipData['country'] : 'US',
        state: '',
        city: '',
        postal: '',
        currency: 'USD'
      },
      pricing:{
        basic: {
          monthly: 14,
          quarterly: 39,
          annually: 124,
          savingQ: '1 Week Free',
          savingA: 'Save $44'
        },
        premium: {
          monthly: 29,
          quarterly: 79,
          annually: 249,
          savingQ: '1 Week Free',
          savingA: 'Save $99'
        },
        discount: 0
      },
      addressfield: addressfield
    };

  }


};
