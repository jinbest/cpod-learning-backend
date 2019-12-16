module.exports = {


  friendlyName: 'View recap',


  description: 'Display "Recap" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/recap/recap'
    }

  },


  fn: async function () {
    // Respond with view.
    return {};

  }


};
