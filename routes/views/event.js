var keystone = require('keystone'),
	moment = require('moment'),
	Event = keystone.list('Event'),
	RSVP = keystone.list('RSVP');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'events';
	locals.page.title = 'Events - Hacksmiths';

	locals.rsvpStatus = {};


	// LOAD the Meetup

	view.on('init', function(next) {
		Event.model.findOne()
			.where('key', req.params.event)
			.exec(function(err, event) {

				if (err) return res.err(err);
				if (!event) return res.notfound('Event not found');

				locals.event = event;
				locals.event.populateRelated('scheduleItems[who] rsvps[who]', next);

			});
	});


	// LOAD an RSVP

	view.on('init', function(next) {

		if (!req.user || !locals.event) return next();

		RSVP.model.findOne()
			.where('who', req.user._id)
			.where('event', locals.event)
			.exec(function(err, rsvp) {
				locals.rsvpStatus = {
					rsvped: rsvp ? true : false,
					attending: rsvp && rsvp.attending ? true : false
				};
				return next();
			});

	});


	view.render('site/event');

};
