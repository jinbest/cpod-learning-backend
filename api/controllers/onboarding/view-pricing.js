module.exports = {


  friendlyName: 'View pricing',


  description: 'Display "Pricing" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/onboarding/pricing'
    }

  },


  fn: async function () {

    // Respond with view.
    let trial = false;
    if(this.req.param('trial', false) || this.req.session.trial ) {
      trial = true
    }
    return {
      trial: trial
    };

  }


};