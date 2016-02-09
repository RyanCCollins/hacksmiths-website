var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Categories Model
 * =====================
 */

var Role = new keystone.List('Role', {
    track: true,
    autokey: { from: 'title', path: 'key', unique: true },
    map: { name: 'title' }
});

Role.add({
    title: { type: String, required: true, initial: true },
    description: {type: Types.Markdown, height: 200},
    forProject: {type: Types.Relationship, ref: 'Project', many: true},
    team: {type: Types.Relationship, ref: 'Team', many: true}
});


/**
 * Relationships
 * =============
 */

Role.relationship({ref: 'Team', refPath: 'roles', path: 'team'});

/**
 * Registration
 * ============
 */
Role.defaultSort = 'title';
Role.defaultColumns = 'title';

Role.register();