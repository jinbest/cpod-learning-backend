'use strict';

var passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth20').Strategy;

//var verifyHandler = function(req, token, tokenSecret, profile, done) {
var verifyHandler = function (accessToken, refreshToken, profile, cb, done) {

  var data = {
    id: cb.id,
    name: cb.displayName,
    email: cb.emails[0].value,
    emailVerified: cb.emails[0].verified
  };

  return done(null, data);
};


passport.use(new GoogleStrategy({
  clientID: '953231851949-0q9671f603i8ra2h4626bkcmfe428a06.apps.googleusercontent.com',
  clientSecret: 'CVnFJ78VXxDcZ-ru_xFFHXMe',
  callbackURL: '/api/v1/auth/google/callback',
  passReqToCallback: true,
  proxy: true
}, verifyHandler));
