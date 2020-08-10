module.exports = {


  friendlyName: 'Login with Google',


  description: 'Log in using the provided email and password combination.',


  extendedDescription:
`This action attempts to look up the user record in the database with the
specified email address.  Then, if such a user exists, it uses
bcrypt to compare the hashed password from the database with the provided
password attempt.`,


  inputs: {

    tokeninfo: {
      description: 'The email to try in this attempt, e.g. "irl@example.com".',
      type: 'string',
      required: true
    },

  },


  exits: {

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

    const axios = require('axios');
    const randomToken = require('rand-token');

    let user;
    try {
      user = await axios.get('https://oauth2.googleapis.com/tokeninfo?id_token=' + inputs.tokeninfo);
    } catch (e) {
      throw 'badCombo'
    }

    if (!user || !user.email) {
      throw 'badCombo'
    }

    let userData = await User.findOne({email: user.email.toLowerCase()});

    if (!userData) {
      const ip = this.req.ip ? this.req.ip : false;
      let ipData = {};

      if(ip && ip !== '::1') {
        try {
          await ipdata.lookup(req.ip)
            .then((info) => {
              ipData = info;
            })
            .catch((err) => {
              sails.log.error(err);
            });
        } catch (e) {
          sails.log.error(e);
        }

      }

      userData = await User.create({
        email: user.email,
        password: user.id,
        username: user.name.split(' ').join('') + Math.ceil(Math.random() * 100),
        name: user.name,
        ip_address: ip,
        ip_country: ipData['country_name'] ? ipData['country_name'] : null,
        ip_region: ipData['region'] ? ipData['region'] : null,
        ip_city: ipData['city'] ? ipData['city'] : null,
        country: ipData['country_name'] ? ipData['country_name'] : null,
        city: ipData['city'] ? ipData['city'] : null,
        http_referer: this.req.headers.referer ? this.req.headers.referer : '',
        code: user.id,
        confirm_status: 1
      }).fetch();

      await UserSiteLinks.create({
        user_id: userData.id,
        usertype_id: 7, //Free
        expiry: new Date().toISOString(),
        signup_user_agent: this.req.headers['user-agent']
      });

      //Google Analytics Call
      try {
        this.req.visitor.event("sign_up", "sign_up").send();
      } catch (e) {
        sails.hooks.bugsnag.notify(e);
      }

      await sails.helpers.mautic.createContact.with({
        email: userData.email,
        userId: userData.id,
        ipData: ipData,
        optIn: true
      })
        .catch((e) => {sails.log.error(e)});

    }

    const refreshToken = randomToken.uid(128);

    await RefreshTokens.create({
      user_id: userData.id,
      refresh_token: refreshToken,
      ip_address: this.req.ip,
      user_agent: this.req.headers['user-agent']
    })

    return {
      token: jwToken.sign({userId: userData.id}),
      refreshToken: refreshToken
    };

  }
};
