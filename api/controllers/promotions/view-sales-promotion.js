module.exports = {


  friendlyName: 'View sales promotion',


  description: 'Display "Sales promotion" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/promotions/sales-promotion'
    }

  },

  inputs: {
    code: {
      type: 'string'
    }
  },


  fn: async function (inputs) {

    let expiry = new Date(Date.now() + 4 * 60 * 60 * 1000);

    if (this.req.cookies.event) {
      expiry = new Date(this.req.cookies.event)
    } else {
      this.res.cookie('event', expiry, {
        domain: '.chinesepod.com',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
    }

    let trial = false; let promo = true; let plan = 'premium'; let period = 'annually'; let promoCode = 'BLACKFRIDAY';


    let ipData = {};

    const ipdata = require('ipdata');

    if(this.req.ip && this.req.ip !== '::1') {
      try {
        await ipdata.lookup(this.req.ip, sails.config.custom.ipDataKey)
          .then((info) => {
            ipData = info;
          })
          .catch((err) => {
            sails.log.error(err);
            sails.hooks.bugsnag.notify(err);
          });
      } catch (e) {
        sails.log.error(e)
      }
    }

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
        country: ipData['country_code'],
        state: ipData['region_code']
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
      stripeKey: sails.config.custom.stripePublishableKey
    };

  }


};
