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
    if(this.req.param('trial', false) || this.req.session.trial ) {
      trial = true;
      promo = false;
      promoCode = '';
    }
    if(this.req.param('plan', false) && ['premium', 'basic'].includes(this.req.param('plan', false).toLowerCase())) {
      plan = this.req.param('plan', false).toLowerCase();
    }
    if(this.req.param('period', false) && ['annually', 'quarterly', 'monthly'].includes(this.req.param('period', false).toLowerCase())) {
      period = this.req.param('period', false).toLowerCase();
    }
    sails.log.info({
      plan: this.req.param('plan', false),
      period: this.req.param('period', false)
    });

    // Respond with view.
    return {
      needsAccount: !this.req.session.userId,
      trial: trial,
      plan: plan,
      billingCycle: period,
      promoShow: promo,
      formData: {
        promoCode: promoCode
      }
    };
  }
};
