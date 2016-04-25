var keystone = require('keystone'),
	moment = require('moment'),
	RSVP = keystone.list('RSVP');

var Event = keystone.list('Event');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'events';
	locals.page.title = 'events - Hacksmiths';

	view.query('upcomingEvent',
		Event.model.findOne()
		.where('state', 'active')
		.sort('-eventStartDate'), '');

	view.query('pastEvents',
		Event.model.find()
		.where('state', 'past')
		.sort('-eventStartDate'), '');

	view.on('render', function(next) {

		if (!req.user || !locals.upcomingEvent) return next();

		RSVP.model.findOne()
			.where('who', req.user._id)
			.where('event', locals.upcomingEvent)
			.exec(function(err, rsvp) {
				locals.rsvpStatus = {
					rsvped: rsvp ? true : false,
					participating: rsvp && rsvp.participating ? true : false
				};
				return next();
			});

	});

	view.render('site/events');

};
