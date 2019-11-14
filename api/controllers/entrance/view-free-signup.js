module.exports = {


  friendlyName: 'View free signup',


  description: 'Display "Free signup" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/entrance/free-signup'
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
