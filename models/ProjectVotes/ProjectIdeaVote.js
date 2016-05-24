var keystone = require('keystone');
var Types = keystone.Field.Types;

var ProjectIdeaVote = new keystone.List('ProjectIdeaVote');

ProjectIdeaVote.add({
  idea: {
    type: Types.Relationship,
    ref: 'ProjectIdea',
    index: true
  },
  user: {
    type: Types.Relationship,
    ref: 'User',
    index: true
  },
  createdAt: {
    type: Date,
    noedit: true,
    collapse: true,
    default: Date.now
  },
  changedAt: {
    type: Date,
    noedit: true,
    collapse: true
  }
});


ProjectIdeaVote.schema.pre('save', function(next) {
  if (!this.isModified('changedAt')) {
    this.changedAt = Date.now();
  }
  next();
});



ProjectIdeaVote.defaultColumns = 'title, description, state|20%';
ProjectIdeaVote.defaultSort = '-createdAt';
ProjectIdeaVote.register();
