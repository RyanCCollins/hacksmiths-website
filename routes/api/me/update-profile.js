var async = require('async'),
	keystone = require('keystone'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	locals = {
		user: {}
	}

	User.findByID(req.body.user).exec(function(err, results))

	if (err) return;

	if (!user) return;:
	for (var key in req.body.user) {
		user[key] = req.body.user[key]
	}

	person.save(function() {

	});
}
