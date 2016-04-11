var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Categories Model
 * =====================
 */

var ProjectRepoStats = new keystone.List('ProjectRepoStats', {
  nocreate: true,
  noedit: true
});

ProjectRepoStats.add({
  project: {
    type: Types.Relationship,
    many: false,
    ref: 'Project'
  },
});

ProjectRepoStats.relationship({
  path: 'project',
  ref: 'Project',
  refPath: 'stats'
});


ProjectRepoStats.defaultColumns = 'project';
ProjectRepoStats.register();
