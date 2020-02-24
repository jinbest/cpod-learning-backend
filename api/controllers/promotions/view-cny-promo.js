module.exports = {


  friendlyName: 'View Happy New Year Promo',


  description: 'Display "Happy New Year Promo" page.',

  inputs: {
    token: {
      type: 'string'
    }
  },

  exits: {

    success: {
      viewTemplatePath: 'pages/promotions/cny-promo'
    }

  },


  fn: async function (inputs) {

    let trial = false; let promo = true; let plan = 'premium'; let period = 'annually'; let promoCode = 'CNY2020';

    const addressfield = require('../../../lib/addressfield.json');

    let ipData = {};

    sails.log.info({full: this.req.me});
    sails.log.info({limited: this.req.session.limitedAuth});

    // Respond with view.
    return {
      layout: 'layouts/layout-promo',
      expiry: null,
      needsAccount: !(this.req.me || this.req.session.limitedAuth),
      trial: trial,
      plan: plan,
      billingCycle: period,
      promoShow: promo,
      formData: {
        emailAddress: this.req.me ? this.req.me.email : this.req.session.limitedAuth ? this.req.session.limitedAuth.email : '',
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
