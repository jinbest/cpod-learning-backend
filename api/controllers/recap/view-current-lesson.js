module.exports = {


  friendlyName: 'View current lesson',


  description: 'Display "Current lesson" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/recap/current-lesson'
    }
  },


  fn: async function () {

    const userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let returnData = await sails.helpers.users.getCurrentLesson.with({userId: userId})

    // Respond with view.
    return {...returnData,
      ...{
        syncing: false,
        rawOutput: JSON.stringify(returnData)
      }
    };
  }
};
