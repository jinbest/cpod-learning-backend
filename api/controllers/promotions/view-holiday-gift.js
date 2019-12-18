module.exports = {


  friendlyName: 'View holiday gift',


  description: 'Display "Holiday gift" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/promotions/holiday-gift'
    }

  },


  fn: async function () {

    // Respond with view.
    const geoip = require('geoip-country');

    try {
      let geo = geoip.lookup(this.req.ip);
      if (geo['country'] === 'US') {
        return this.res.redirect('/')
      }
    } catch (e) {
      sails.log.error(e)
    }

    return {};

  }


};
