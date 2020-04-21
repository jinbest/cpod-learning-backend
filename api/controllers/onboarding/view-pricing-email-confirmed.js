module.exports = {


  friendlyName: 'View pricing',


  description: 'Display "Pricing" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/onboarding/pricing-email-confirmed'
    }

  },


  fn: async function () {

    // Respond with view.
    let trial = false;
    let showFree = true;
    if(this.req.param('trial', false) || this.req.session.trial ) {
      trial = true
    }
    if(this.req.me && this.req.me.trial) {
      sails.log.info(this.req.me);
      trial = false;
      delete this.req.session.trial
    }

    const currentDate = new Date();
    const geoip = require('geoip-country');
    const geo = geoip.lookup(this.req.ip);

    if (!geo || !geo.country){

      trial = false;
      delete this.req.session.trial;
      showFree = false;

    } else if (sails.config.custom.coreMarkets.includes(geo.country) && !sails.config.custom.coreFreeMonths.includes(currentDate.getMonth())) {

      trial = false;
      delete this.req.session.trial;
      showFree = false;

    } else if (!sails.config.custom.coreMarkets.includes(geo.country) && !sails.config.custom.nonCoreFreeMonths.includes(currentDate.getMonth())) {

      trial = false;
      delete this.req.session.trial;
      showFree = false;

    }


    return {
      trial: trial,
      conversion: false,
      showFree: showFree
    };

  }


};
