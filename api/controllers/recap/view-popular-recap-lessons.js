module.exports = {


  friendlyName: 'View popular lessons',


  description: 'Display "Popular lessons" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/recap/popular-recap-lessons'
    }

  },


  fn: async function () {

    // Respond with view.
    return {
      days: this.req.param('days', '')
    };

  }


};
