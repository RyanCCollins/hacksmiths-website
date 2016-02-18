var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Categories Model
 * =====================
 */

var LeaderBoard = new keystone.List('LeaderBoard', {
    nocreate: true,
    noedit: true
});

LeaderBoard.add({
    person: {type: Types.Relationship, ref: 'User', many: false },
    team: {type: Types.Relationship, ref: 'Team', many: false},
    project: {type: Types.Relationship, ref: 'Project', many: false},
    event: {type: Types.Relationship, ref: 'Event', many: false},
    rank: {type: Number },
    createdAt: { type: Date, noedit: true, collapse: true, default: Date.now },
    changedAt: { type: Date, noedit: true, collapse: true }
});

/**
 * Hooks
 * =====
 */

LeaderBoard.schema.pre('save', function(next) {
    if (!this.isModified('changedAt')) {
        this.changedAt = Date.now();
    }
    next();
});

LeaderBoard.schema.post('save', function() {
    keystone.list('Event').model.findById(this.event, function(err, event) {
        if (event) event.refreshRSVPs();
    });
});

LeaderBoard.schema.post('remove', function() {
    keystone.list('Event').model.findById(this.event, function(err, event) {
        if (event) event.refreshRSVPs();
    });
});




LeaderBoard.defaultColumns = '';
LeaderBoard.register();