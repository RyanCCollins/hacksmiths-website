var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Categories Model
 * =====================
 */

var Project = new keystone.List('Project', {
    track: true,
    autokey: { from: 'title', path: 'key', unique: true },
    map: { name: 'title' }
});

Project.add({
    title: { type: String, required: true, initial: true, unique: true, note: 'Create a great project name.  Pick something unique!'},
    logo: { type: Types.CloudinaryImage, autoCleanup : true, select: true, publicID: 'slug'},
    organization: {type: Types.Relationship, ref: 'Organization', many: false, initial: true, note: 'The organization who this project is for.'},
    description: { type: Types.Markdown },
    teams: {type: Types.Relationship, ref: 'Team', many: true, required: true, initial: true},
    contributors: {type: Types.Relationship, ref: 'User', many: true, noedit: true},
    rolesNeeded: {type: Types.Relationship, ref: 'Role', many: true},
    location: Types.Location,
    spotlight: {type: Types.Boolean, default: false, note: 'Should we spotlight this project on the main page?'},
    events: {type: Types.Relationship, many: true, ref: 'Event', note: 'Are there any events associated with this project?'}
});

Project.relationship({path: 'events', ref: 'Event', refPath:'project'});
Project.relationship({path: 'contributors', ref: 'User', refPath: 'projectsContributedTo'});

Project.defaultColumns = 'title, group, leader';
Project.register();