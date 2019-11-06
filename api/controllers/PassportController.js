/**
 * PassportController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var passport = require('passport');

module.exports = {
  facebookAuth: function(req, res, next) {
    passport.authenticate('facebook', { scope: ['email']})(req, res, next);
  },

  facebookCallback: function(req, res, next) {
    passport.authenticate('facebook', function(err, user) {

      console.log('facebook credentials');
      console.log(user);
      res.json(user);
    })(req, res, next);
  },

  googleAuth: function(req, res) {
    passport.authenticate('google', { scope: ['email', 'profile'] })(req, res);
  },

  googleCallback: function(req, res, next) {
    passport.authenticate('google', function(err, user) {
      if(err) {
        // redirect to login page
        console.log('google callback error: '+err);
      } else {
        console.log('google credentials');
        console.log(user);
        res.json(user);
      }
    })(req, res, next);
  },

};

