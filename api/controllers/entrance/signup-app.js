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
    },
    optIn: {
      type: 'boolean',
      description: 'Checkbox to Receive ChinesePod Marketing emails',
    },
    password: {
      required: true,
      type: 'string',
      description: 'User Designated Password'
    },
    clientKey: {
      type: 'string',
      required: true
    },
    clientType: {
      type: 'string',
      required: true
    },
  },


  exits: {

    success: {
      description: 'New user account was created successfully.'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided email address is invalid.',
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
    const IPData =  require('ipdata').default;
    const ipdata = new IPData(sails.config.custom.ipDataKey);

    const randomToken = require('rand-token');

    var req = this.req;

    let password = inputs.password;

    const ip = req.ip ? req.ip : false;
    let ipData = {};

    if(ip) {
      try {
        await ipdata.lookup(req.ip)
          .then((info) => {
            ipData = info;
          })
          .catch((err) => {
            sails.log.info(err);
          });
      } catch (e) {
        sails.log.error(e)
      }

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
    } else {

      userName += Math.floor(Math.random() * Math.floor(50))

    }
    // Create new User record

    sails.log.info(userName);

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
      code: randomToken.generate(8, 'default').toUpperCase(),
      confirm_status: 0
    }))
      .intercept('E_UNIQUE', 'emailAlreadyInUse')
      .intercept({name: 'UsageError'}, 'invalid')
      .fetch();

    let newUserSite = await UserSiteLinks.create(_.extend({
      user_id: newUserRecord.id,
      usertype_id: 7, //Free
      expiry: new Date().toISOString(),
      signup_user_agent: this.req.headers['user-agent']
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

    //Google Analytics Call
    this.req.visitor.event("sign_up", "sign_up").send();

    await sails.helpers.mautic.createContact.with({
      email: email,
      userId: newUserRecord.id,
      optIn: inputs.optIn,
      ipData: ipData
    }).catch((e) => {
    });

    if (sails.config.custom.verifyEmailAddresses) {

      await sails.helpers.sendTemplateEmail.with({
        to: email,
        subject: 'Please confirm your account',
        template: 'email-verify-account-mobile-app',
        templateData: {
          token: newUserRecord.code ? newUserRecord.code : ''
        }
      });
    } else {
      sails.log.info('Skipping new account email verification... (since `verifyEmailAddresses` is disabled)');
    }

    return {
      id: newUserRecord.id,
      optIn: inputs.optIn,
    };
  }
};
