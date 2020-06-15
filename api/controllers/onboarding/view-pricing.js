module.exports = {


  friendlyName: 'View pricing',


  description: 'Display "Pricing" page.',

  inputs: {
    trial: {
      type: 'boolean'
    }
  },


  exits: {

    success: {
      viewTemplatePath: 'pages/onboarding/pricing'
    }

  },


  fn: async function (inputs) {

    // Respond with view.
    let trial = true;
    let showFree = true;
    if(inputs.trial || this.req.param('trial', false) || this.req.session.trial ) {
      trial = true
    }

    if(this.req.me && this.req.me.trial) {
      trial = false;
      delete this.req.session.trial
    }

    const currentDate = new Date();
    const geoip = require('geoip-country');
    const geo = geoip.lookup(this.req.ip);

    if (true) { //!geo || !geo.country){ //TODO temporarily removal of forced geo check

      // trial = false;
      // delete this.req.session.trial;
      // showFree = false;

    } else if (sails.config.custom.coreMarkets.includes(geo.country) && sails.config.custom.coreFreeMonths.includes(currentDate.getMonth())) {

      trial = false;
      delete this.req.session.trial;
      showFree = false;

    } else if (!sails.config.custom.coreMarkets.includes(geo.country) && sails.config.custom.nonCoreFreeMonths.includes(currentDate.getMonth())) {

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
