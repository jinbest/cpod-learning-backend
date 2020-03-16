/**
 * PassportController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var passport = require('passport');

const IPData = require('ipdata').default;
const ipdata = new IPData(sails.config.custom.ipDataKey);

module.exports = {
  facebookAuth: function(req, res, next) {
    passport.authenticate('facebook', { scope: ['email']})(req, res, next);
  },

  facebookCallback: function(req, res, next) {
    passport.authenticate('facebook', async function(err, user) {

      if(err || !user) {

        // redirect to login page
        sails.log.error('facebook callback error: '+err);
        res.redirect('/login');

      } else {

        sails.log.info('facebook credentials');
        sails.log.info(user);

        let hasEmail = true;

        if (!user.email) {

          sails.hooks.bugsnag.notify('No User Email: ' + JSON.stringify(user));

          user.email = `fb${user.id}`;
          hasEmail = false;
        }

        let userData = await User.findOne({email: user.email.toLowerCase()});

        let newAccount = false;

        if (!userData) {
          userData = await User.findOne({email: `fb${user.id}`});
        }

        if (!userData) {
          newAccount = true;
          const ip = req.ip ? req.ip : false;
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

          user.name = user.first_name + ' ' + user.last_name;

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
            http_referer: req.headers.referer ? req.headers.referer : '',
            code: user.id,
            confirm_status: hasEmail
          }).fetch();

          await UserSiteLinks.create({
            user_id: userData.id,
            usertype_id: 7, //Free
            expiry: new Date().toISOString()
          });

          //Google Analytics Call
          try {
            req.visitor.event("sign_up", "sign_up").send();
          } catch (e) {
            sails.hooks.bugsnag.notify(e);
          }

          await sails.helpers.mautic.createContact.with({
            email: userData.email,
            userId: userData.id,
            ipData: ipData
          })
            .catch((e) => {sails.log.error(e)});

          // LOG STORED CAMPAIGN INFO
          if (req.session.campaignId) {
            await UserOptions.create({user_id: userData.id, option_key: 'campaignId', option_value: req.session.campaignId})
          }
        }

        // Modify the active session instance.
        // (This will be persisted when the response is sent.)
        req.session.userId = userData.id;

        await sails.helpers.createPhpSession.with({
          userId: userData.id,
        })
          .then((phpSessionId) => {
            res.cookie('CPODSESSID', phpSessionId, {
              domain: '.chinesepod.com',
              expires: new Date(Date.now() + 365.25 * 24 * 60 * 60 * 1000)
            });
          });

        if (newAccount) {

          const currentDate = new Date();
          const geoip = require('geoip-country');
          const geo = geoip.lookup(req.ip);

          if (!geo || !geo.country){

            res.redirect('/pricing');

          } else if (sails.config.custom.coreMarkets.includes(geo.country) && !sails.config.custom.coreFreeMonths.includes(currentDate.getMonth())) {

            res.redirect('/pricing');

          } else if (!sails.config.custom.coreMarkets.includes(geo.country) && !sails.config.custom.nonCoreFreeMonths.includes(currentDate.getMonth())) {

            res.redirect('/pricing');

          } else {
            res.redirect('/level')
          }

        } else {
          res.redirect('/home')
        }


      }
    })(req, res, next);
  },

  googleAuth: function(req, res) {
    passport.authenticate('google', { scope: ['email', 'profile'] })(req, res);
  },

  googleCallback: function(req, res, next) {

    passport.authenticate('google', async function(err, user) {
      if(err) {

        // redirect to login page
        sails.log.error('google callback error: '+err);
        res.redirect('/login');

      } else {

        if (!user.email){
          // redirect to login page
          sails.log.error('google callback error: '+err);
          sails.hooks.bugsnag.notify(err);
          res.redirect('/login');
        }


        sails.log.info('google credentials');
        sails.log.info(user);

        let userData = await User.findOne({email: user.email.toLowerCase()});

        let newAccount = false;

        if (!userData) {
          newAccount = true;
          const ip = req.ip ? req.ip : false;
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
            http_referer: req.headers.referer ? req.headers.referer : '',
            code: user.id,
            confirm_status: 1
          }).fetch();

          await UserSiteLinks.create({
            user_id: userData.id,
            usertype_id: 7, //Free
            expiry: new Date().toISOString()
          });

          //Google Analytics Call
          try {
            req.visitor.event("sign_up", "sign_up").send();
          } catch (e) {
            sails.hooks.bugsnag.notify(e);
          }

          await sails.helpers.mautic.createContact.with({
            email: userData.email,
            userId: userData.id,
            ipData: ipData
          })
            .catch((e) => {sails.log.error(e)});

          // LOG STORED CAMPAIGN INFO
          if (req.session.campaignId) {
            await UserOptions.create({user_id: userData.id, option_key: 'campaignId', option_value: req.session.campaignId})
          }

        }

        // Modify the active session instance.
        // (This will be persisted when the response is sent.)
        req.session.userId = userData.id;

        await sails.helpers.createPhpSession.with({
          userId: userData.id,
        })
          .then((phpSessionId) => {
            res.cookie('CPODSESSID', phpSessionId, {
              domain: '.chinesepod.com',
              expires: new Date(Date.now() + 365.25 * 24 * 60 * 60 * 1000)
            });
          });

        if (newAccount) {
          const currentDate = new Date();
          const geoip = require('geoip-country');
          const geo = geoip.lookup(req.ip);

          if (!geo || !geo.country){

            res.redirect('/pricing');

          } else if (sails.config.custom.coreMarkets.includes(geo.country) && !sails.config.custom.coreFreeMonths.includes(currentDate.getMonth())) {

            res.redirect('/pricing');

          } else if (!sails.config.custom.coreMarkets.includes(geo.country) && !sails.config.custom.nonCoreFreeMonths.includes(currentDate.getMonth())) {

            res.redirect('/pricing');

          } else {
            res.redirect('/level')
          }

        } else {
          res.redirect('/home')
        }
      }
    })(req, res, next);
  },

};

