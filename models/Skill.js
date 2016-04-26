var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Categories Model
 * =====================
 */

var Skill = new keystone.List('Skill', {
  track: true,
  autokey: {
    from: 'title',
    path: 'key',
    unique: true
  },
  map: {
    name: 'title'
  }
});

Skill.add({
  title: {
    type: String,
    required: true,
    initial: true,
    unique: true,
    note: 'What type of skill is it?  Frontend, Backend, etc.'
  },
  matchingRoles: {
    type: Types.Relationship,
    ref: 'Role'
  }
});

Skill.defaultColumns = 'title, group, leader';
Skill.register();
