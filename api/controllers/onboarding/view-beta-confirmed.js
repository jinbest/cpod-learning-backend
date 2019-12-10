module.exports = {


  friendlyName: 'View beta confirmed',


  description: 'Display "Beta confirmed" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/onboarding/beta-confirmed'
    }

  },


  fn: async function () {

    // Respond with view.

    if (!this.req.cookies.beta_tester) {

      this.res.cookie('new_dashboard', true, {
        domain: '.chinesepod.com',
        expires: new Date(Date.now() + 365.25 * 24 * 60 * 60 * 1000)
      });

      this.res.cookie('beta_tester', true, {
        domain: '.chinesepod.com',
        expires: new Date(Date.now() + 365.25 * 24 * 60 * 60 * 1000)
      });

      let greeting = await sails.helpers.users.calculateUserGreeting(this.req.me.id);

      await sails.helpers.sendTemplateEmail.with({
        to: this.req.me.email,
        subject: 'Welcome to the ChinesePod Beta Program',
        template: 'automated/email-alice-beta-welcome',
        layout: false,
        templateData: {
          greeting: greeting
        }
      });
    }

    return {};

  }


};
