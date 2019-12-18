module.exports = {


  friendlyName: 'View holiday offer',


  description: 'Display "Holiday offer" page.',

  layout: 'layouts/layout-promo',

  local: {
    layout: 'layouts/layout-promo',
  },

  exits: {

    success: {
      viewTemplatePath: 'pages/promotions/holiday-offer'
    }

  },


  fn: async function () {

    let expiry = new Date(Date.now() + 4 * 60 * 60 * 1000);

    let trial = false; let promo = false; let plan = 'holiday'; let period = 'monthly'; let promoCode = '';

    const addressfield = require('../../../lib/addressfield.json');

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
        holiday: {
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
