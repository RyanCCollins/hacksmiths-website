var async = require('async'),
	keystone = require('keystone'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	locals = {
		userData: {}
	}

	User.model.findById(req.body.user).exec(function(err, user) {
		if (err || !user) return res.apiResponse({
			success: false
		});

		locals.userData = {
			profile: user,
		}
		console.log(user);
		return res.apiResponse({
			success: true,
			session: true,
			date: new Date().getTime(),
			profile: locals.userData.profile
		});
	});

}
