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
  state: {
    type: Types.Select,
    options: 'draft, activated, deactivated',
    noedit: true
  },
  createdBy: { type: Types.Relationship, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

ProjectIdea.defaultColumns = 'title, description, state|20%'

ProjectIdea.register();
