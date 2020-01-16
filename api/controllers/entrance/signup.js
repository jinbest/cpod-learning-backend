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
    level: {
      type: 'string',
      description: 'User level as one of these types [newbie, elementary, preInt, intermediate, upperInt, advanced]',
    },
    charSet: {
      type: 'string',
      description: 'User character set [simplified, traditional]',
    }
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
    // const axios = require('axios');
    const ua = require('universal-analytics');
    var req = this.req;

    let password = await sails.helpers.passwordGenerate();

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

    //Google Analytics Call
    this.req.visitor.event("sign_up", "sign_up").send();

    let mauticLead = await sails.helpers.mautic.createContact.with({
      email: email,
      userId: newUserRecord.id,
      optIn: inputs.optIn,
      ipData: ipData
    }).catch((e) => {
      sails.log.error(e)
    });

    if (sails.config.custom.verifyEmailAddresses) {
      // Send "confirm account" email
      // await sails.helpers.sendPlainTextTemplateEmail.with({
      //   to: email,
      //   subject: 'Please confirm your account',
      //   template: 'email-verify-account',
      //   templateData: {
      //     fullName: name,
      //     email: email,
      //     password: password,
      //     token: newUserRecord.code ? newUserRecord.code : '',
      //     mobile: false,
      //     confirmation: false
      //   }
      // });
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

    // Dropping Mailchimp since migration
    // if (inputs.optIn) {
    //   const data = {
    //     email_address: email,
    //     status: 'subscribed'
    //   };
    //   axios.post('https://us9.api.mailchimp.com/3.0/lists/0a8579be6a/members', data, {
    //     mode: 'no-cors', // no-cors, cors, *same-origin
    //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': 'apikey d1056769726aa0f9129a5ce02a23dd93-us9'
    //     }
    //   }).catch((err) => {
    //     console.log(err)
    //   });
    // }

    let level = '';
    if (inputs.level) {
      level = inputs.level.toString();
      if (['newbie', 'elementary', 'preInt', 'intermediate', 'upperInt', 'advanced'].includes(level)) {
        let levelId = 1;
        switch (level) {
          case 'newbie':
            levelId = 1;
            break;
          case 'elementary':
            levelId = 2;
            break;
          case 'preInt':
            levelId = 6;
            break;
          case 'intermediate':
            levelId = 3;
            break;
          case 'upperInt':
            levelId = 4;
            break;
          case 'advanced':
            levelId = 5;
            break;
        }
        await sails.helpers.users.setOption.with({
          userId: newUserRecord.id,
          type: 'level',
          value: levelId
        });
        await sails.helpers.users.setOption.with({
          userId: newUserRecord.id,
          type: 'levels',
          value: level
        })
      } else {
        level = 'INVALID | User level as one of these types [newbie, elementary, preInt, intermediate, upperInt, advanced]'
      }
    }
    let charSet = '';
    if (inputs.charSet) {
      charSet = inputs.charSet
      //TODO Helper Set user Char Set
    }
    return {
      id: newUserRecord.id,
      optIn: inputs.optIn,
      level: level ? level : '',
      charSet: charSet ? charSet : ''
    };
  }
};
