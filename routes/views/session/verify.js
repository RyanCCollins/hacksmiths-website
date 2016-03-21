var keystone = require('keystone'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	view.on('init', function(next) {

		User.model.findOne().where('verifyPasswordKey', req.params.key).exec(function(err, user) {
			if (err) return next(err);
			if (!user) {
				req.flash('error', "Sorry, that verification key isn't valid.  Please try again, or email admin@hacksmiths.io if you have difficulties registering.");
				return res.redirect('/verify-email/resend');
			}
			locals.found = user;
			next();
		});

	});

	view.on('post', { action: 'verify-email' }, function(next) {

		if (!req.body.password || !req.body.password_confirm) {
			req.flash('error', "Please enter, and confirm your new password.");
			return next();
		}

		if (req.body.password != req.body.password_confirm) {
			req.flash('error', 'Please make sure both passwords match.');
			return next();
		}

		locals.found.password = req.body.password;
		locals.found.resetPasswordKey = '';
		locals.found.save(function(err) {
			if (err) return next(err);
			req.flash('success', 'Thanks for verifying your email and welcome to the site!');
			res.redirect('/me');
		});

	});

	view.render('session/verify');

}
