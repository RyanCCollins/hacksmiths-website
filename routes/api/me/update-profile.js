var async = require('async'),
	keystone = require('keystone'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	locals = {
		user: {}
	}

	User.model.findById(req.body.user.id).exec(function(err, person) {
		if (err || !person) return res.apiResponse({
			success: false
		});

		console.log('Updating the user profile');


		for (var key in req.body.user) {
			if (key != "id") {
				person[key] = req.body.user[key];
			}
		}

		person.save(function(err) {
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
