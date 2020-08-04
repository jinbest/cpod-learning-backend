module.exports = {


  friendlyName: 'View signup',


  description: 'Display "Signup" page.',

  exits: {

    success: {
      viewTemplatePath: 'pages/entrance/signup',
    },

    redirect: {
      description: 'The requesting user is already logged in.',
      responseType: 'redirect'
    }

  },


  fn: async function () {

    if (this.req.me) {
      throw {redirect: '/home'};
    }

    if (this.req.param('campaignId')) {
      this.req.session.campaignId = this.req.param('campaignId').toUpperCase();
    }

    return {};

  }


};
