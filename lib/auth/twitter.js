var _ = require('underscore');
var async = require('async');
var keystone = require('keystone');
var passport = require('passport');
var secrets = require('./secrets');
var passportTwitterStrategy = require('passport-twitter').Strategy;
var User = keystone.list('User');

var credentials = {
  consumerKey: secrets.twitter.clientID,
  consumerSecret: secrets.twitter.clientSecret,
  callbackURL: secrets.callbackURL
};

exports.authenticateUser = function(req, res, next) {
  var self = this;

  var redirect = '/auth/confirm';
  if (req.cookies.target && req.cookies.target == 'app') redirect =
    '/auth/app';

  // Init the twitter strategy for passport
  var twitterStrategy = new passportTwitterStrategy(credentials, function(
    accessToken, refreshToken, profile, done) {
    done(null, {
      accessToken: accessToken,
      refreshToken: refreshToken,
      profile: profile
    });
  });

  // Pass off the auth to passport
  passport.use(twitterStrategy);

  // Save user's data from Twitter.
  if (_.has(req.query, 'cb')) {
    passport.authenticate('twitter', {
      session: false
    }, function(err, data, info) {

      if (err || !data) {
        console.log(
          "[services.twitter] - Error retrieving Twitter account data - " +
          JSON.stringify(err));
        return res.redirect('/signin');
      }

      var name = data.profile && data.profile.displayName ? data.profile.displayName
        .split(' ') : [],
        profileJSON = JSON.parse(data.profile._raw),
        urls = profileJSON.entities.url && profileJSON.entities.url.urls &&
        profileJSON.entities.url.urls.length ? profileJSON.entities.url.urls : [];

      var auth = {
        type: 'twitter',
        name: {
          first: name.length ? name[0] : '',
          last: name.length > 1 ? name[1] : ''
        },
        website: urls.length ? urls[0].expanded_url : '',
        profileId: data.profile.id,
        username: data.profile.username,
        avatar: data.profile._json.profile_image_url.replace('_normal',
          ''),
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      }

      req.session.auth = auth;

      return res.redirect(redirect);

    })(req, res, next);


  } else {
    // Authenticate with twitter if no errors.
    passport.authenticate('twitter')(req, res, next);
  }
};
