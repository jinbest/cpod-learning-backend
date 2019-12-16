module.exports = {


  friendlyName: 'View switch page',


  description: 'Display "Switch" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/onboarding/switch-page'
    }

  },


  fn: async function () {

    // Respond with view.
    return {
      defaultPage: this.req.cookies['new_dashboard'] ? 'New ChinesePod Dashboard' : 'Legacy ChinesePod Dashboard',
      redirectTo: this.req.cookies['new_dashboard'] ? '/home' : '/dashboard'
    };

  }


};
