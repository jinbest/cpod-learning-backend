module.exports = {


  friendlyName: 'View logos',


  description: 'Display "Logos" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/misc/logos'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
