module.exports = {


  friendlyName: 'View cyber monday',


  description: 'Display "Cyber Monday" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/promotions/cyber-monday-last-chance'
    }

  },


  fn: async function (inputs) {

    let expiry = new Date(Date.now() + 4 * 60 * 60 * 1000);

    if (this.req.cookies.cyber_last) {
      expiry = new Date(this.req.cookies.cyber_last);
    } else {
      this.req.session.expiry = expiry;
      this.res.cookie('cyber_last', expiry, {
        domain: '.chinesepod.com',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
    }

    let trial = false; let promo = true; let plan = 'premium'; let period = 'annually'; let promoCode = 'CYBERMONDAY';

    const addressfield = require('../../../lib/addressfield.json');

    let ipData = {};

    // Respond with view.
    return {
      expiry: expiry,
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
        discount: 0
      },
      stripeKey: sails.config.custom.stripePublishableKey,
      addressfield: addressfield
    };

  }


};
