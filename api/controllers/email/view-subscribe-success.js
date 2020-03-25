module.exports = {


  friendlyName: 'View subscribe success',


  description: 'Display "Subscribe success" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/email/subscribe-success'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
