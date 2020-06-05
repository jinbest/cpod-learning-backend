module.exports = {


  friendlyName: 'View booking',


  description: 'Display "Booking" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/booking'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
