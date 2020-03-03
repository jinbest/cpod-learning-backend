module.exports = {


  friendlyName: 'View promo',


  description: 'Display "promo" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/promotions/womens-day/promo'
    }

  },


  fn: async function (inputs) {

    let trial = false; let promo = true; let plan = 'premium'; let period = 'quarterly'; let promoCode = 'EMPOWER38'; let nonRecurring = true;

    const addressfield = require('../../../../lib/addressfield.json');

    let ipData = {};

    // Respond with view.
    return {
      layout: 'layouts/layout-promo',
      expiry: null,
      needsAccount: !this.req.me,
      trial: trial,
      plan: plan,
      billingCycle: period,
      promoShow: promo,
      nonRecurring: nonRecurring,
      formData: {
        emailAddress: this.req.me ? this.req.me.email : '',
        promoCode: promoCode,
        country: ipData['country'] ? ipData['country'] : 'US',
        state: '',
        city: '',
        postal: ''
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
      stripeKey: sails.config.custom.stripePublishableKey,
      addressfield: addressfield
    };

  }


};
