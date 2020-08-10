module.exports = {


  friendlyName: 'Confirm email',


  description:
    `Confirm a new user's email address, or an existing user's request for an email address change,
then redirect to either a special landing page (for newly-signed up users), or the account page
(for existing users who just changed their email address).`,


  inputs: {

    code: {
      description: 'The confirmation code from the email.',
      example: '4-32fad81jdaf$329'
    }

  },


  exits: {

    success: {
      description: 'Email address confirmed and requesting user logged in.'
    },

    redirect: {
      description: 'Email address confirmed and requesting user logged in.  Since this looks like a browser, redirecting...',
      responseType: 'redirect'
    },

    invalidOrExpiredToken: {
      responseType: 'expired',
      description: 'The provided token is expired, invalid, or already used up.',
    },

    emailAddressNoLongerAvailable: {
      statusCode: 409,
      viewTemplatePath: '500',
      description: 'The email address is no longer available.',
      extendedDescription: 'This is an edge case that is not always anticipated by websites and APIs.  Since it is pretty rare, the 500 server error page is used as a simple catch-all.  If this becomes important in the future, this could easily be expanded into a custom error page or resolution flow.  But for context: this behavior of showing the 500 server error page mimics how popular apps like Slack behave under the same circumstances.',
    }

  },


  fn: async function (inputs) {

    let randomToken = require('rand-token');

    // If no token was provided, this is automatically invalid.
    if (!inputs.code) {
      throw 'invalidOrExpiredToken';
    }

    // Get the user with the matching email token.
    let user;
    try {
      user = await User.findOne({ code: inputs.code });
    } catch (e) {
      throw 'invalidOrExpiredToken';
    }


    // If no such user exists, or their token is expired, bail.
    if (!user || user.confirm_status) {
      throw 'invalidOrExpiredToken';
    }

    // if (user.confirm_status === 0) {
    //  ┌─┐┌─┐┌┐┌┌─┐┬┬─┐┌┬┐┬┌┐┌┌─┐  ╔═╗╦╦═╗╔═╗╔╦╗ ╔╦╗╦╔╦╗╔═╗  ╦ ╦╔═╗╔═╗╦═╗  ┌─┐┌┬┐┌─┐┬┬
    //  │  │ ││││├┤ │├┬┘││││││││ ┬  ╠╣ ║╠╦╝╚═╗ ║───║ ║║║║║╣   ║ ║╚═╗║╣ ╠╦╝  ├┤ │││├─┤││
    //  └─┘└─┘┘└┘└  ┴┴└─┴ ┴┴┘└┘└─┘  ╚  ╩╩╚═╚═╝ ╩   ╩ ╩╩ ╩╚═╝  ╚═╝╚═╝╚═╝╩╚═  └─┘┴ ┴┴ ┴┴┴─┘
    // If this is a new user confirming their email for the first time,
    // then just update the state of their user record in the database,
    // store their user id in the session (just in case they aren't logged
    // in already), and then redirect them to the "plan selection" page.
    await User.updateOne({ id: user.id }).set({
      confirm_status: 1
    });
    this.req.session.userId = user.id;

    //Google Analytics Update
    this.req.visitor.event("confirm_account", "confirm_account").send();

    if (this.req.wantsJSON) {

      const refreshToken = randomToken.uid(128);

      await RefreshTokens.create({
        user_id: user.id,
        refresh_token: refreshToken,
        ip_address: this.req.ip,
        user_agent: this.req.headers['user-agent']
      })

      return {
        success: 1,
        token: jwToken.sign({userId: user.id}),
        refreshToken: refreshToken
      };
    } else {
      //Create PHP Website Session & Cookie
      await sails.helpers.createPhpSession.with({
        userId: user.id,
      })
        .then((phpSessionId) => {
          sails.log.info(phpSessionId);
          this.res.cookie('CPODSESSID', phpSessionId, {
            domain: '.chinesepod.com',
            expires: new Date(Date.now() + 365.25 * 24 * 60 * 60 * 1000)
          });
        });


      let access = await sails.helpers.users.getAccessType(user.id);

      if (access !== 'free') {
        return this.res.redirect('/home')
      }

      return this.res.redirect('/email/confirmed');

      const currentDate = new Date();
      const geoip = require('geoip-country');
      const geo = geoip.lookup(this.req.ip);

      if (!geo || !geo.country){

        return this.res.redirect('/pricing');

      } else if (sails.config.custom.coreMarkets.includes(geo.country) && !sails.config.custom.coreFreeMonths.includes(currentDate.getMonth())) {

        return this.res.redirect('/pricing');

      } else if (!sails.config.custom.coreMarkets.includes(geo.country) && !sails.config.custom.nonCoreFreeMonths.includes(currentDate.getMonth())) {

        return this.res.redirect('/pricing');

      }

      return this.res.redirect('/home')

    }

  }


};
