module.exports = {


  friendlyName: 'View pricing',


  description: 'Display "Pricing" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/pricing'
    }

  },


  fn: async function () {

    sails.sess
    // Respond with view.
    return {
      trial: this.req.param('trial', false)
    };

  }


};
