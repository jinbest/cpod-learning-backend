module.exports = {


  friendlyName: 'View level',


  description: 'Display "Level" page.',

  inputs: {
    level: {
      type: 'string',
      description: 'The email address for the new account, e.g. m@example.com.',
      extendedDescription: 'Must be a valid email address.',
    }
  },


  exits: {

    success: {
      viewTemplatePath: 'pages/onboarding/level'
    }

  },


  fn: async function () {

    // Respond with view.

    //TODO Add redirect for the time being - eventually implement logged in/not logged in page views
    if (!this.req.me) {
      return this.res.redirect('/login')
    }

    // Respond with view.

    return {
      nextPage: this.req.param('nextPage', false)
    };

  }
};
