/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */

module.exports = {


  friendlyName: 'View checkout',


  description: 'Display "Checkout" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/checkout'
    }

  },

  fn: async function () {

    let trial = false; let promo = false; let plan = 'premium'; let period = 'monthly'; let promoCode = '';

    if(this.req.param('promo', false)) {
      promo = true;
      if (this.req.param('promo')) {
        promoCode = this.req.param('promo').toLowerCase() === 'yes' ? '' : this.req.param('promo').toUpperCase();
      }
    }
    if(this.req.param('trial', false) || this.req.session.trial) {
      trial = true;
      promo = false;
      promoCode = '';

      // Remove Trial for users who have already used it
      if (this.req.me && this.req.me.trial){
        trial = false;
      }
    }

    if(this.req.param('plan', false) && ['premium', 'basic'].includes(this.req.param('plan', false).toLowerCase())) {
      plan = this.req.param('plan', false).toLowerCase();
    }
    if(this.req.param('period', false) && ['annually', 'quarterly', 'monthly'].includes(this.req.param('period', false).toLowerCase())) {
      period = this.req.param('period', false).toLowerCase();
    }

    // Respond with view.
    return {
      needsAccount: !(this.req.me || this.req.session.limitedAuth),
      trial: trial,
      plan: plan,
      billingCycle: period,
      promoShow: promo,
      formData: {
        emailAddress: this.req.me ? this.req.me.email : this.req.session.limitedAuth ? this.req.session.limitedAuth.email : '',
        promoCode: promoCode
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
