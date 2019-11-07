/**
 * PassportController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var passport = require('passport');

var ipdata = require('ipdata');

module.exports = {
  facebookAuth: function(req, res, next) {
    passport.authenticate('facebook', { scope: ['email']})(req, res, next);
  },

  facebookCallback: function(req, res, next) {
    passport.authenticate('facebook', async function(err, user) {

      if(err) {

        // redirect to login page
        sails.log.error('facebook callback error: '+err);
        res.redirect('/login');

      } else {

        sails.log.info('facebook credentials');
        sails.log.info(user);

        let userData = await User.findOne({email: user.email.toLowerCase()});

        if (!userData) {
          const ip = req.ip ? req.ip : false;
          let ipData = {};

          if(ip && ip !== '::1') {
            await ipdata.lookup(req.ip, sails.config.custom.ipDataKey)
              .then((info) => {
                ipData = info;
              })
              .catch((err) => {
                sails.log.error(err);
              });
          }

          user.name = user.first_name + ' ' + user.last_name

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

          await UserSiteLinks.create(_.extend({
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

        res.redirect('/dash')


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

        sails.log.info('google credentials');
        sails.log.info(user);

        let userData = await User.findOne({email: user.email.toLowerCase()});

        if (!userData) {
          const ip = req.ip ? req.ip : false;
          let ipData = {};

          if(ip && ip !== '::1') {
            await ipdata.lookup(req.ip, sails.config.custom.ipDataKey)
              .then((info) => {
                ipData = info;
              })
              .catch((err) => {
                sails.log.error(err);
              });
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

          await UserSiteLinks.create(_.extend({
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

        res.redirect('/dash')

      }
    })(req, res, next);
  },

};

