var async = require('async'),
	moment = require('moment'),
	keystone = require('keystone');

var Event = keystone.list('Event'),
	RSVP = keystone.list('RSVP'),
	User = keystone.list('User'),
	Post = keystone.list('Post');

exports = module.exports = function(req, res) {

	var stats = {};

	async.parallel([

		function(next) {

			Event.model.findOne()
				.where('startDate').gte(moment().startOf('day').toDate())
				.where('state', 'published')
				.sort('startDate')
				.exec(function(err, event) {

					RSVP.model.count({
						event: event,
						attending: true
					})
					.exec(function(err, count) {
						stats.rsvps = count;
						return next();
					});

				});

		},

		function(next) {

			User.model.count()
				.exec(function(err, count) {
					stats.members = count;
					return next();
				});

		},

		function(next) {

			Post.model.count()
				.exec(function(err, count) {
					stats.posts = count;
					return next();
				});

		}

	], function(err) {

		return res.apiResponse(stats);

	});

};
