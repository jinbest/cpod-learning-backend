module.exports = {


  friendlyName: 'View checkout',


  description: 'Display "Checkout" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/checkout'
    }

  },

  fn: async function () {

    let trial = false; let promo = false; let plan = false; let promoCode = '';
    if(this.req.param('trial', false) || this.req.session.trial ) {
      trial = true
    }
    if(this.req.param('promo', false)) {
      promo = true;
      if (this.req.param('promo')) {
        promoCode = this.req.param('promo') == 'yes' ? '' : this.req.param('promo')
      }
    }


    // Respond with view.
    return {
      needsAccount: !this.req.session.userId,
      trial: trial,
      promoShow: promo,
      formData: {
        promoCode: promoCode
      }
    };


  }


};
