module.exports = {


  friendlyName: 'View recap',


  description: 'Display "Recap" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/recap/beta/feedback'
    }

  },


  fn: async function () {
    // Respond with view.
    return {
      layout: false
    };

  }


};
