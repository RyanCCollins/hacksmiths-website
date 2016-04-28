var async = require('async'),
	keystone = require('keystone'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	locals = {
		user: {}
	}

	User.findById(req.body.user).exec(function(err, person) {
		if (err || !person) return res.apiResponse({
			success: false
		});

		console.log('Updating the user profile');

		for (var key in req.body.user) {
			person[key] = req.body.user[key];
		}

		user.save(function(err) {
			if (err) return res.apiResponse({
				success: false
			});

			console.log('Saving the user profile');
			return res.apiResponse({
				success: true
			});
		});
	});
}
