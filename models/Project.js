var keystone = require('keystone');
var Types = keystone.Field.Types;
var GitHubApi = require("node-github");

/**
 * Post Categories Model
 * =====================
 */

var Project = new keystone.List('Project', {
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

Project.add({
  title: {
    type: String,
    required: true,
    initial: true,
    unique: true,
    note: 'Create a great project name.  Pick something unique!'
  },
  logo: {
    type: Types.CloudinaryImage,
    autoCleanup: true,
    select: true,
    publicID: 'slug'
  },
  organization: {
    type: Types.Relationship,
    ref: 'Organization',
    many: false,
    initial: true,
    note: 'The organization who this project is for.'
  },
  description: {
    type: Types.Markdown
  },
  teams: {
    type: Types.Relationship,
    ref: 'Team',
    many: true,
    required: true,
    initial: true,
    many: false
  },
  contributors: {
    type: Types.Relationship,
    ref: 'User',
    many: true,
    noedit: true
  },
  spotlight: {
    type: Types.Boolean,
    default: false,
    note: 'Should we spotlight this project on the main page?'
  },
  events: {
    type: Types.Relationship,
    many: true,
    ref: 'Event',
    note: 'Are there any events associated with this project?'
  }
});

Project.relationship({
  path: 'events',
  ref: 'Event',
  refPath: 'project'
});
Project.relationship({
  path: 'contributors',
  ref: 'User',
  refPath: 'projects'
});
Project.relationship({
  path: 'urls',
  ref: 'ProjectRepo',
  refPath: 'project'
})

// Pull out avatar image
Project.schema.virtual('logoUrl').get(function() {
  if (this.photo.exists) return this._.photo.thumbnail(120, 120);
});


Project.schema.methods.refreshStats = function(callback) {
  var project = this;
  keystone.list('ProjectStats').model.count()
    .where('project').in([project.id])
    .exec(function(err, count) {
      if (err) return callback(err);
      project.totalContributions = count;
      project.save(callback);
    });
};

Project.defaultColumns = 'title, description, url';
Project.register();
