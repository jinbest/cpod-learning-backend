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
    const ipdata =  require('ipdata');
    // return await sails.helpers.passwordHash.with({
    //   password: inputs.emailAddress,
    //   method: 'E'
    // });
    const pass = await sails.helpers.passwordGenerate();

    // const ip = this.req.ip;

    const ip = '42.200.130.138';

    console.log(ip);
    console.log(this.req.referer);

    let ipData = {};

    // await ipdata.lookup(ip, '67ce141658c735941e1307cf08fcf9a40cd5101a64f19ea674688fff')
    //   .then(function (info) {
    //     ipData = info;
    //   })
    //   .catch(function (err) {
    //     //TODO Handle error
    //   });
    //TODO Timezone / Lattitude / Longtitude / Postal

    //TODO Name / Username

    let name = '', userName = '';
    name = inputs.emailAddress.split('@')[0].replace(/[^0-9a-z]/gi, ' ');
    console.log(name);
    userName = name.replace(' ', '');
    if (userName.length < 6 || userName.length > 20) {
      userName = await sails.helpers.passwordGenerate.with({
        numWords: 1
      });
      console.log(userName);
      userName += Math.floor(Math.random() * Math.floor(100))
      console.log(userName);
    }
    console.log(name);

    console.log(ipData);

    // let newUserRecord = await Users.create(_.extend({
    //   email: inputs.email,
    //   password: await sails.helpers.passwordHash.with({ pass }),
    //   ip_address: ip,
    //   ip_country: '',
    //   ip_state: '',
    //   ip_city: '',
    //   country: '',
    //   city: '',
    //   http_referer: this.req.headers.referer ? this.req.headers.referer : '',
    //
    // }, sails.config.custom.verifyEmailAddresses? {
    //   code: await sails.helpers.strings.random('url-friendly'),
    //   confirm_status: 0,
    // }:{}))
    //   .intercept('E_UNIQUE', 'emailAlreadyInUse')
    //   .intercept({name: 'UsageError'}, 'invalid')
    //   .fetch()
    //   .exec(console.log);
  }
};
