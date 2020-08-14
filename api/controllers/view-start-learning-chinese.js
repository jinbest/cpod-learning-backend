module.exports = {


  friendlyName: 'View why choose us',


  description: 'Display "Why choose us" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/start-learning-chinese'
    }

  },


  fn: async function () {

    if (this.req.param('campaignId')) {
      this.req.session.campaignId = this.req.param('campaignId').toUpperCase();
    }

    // Respond with view.
    return {
      title: 'Start Learning Chinese Today with ChinesePod!'
    };

  }


};
