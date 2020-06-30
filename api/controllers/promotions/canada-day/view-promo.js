module.exports = {


  friendlyName: 'View promo',


  description: 'Display "Promo" page.',

  inputs: {
    annual: {
      type: 'boolean'
    }
  },


  exits: {

    // success: {
    //   viewTemplatePath: 'pages/promotions/kings-day/promo'
    // }

  },


  fn: async function (inputs) {
    let trial = false; let promo = true; let plan = 'premium'; let promoCode = 'CANADA'; let nonRecurring = false;

    let period = inputs.annual ? 'annually' : 'quarterly';

    let validPromos = await PromoCodes.find({promotion_code: promoCode, product_id: {in: [140, 2, 18, 142, 13, 14]}, expiry_date: {'>': new Date()}})

    if (!Array.isArray(validPromos) || !validPromos.length) {
      return this.res.view('pages/promotions/expired-promo')
    }

    const addressfield = require('../../../../lib/addressfield.json');

    let ipData = {};

    // Respond with view.
    return this.res.view('pages/promotions/canada-day/promo',{
      layout: 'layouts/layout-promo',
      expiry: null,
      needsAccount: !(this.req.me || this.req.session.limitedAuth),
      trial: trial,
      plan: plan,
      billingCycle: period,
      promoShow: promo,
      nonRecurring: nonRecurring,
      formData: {
        emailAddress: this.req.me ? this.req.me.email : this.req.session.limitedAuth ? this.req.session.limitedAuth.email : '',
        promoCode: promoCode,
        country: ipData['country'] ? ipData['country'] : 'US',
        state: '',
        city: '',
        postal: ''
      },
      bannerPrices: {
        monthly: 20.3,
        quarterly: 55.30,
        annual: 174.30
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
    });

  }


};
