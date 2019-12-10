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


      var path = require('path');
      var url = require('url');
      var util = require('util');

      var layout = false;

      // Determine appropriate email layout and template to use.
      var emailTemplatePath = path.join('emails/', 'automated/email-susie-beta-welcome');

      // Compile HTML template.
      // > Note that we set the layout, provide access to core `url` package (for
      // > building links and image srcs, etc.), and also provide access to core
      // > `util` package (for dumping debug data in internal emails).
      var htmlEmailContents = await sails.renderView(
        emailTemplatePath,
        _.extend({layout, url, util }, {greeting: greeting})
      )
        .intercept((err)=>{
          err.message =
            'Could not compile view template.\n'+
            '(Usually, this means the provided data is invalid, or missing a piece.)\n'+
            'Details:\n'+
            err.message;
          return err;
        });

      await sails.helpers.mailgun.sendHtmlEmail.with({
        htmlMessage: htmlEmailContents,
        to: this.req.me.email,
        subject: 'Welcome to the ChinesePod Beta Program',
        from: 'susie@chinesepod.com',
        fromName: 'Susie Lei'
      })

      // await sails.helpers.sendTemplateEmail.with({
      //   to: this.req.me.email,
      //   subject: 'Welcome to the ChinesePod Beta Program',
      //   template: 'automated/email-alice-beta-welcome',
      //   layout: false,
      //   templateData: {
      //     greeting: greeting
      //   }
      // });
    }

    return {};

  }


};
