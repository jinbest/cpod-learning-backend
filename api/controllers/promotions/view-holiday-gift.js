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

    let geo = {};

    if (process.env.NODE_ENV === 'production') {
      try {
        geo = geoip.lookup(this.req.ip);
      } catch (e) {
        sails.log.error(e)
      }
    }

    if (geo['country'] === 'US') {
      return this.res.redirect('/');
    } else {
      return {
        layout: 'layouts/layout-promo',
      };
    }


  }


};
