module.exports = {


  friendlyName: 'View pricing',


  description: 'Display "Pricing" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/onboarding/pricing-alt'
    }

  },


  fn: async function () {

    // Respond with view.
    let trial = false;
    if(this.req.param('trial', false) || this.req.session.trial ) {
      trial = true
    }
    if(this.req.me && this.req.me.trial) {
      trial = false
    }
    return {
      trial: trial,
      conversion: false
    };

  }


};
