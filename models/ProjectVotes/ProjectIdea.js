var keystone = require('keystone');
var Types = keystone.Field.Types;

var ProjectIdea = new keystone.List('ProjectIdea', {
  map: { name: 'title' },
  defaultSort: '-createdAt'
});

ProjectIdea.add({
  event: {
    type: Types.Relationship,
    ref: 'Event',
    required: true,
    initial: true,
    index: true
  },
  title: { type: String, required: true},
  description: { type: Types.Markdown, wysiwyg: true, height: 400 },
  additionalInformation: { type: String },
  state: {
    type: Types.Select,
    options: 'draft, activated, deactivated',
    noedit: true
  },
  totalVotes: {
    type: Number,
    noedit: true
  },
  createdBy: { type: Types.Relationship, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

ProjectIdea.schema.methods.countVotes = function(callback) {
  var idea = this;
  var getVotes = keystone.list('ProjectIdeaVote').model.count()
    .where('idea')
    .exec(function(err, count) {
      if (err) return callback(err)
      idea.totalVotes = count;
      idea.save(callback);
    });
};

ProjectIdea.defaultColumns = 'title, description, state|20%'

ProjectIdea.register();
