module.exports = {


  friendlyName: 'View subscribe',


  description: 'Display "Subscribe" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/email/subscribe'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
