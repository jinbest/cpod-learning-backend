module.exports = {


  friendlyName: 'View contact',


  description: 'Display "Contact" page.',

  exits: {

    success: {
      viewTemplatePath: 'pages/academic-offers'
    }

  },


  fn: async function () {

    // Respond with view.
    return {
      title: 'Academic Offers | ChinesePod'
    };

  }


};
