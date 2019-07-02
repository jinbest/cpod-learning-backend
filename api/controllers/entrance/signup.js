module.exports = {


  friendlyName: 'Email Signup',


  description: 'Sign up for a new user account just taking their email.',


  extendedDescription:
    `This creates a new user record in the database, signs in the requesting user agent
by modifying its [session](https://sailsjs.com/documentation/concepts/sessions), and
(if emailing with Mailgun is enabled) sends an account verification email.

If a verification email is sent, the new user's account is put in an "unconfirmed" state
until they confirm they are using a legitimate email address (by clicking the link in
the account verification message.)`,


  inputs: {

    emailAddress: {
      required: true,
      type: 'string',
      isEmail: true,
      description: 'The email address for the new account, e.g. m@example.com.',
      extendedDescription: 'Must be a valid email address.',
    },
    optIn: {
      type: 'boolean',
      description: 'Checkbox to Receive ChinesePod Marketing emails',
    }
  },


  exits: {

    success: {
      description: 'New user account was created successfully.'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided fullName, password and/or email address are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
        'parameters should have been validated/coerced _before_ they were sent.'
    },

    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },

  },

  fn: async function (inputs) {
    const email = inputs.emailAddress.toLowerCase();
    const ipdata =  require('ipdata');
    const axios = require('axios');
    var req = this.req;

    let password = await sails.helpers.passwordGenerate();

    const ip = req.ip ? req.ip : false;
    let ipData = {};

    if(ip) {
      await ipdata.lookup(req.ip, '67ce141658c735941e1307cf08fcf9a40cd5101a64f19ea674688fff')
        .then(function (info) {
          ipData = info;
        })
        .catch(function (err) {
          //TODO Handle error
        });
    }

    //TODO Timezone / Lattitude / Longtitude / Postal

    let name = '', userName = '';
    name = email.split('@')[0].replace(/[^0-9a-z]/gi, ' ');
    userName = name.replace(' ', '');
    if (userName.length < 6 || userName.length > 20) {
      userName = await sails.helpers.passwordGenerate.with({
        pattern: 'w'
      });
      userName += Math.floor(Math.random() * Math.floor(50))
    }
    // Create new User record
    let newUserRecord = await User.create(_.extend({
      email: email,
      password: await sails.helpers.passwordHash.with({
        password: password,
        method: 'E'
      }),
      username: userName,
      name: name,
      ip_address: ip,
      ip_country: ipData['country_name'],
      ip_region: ipData['region'],
      ip_city: ipData['city'],
      country: ipData['country_name'],
      city: ipData['city'],
      http_referer: this.req.headers.referer ? this.req.headers.referer : '',
      code: await sails.helpers.strings.random('url-friendly'),
      confirm_status: 0
    }))
      .intercept('E_UNIQUE', 'emailAlreadyInUse')
      .intercept({name: 'UsageError'}, 'invalid')
      .fetch();

    let newUserSite = await UserSiteLinks.create(_.extend({
      user_id: newUserRecord.id,
      usertype_id: 7, //Free
      expiry: new Date().toISOString()
    }, inputs.optIn ? {
      academic_email: 1,
      activity_email: 1,
      other_email: 1,
      show_email: 1,
      newsletter_email: 1,
      meetup_email: 1,
    }:{}))
      .fetch();

    // Store the user's new id in their session.
    this.req.session.userId = newUserRecord.id;

    if (sails.config.custom.verifyEmailAddresses) {
      // Send "confirm account" email
      await sails.helpers.sendTemplateEmail.with({
        to: email,
        subject: 'Please confirm your account',
        template: 'email-verify-account',
        templateData: {
          fullName: name,
          email: email,
          password: password,
          token: newUserRecord.code ? newUserRecord.code : '',
          mobile: false,
          confirmation: false
        }
      });
    } else {
      sails.log.info('Skipping new account email verification... (since `verifyEmailAddresses` is disabled)');
    }
    if (inputs.optIn) {
      const data = {
        email_address: email,
        status: 'subscribed'
      };
      axios.post('https://us9.api.mailchimp.com/3.0/lists/0a8579be6a/members', data, {
        mode: 'no-cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'apikey d1056769726aa0f9129a5ce02a23dd93-us9'
        }
      });
    }
    return newUserRecord.id;
  }
};
