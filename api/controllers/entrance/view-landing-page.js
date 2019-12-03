module.exports = {


  friendlyName: 'View landing page',


  description: 'Display "Landing" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/entrance/landing-page',
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

    return {};

  }


};
