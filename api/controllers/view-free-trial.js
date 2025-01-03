module.exports = {


  friendlyName: 'View why choose us',


  description: 'Display "Why choose us" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/free-trial'
    }

  },


  fn: async function () {

    if (this.req.param('campaignId')) {
      this.req.session.campaignId = this.req.param('campaignId').toUpperCase();
    }

    // Respond with view.
    return {
      title: 'Free Trial | ChinesePod'
    };

  }


};
