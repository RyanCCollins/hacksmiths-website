var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Categories Model
 * =====================
 */

var ProjectStats = new keystone.List('ProjectStats', {
    nocreate: true,
    noedit: true
});

ProjectStats.add({
    project: {type: Types.Relationship, many: false, ref: 'Project'},
    totalCommits: {type: Number},
    topContributors: {type: Types.Relationship, ref: 'User', many: true}
});

ProjectStats.relationship({path: 'project', ref: 'Project', refPath:'stats'});

ProjectStats.defaultColumns = '';
ProjectStats.register();