var _ = require('underscore');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Talks Model
 * ===========
 */

var ScheduleItem = new keystone.List('ScheduleItem', {
	track: true,
	sortable: true,
	sortContext: 'Event:scheduleItems'
});

ScheduleItem.add({
	name: { type: String, required: true, initial: true },
	event: { type: Types.Relationship, ref: 'Event', required: true, initial: true, index: true },
	who: { type: Types.Relationship, ref: 'User', many: true, index: true },
	description: { type: Types.Html, wysiwyg: true },
	slides: { type: Types.Url },
	link: { type: Types.Url }
});

ScheduleItem.schema.set('toJSON', {
	virtuals: true,
	transform: function(doc, rtn, options) {
		rtn = _.pick(rtn, '_id', 'name', 'place', 'map', 'description', 'slides', 'link');
		if (doc.who) {
			rtn.who = doc.who.map(function(i) {
				return {
					name: i.name,
					twitter: i.twitter,
					avatarUrl: i.avatarUrl
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
