var _ = require('underscore');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Schedule Model
 * ===========
 */

var Schedule = new keystone.List('Schedule', {
    track: true,
    sortable: true,
    sortContext: 'Event:schedule'
});

Schedule.add({
    event: { type: Types.Relationship, ref: 'Event', required: true, initial: true, index: true },
    items: {type: Types.Relationship, ref: 'ScheduleItem', many: true},
    team: { type: Types.Relationship, ref: 'Team', many: true, index: true },
    who: { type: Types.Relationship, ref: 'User', index: true }
});

Schedule.schema.set('toJSON', {
    virtuals: true,
    transform: function(doc, rtn, options) {
        rtn = _.pick(rtn, '_id', 'event', 'items', 'team');
        if (doc.who) {
            rtn.who = doc.who.map(function(i) {
                return {
                    event: i.event,
                    items: i.items,
                    team: i.team
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

Schedule.defaultColumns = 'name, event|20%, team|20%';
Schedule.register();
