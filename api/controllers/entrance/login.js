module.exports = {


  friendlyName: 'Login',


  description: 'Log in using the provided email and password combination.',


  extendedDescription:
`This action attempts to look up the user record in the database with the
specified email address.  Then, if such a user exists, it uses
bcrypt to compare the hashed password from the database with the provided
password attempt.`,


  inputs: {

    emailAddress: {
      description: 'The email to try in this attempt, e.g. "irl@example.com".',
      type: 'string',
      required: true
    },

    password: {
      description: 'The unencrypted password to try in this attempt, e.g. "passwordlol".',
      type: 'string',
      required: true
    },

    rememberMe: {
      description: 'Whether to extend the lifetime of the user\'s session.',
      extendedDescription:
`Note that this is NOT SUPPORTED when using virtual requests (e.g. sending
requests over WebSockets instead of HTTP).`,
      type: 'boolean'
    }

  },


  exits: {

    success: {
      description: 'The requesting user agent has been successfully logged in.',
      extendedDescription:
`Under the covers, this stores the id of the logged-in user in the session
as the \`userId\` key.  The next time this user agent sends a request, assuming
it includes a cookie (like a web browser), Sails will automatically make this
user id available as req.session.userId in the corresponding action.  (Also note
that, thanks to the included "custom" hook, when a relevant request is received
from a logged-in user, that user's entire record from the database will be fetched
and exposed as \`req.me\`.)`
    },

    badCombo: {
      description: `The provided email and password combination does not
      match any user in the database.`,
      responseType: 'unauthorized'
      // ^This uses the custom `unauthorized` response located in `api/responses/unauthorized.js`.
      // To customize the generic "unauthorized" response across this entire app, change that file
      // (see api/responses/unauthorized).
      //
      // To customize the response for _only this_ action, replace `responseType` with
      // something else.  For example, you might set `statusCode: 498` and change the
      // implementation below accordingly (see http://sailsjs.com/docs/concepts/controllers).
    }

  },


  fn: async function (inputs) {

    let randomToken = require('rand-token');

    sails.log.info({inputs: inputs});

    // Look up by the email address.
    // (note that we lowercase it to ensure the lookup is always case-insensitive,
    // regardless of which database we're using)
    var userRecord = await User.findOne({
      email: inputs.emailAddress.toLowerCase(),
    });

    sails.log.info({userRecord: userRecord});

    // If there was no matching user, respond thru the "badCombo" exit.
    if(!userRecord) {
      sails.log.warn(`badCombo - ${this.req.ip} - ${inputs.emailAddress} - ${this.req.headers['user-agent']}`);
      throw 'badCombo';
    }

    // // If the password doesn't match, then also exit thru "badCombo".
    // await sails.helpers.passwords.checkPassword(inputs.password, userRecord.password)
    // .intercept('incorrect', 'badCombo');

    const submittedPass = await sails.helpers.passwordHash(inputs.password);
    if (submittedPass !== userRecord.password){
      sails.log.warn(`badCombo - ${this.req.ip} - ${inputs.emailAddress} - ${this.req.headers['user-agent']}`);
      throw 'badCombo';
    }

    // If "Remember Me" was enabled, then keep the session alive for
    // a longer amount of time.  (This causes an updated "Set Cookie"
    // response header to be sent as the result of this request -- thus
    // we must be dealing with a traditional HTTP request in order for
    // this to work.)
    if (inputs.rememberMe) {
      if (this.req.isSocket) {
        sails.log.warn(
          'Received `rememberMe: true` from a virtual request, but it was ignored\n'+
          'because a browser\'s session cookie cannot be reset over sockets.\n'+
          'Please use a traditional HTTP request instead.'
        );
      } else {
        this.req.session.cookie.maxAge = sails.config.custom.rememberMeCookieMaxAge;
      }
    }

    // Modify the active session instance.
    // (This will be persisted when the response is sent.)
    this.req.session.userId = userRecord.id;

    delete this.req.session.limitedAuth;

    if (!this.req.wantsJSON) {
      await sails.helpers.createPhpSession.with({
        userId: userRecord.id,
        // sessionId: this.req.session.id
      })
        .then((phpSessionId) => {

          if (sails.config.environment !== 'production' || sails.config.environment === 'staging') {
          } else {
            this.res.cookie('CPODSESSID', phpSessionId, {
              domain: '.chinesepod.com',
              expires: new Date(Date.now() + 365.25 * 24 * 60 * 60 * 1000)
            });
          }
        });
    } else if (inputs.clientId) {
      const refreshToken = randomToken.uid(128);

      await RefreshTokens.create({
        user_id: userRecord.id,
        refresh_token: refreshToken,
        expiry: new Date(Date.now() + sails.config.custom.jwtRefreshExpiry),
        client_id: inputs.clientId,
        ip_address: this.req.ip,
        user_agent: this.req.headers['user-agent']
      })

      return {
        token: jwToken.sign({userId: userRecord.id}),
        refreshToken: refreshToken
      };
    }

  }
};
