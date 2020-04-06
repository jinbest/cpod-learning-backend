module.exports = {


  friendlyName: 'View Relevant Recap Lessons',


  description: 'Display "Recap lessons" page.',

  inputs: {
    level: {
      type: 'string'
    },
    days: {
      type: 'number'
    }
  },

  exits: {

    success: {
      viewTemplatePath: 'pages/recap/secret-page'
    }

  },


  fn: async function (inputs) {

    //Return view
    return {
      days: this.req.param('days', ''),
      level: inputs.level
    };
  }


};
