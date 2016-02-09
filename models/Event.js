var _ = require('underscore');
var keystone = require('keystone');
var moment = require('moment');
var Types = keystone.Field.Types;

/**
 * Events Model
 * =============
 */

var Event = new keystone.List('Event', {
	track: true,
	autokey: { path: 'key', from: 'title', unique: true }
});

Event.add({
	title: { type: String, required: true, initial: true },
	organization: { type: Types.Relationship, ref: 'Organization', many: false, initial: true, required: true, note: 'Enter the name of the organization who we are sponsoring. Supports HTML.' },
	description: { type: Types.Html, wysiwyg: true, initial: true, required: true, note: 'A brief description about what this event is.' },
	marketingInfo: { type: Types.Html, wysiwyg: true, initial: false, required: false, note: 'Enter some information that you would like to put out there to market this event.  Supports HTML.'},

	sponsors: {type: Types.Relationship, ref: 'Organization', many: true},
	teams: {type: Types.Relationship, ref: 'Team', many: true},

	regitrationStartDate: { type: Types.Datetime, required: true, initial: true, index: true, width: 'short', note: 'e.g. 2014-07-15 / 6:00pm' },
	regirstionEndDate: { type: Types.Datetime, required: true, initial: true, index: true, width: 'short', note: 'e.g. 2014-07-15 / 9:00pm' },

	eventStartDate: {type: Types.Datetime, required: true, initial: true, index: true, width: 'short', note: 'e.g. 2014-07-15 / 6:00pm'},
	eventEndDate: {type: Types.Datetime, required: true, initial: true, index: true, width: 'short', note: 'e.g. 2014-07-15 / 6:00pm'},

	place: { type: String, required: false, initial: true, width: 'medium', default: '', note: 'Post a location, if there is a live event.' },
	map: { type: String, required: false, initial: true, width: 'medium', default: '', note: 'Post a geocode location, or a url.' },

	maxRSVPs: { type: Number, default: 20 },
	totalRSVPs: { type: Number, noedit: true },

	state: { type: Types.Select, options: 'draft, scheduled, active, past', noedit: true },
	publishedDate: { type: Types.Date, index: true },
});




// Relationships
// ------------------------------

Event.relationship({ ref: 'RSVP', refPath: 'event', path: 'rsvps' });
Event.relationship({ ref: 'Schedule', refPath: 'event', path: 'schedule' });
Event.relationship({ ref: 'Project', refPath: 'event', path: 'project'});


// Virtuals
// ------------------------------

Event.schema.virtual('url').get(function() {
	return '/events/' + this.key;
});

Event.schema.virtual('remainingRSVPs').get(function() {
	if (!this.maxRSVPs) return -1;
	return Math.max(this.maxRSVPs - (this.totalRSVPs || 0), 0);
});

Event.schema.virtual('rsvpsAvailable').get(function() {
	return (this.remainingRSVPs > 0);
});




// Pre Save
// ------------------------------

Event.schema.pre('save', function(next) {
	var event = this;
	// no published date, it's a draft event
	if (!event.publishedDate) {
		event.state = 'draft';
	}
	// event date plus one day is after today, it's a past event
	else if (moment().isAfter(moment(event.eventStartDate).add('day', 1))) {
		event.state = 'past';
	}
	// publish date is after today, it's an active event
	else if (moment().isAfter(event.publishedDate)) {
		event.state = 'active';
	}
	// publish date is before today, it's a scheduled event
	else if (moment().isBefore(moment(event.publishedDate))) {
		event.state = 'scheduled';
	}
	next();
});




// Methods
// ------------------------------

Event.schema.methods.refreshRSVPs = function(callback) {
	var event = this;
	keystone.list('RSVP').model.count()
		.where('event').in([event.id])
		.where('attending', true)
		.exec(function(err, count) {
			if (err) return callback(err);
			event.totalRSVPs = count;
			event.save(callback);
		});
};

Event.schema.methods.notifyAttendees = function(req, res, next) {
	var event = this;
	keystone.list('User').model.find().where('notifications.events', true).exec(function(err, attendees) {
		if (err) return next(err);
		if (!attendees.length) {
			next();
		} else {
			attendees.forEach(function(attendee) {
				new keystone.Email('new-event').send({
					attendee: attendee,
					event: event,
					subject: 'New event: ' + event.name,
					to: attendee.email,
					from: {
						name: 'hacksmiths',
						email: 'event@hacksmiths.com'
					}
				}, next);
			});
		}
	});
};

Event.schema.set('toJSON', {
	transform: function(doc, rtn, options) {
		return _.pick(doc, '_id', 'name', 'eventStartDate', 'eventEndDate', 'place', 'map', 'description', 'rsvpsAvailable', 'remainingRSVPs');
	}
});


/**
 * Registration
 * ============
 */

Event.defaultSort = '-startDate';
Event.defaultColumns = 'name, state|10%, startDate|15%, publishedDate|15%';
Event.register();
