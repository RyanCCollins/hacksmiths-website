var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Categories Model
 * =====================
 */

var Skill = new keystone.List('Skill', {
    track: true,
    autokey: { from: 'title', path: 'key', unique: true },
    map: { name: 'title' }
});

Skill.add({
    title: { type: String, required: true, initial: true, unique: true, note: 'Create a cool team name.  Pick something unique to you!'},
    matchingRoles: {type: Types.Relationship, ref: 'Role'}
});

Skill.relationship({ ref: 'User', refPath: 'members', path: 'members'});

Skill.defaultColumns = 'title, group, leader';
Skill.register();