var keystone = require('keystone'),
	async = require('async'),
	_ = require('underscore'),
	moment = require('moment'),
	crypto = require('crypto');

exports = module.exports = function(req, res) {

	var data = {
		event: {},
		active: false,
		rsvp: {}
	};

	async.series([
		function(next) {
			keystone.list('Event').model.findOne()
				.sort('-startDate')
				.populate('organization')
				.exec(function(err, event) {
					if (event) {
						data.event = event.toJSON();
						data.active = event.state == "active" ? true : false;
					}
					return next();
				});
		},
		function(next) {
			if (!req.body.user) return next();
			if (!data.event) return next();
			if (data.active == false) return next();
			keystone.list('RSVP').model.findOne()
				.where('who', data.user)
				.where('event', data.events.next)
				.exec(function(err, rsvp) {
					data.rsvp = rsvp;
					return next();
				});
		}
	], function(err) {
		var response = {
			success: true,
			config: {
				versions: {
					compatibility: process.env.APP_COMPATIBILITY_VERSION,
					production: process.env.APP_PRODUCTION_VERSION
				},
				killSwitch: false
			},
			event: {},
			rsvp: {
				responded: false,
				participating: false
			},
			user: false
		};

		var parseEvent = function(event, active) {

			var eventData = {
				id: event._id,
				active: active,
				title: event.title,
				organization: event.organization,
				featureImage: event.featureImage,

				starts: event.startDate,
				ends: event.endDate,
				registrationStartDate: event.registrationStartDate,
				registrationEndDate: event.registrationEndDate,

				place: event.place,
				map: event.map,

				description: keystone.utils.cropString(keystone.utils.htmlToText(event
					.description), 250, '...', true),

				spotsAvailable: event.spotsAvailable,
				spotsRemaining: event.spotsRemaining,

			};
			return eventData;
		};

		if (data.event) {
			response.event = parseEvent(data.event, data.active);
			if (data.user) {
				response.rsvp.responded = data.rsvp ? true : false;
				response.rsvp.participating = data.rsvp && data.rsvp.participating ?
					true :
					false;
				response.rsvp.date = data.rsvp ? data.rsvp.changedAt : false;
			}
		}
		res.apiResponse(response);
	});
};
