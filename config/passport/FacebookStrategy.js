'use strict';

var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  request = require('request');


var verifyHandler = function(req, token, tokenSecret, profile, done) {

  process.nextTick(function() {
    var url = 'https://graph.facebook.com/v2.10/me?access_token=%s&fields=id,email,first_name,last_name';
    url = url.replace('%s', token);

    var options = {method: 'GET', url: url, json: true};
    request(options, function (err, response) {
      if (err) {
        return done(null, null);
      }

      var data = {
        id: response.body.id,
        first_name: response.body.first_name,
        last_name: response.body.last_name,
        email: response.body.email
      };

      return done(null, data);
    });
  });
};

passport.use(new FacebookStrategy({
  clientID: 1389215491247779,
  clientSecret: '5ee8495456123e50a3b56a0d65af3f7d',
  callbackURL: 'https://staging.chinesepod.com/api/v1/auth/facebook/callback',
  passReqToCallback: true,
  proxy: true
}, verifyHandler));
