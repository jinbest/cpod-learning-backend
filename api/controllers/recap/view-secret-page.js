module.exports = {


  friendlyName: 'View Relevant Recap Lessons',


  description: 'Display "Recap lessons" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/recap/secret-page'
    }

  },


  fn: async function () {

    //Return view
    return {
      days: this.req.param('days', '')
    };
  }


};