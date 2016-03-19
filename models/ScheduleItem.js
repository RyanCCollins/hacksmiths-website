var _ = require('underscore');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Talks Model
 * ===========
 */

var ScheduleItem = new keystone.List('ScheduleItem', {
	map: {
		name: 'title'
	},
	track: true,
	sortable: true,
	sortContext: 'Event:scheduleItems'
});

ScheduleItem.add({
	title: {
		type: String,
		required: true,
		initial: true
	},
	event: {
		type: Types.Relationship,
		ref: 'Event',
		required: true,
		initial: true,
		index: true
	},
	startDate: {
		type: Types.Datetime,
		required: true,
		initial: true,
		index: true,
		width: 'short',
		note: 'e.g. 2014-07-15 / 6:00pm'
	},
	endDate: {
		type: Types.Datetime,
		required: true,
		initial: true,
		index: true,
		width: 'short',
		note: 'e.g. 2014-07-15 / 6:00pm'
	},
	description: {
		type: Types.Html,
		wysiwyg: true
	},
	who: {
		type: Types.Relationship,
		ref: 'User',
		index: true
	}
});

ScheduleItem.schema.set('toJSON', {
	virtuals: true,
	transform: function(doc, rtn, options) {
		rtn = _.pick(rtn, '_id', 'title', 'schedule', 'startDate', 'endDate',
			'description');
		if (doc.who) {
			rtn.who = doc.who.map(function(i) {
				return {
					title: i.title,
					event: i.event,
					startDate: i.startDate,
					description: i.description
				};
			});
		}
		return rtn;
	}
});

/**
 * Registration
 * ============
 */

ScheduleItem.defaultColumns = 'name, event|20%, who|20%';
ScheduleItem.register();
