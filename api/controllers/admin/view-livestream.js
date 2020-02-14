module.exports = {


  friendlyName: 'View livestream',


  description: 'Display "Livestream" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/admin/livestream'
    }

  },


  fn: async function () {

    // Respond with view.
    return {streams: await Livestream.find({startTime: {'>': new Date(Date.now() - 24 * 60 * 60 * 1000)}})};

  }


};
