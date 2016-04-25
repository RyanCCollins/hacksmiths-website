var _ = require('underscore');
var async = require('async');
var keystone = require('keystone');
var Event = keystone.list('Event');
var RSVP = keystone.list('RSVP');

exports = module.exports = function(req, res) {
	var eventId = req.params.id;
	var returnValues = {
		event: {},
		attendees: []
	}

	async.series([
		function(next) {
			Event.model.findById(eventId, function(err, event) {
				if (err) {
					console.log('There was an error finding the event: ', err)
				}
				returnValues.event = event;
				return next();
			});
		},
		function(next) {
			if (!returnValues.event) return next();
			RSVP.model.find()
				.where('event', returnValues.event.id)
				.where('attending', true)
				.exec(function(err, results) {
					if (err) {
						console.log('Error loading attendees.', err);
					}
					if (results) {
						returnValues.attendees = _.compact(results.map(function(rsvp) {
							if (!rsvp.who) return;
							return {
								id: rsvp.who._id,
								url: rsvp.who.isPublic ? rsvp.who.url : false,
								photo: rsvp.who.photo.exists ?
									rsvp.who._.photo.thumbnail(80, 80) : rsvp.who.avatarUrl ||
									'/images/avatar.png',
								name: rsvp.who.name
							};
						}));
					}
					return next();
				});
		},
	], function(err) {
		if (err) {
			returnValues.err = err;
		}
		res.json(returnValues);
	});
};
