var _ = require('underscore');
var async = require('async');
var keystone = require('keystone');
var passport = require('passport');
var passportGithubStrategy = require('passport-github').Strategy;
var request = require('request');
var secrets = require('./secrets');
var User = keystone.list('User');

var credentials = {
	clientID: secrets.github.clientID,
	clientSecret: secrets.github.clientSecret,
	callbackURL: secrets.github.callbackURL
};

exports.authenticateUser = function(req, res, next) {
	var self = this;

	var redirect = '/auth/confirm';
	if (req.cookies.target && req.cookies.target == 'app') redirect = '/auth/app';

	// Initalise GitHub credentials
	var githubStrategy = new passportGithubStrategy(credentials, function(
		accessToken, refreshToken, profile, done) {
		done(null, {
			accessToken: accessToken,
			refreshToken: refreshToken,
			profile: profile
		});
	});

	// Use the github passport auth strategy.
	passport.use(githubStrategy);
	if (_.has(req.query, 'cb')) {
		passport.authenticate('github', {
			session: false
		}, function(err, data, info) {
			if (err || !data) {
				return res.redirect('/signin');
			}

			var name = data.profile && data.profile.displayName ? data.profile.displayName
				.split(' ') : [];

			var auth = {
				type: 'github',
				name: {
					first: name.length ? name[0] : '',
					last: name.length > 1 ? name[1] : ''
				},
				website: data.profile._json.blog,
				profileId: data.profile.id,
				username: data.profile.username,
				avatar: data.profile._json.avatar_url,
				accessToken: data.accessToken,
				refreshToken: data.refreshToken
			}

			// Retrive email addresses from Github
			self.getEmails(auth.accessToken, function(err, email) {
				if (!err && email) auth.email = email;
				req.session.auth = auth;
				return res.redirect(redirect);
			});
		})(req, res, next);
	} else {

		passport.authenticate('github', {
			scope: ['user:email']
		})(req, res, next);

	}

};

exports.getEmails = function(accessToken, next) {

	request({
		url: 'https://api.github.com/user/emails?access_token=' + accessToken,
		headers: {
			'User-Agent': 'hacksmiths.io'
		}
	}, function(err, data) {

		if (err) {

			console.log(err);
			return next(err);

		} else {

			var emails = JSON.parse(data.body),
				primaryEmail = false;

			if (emails.length) {
				_.each(emails, function(e) {
					if (!e.primary) return;
					primaryEmail = e.email;
				});
			}
			return next(err, primaryEmail);
		}
	});
};
