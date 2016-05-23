var keystone = require('keystone');
var Types = keystone.Field.Types;

var SiteWideAlert = new keystone.List('SiteWideAlert', {
  map: {
    name: 'title'
  },
  track: true,
  autokey: {
    path: 'slug',
    from: 'title',
    unique: true
  }
});

SiteWideAlert.add({
  title: {
    type: String,
    required: true,
    initial: true
  },
  message: {
    type: Types.Html,
    wysiwyg: true,
    height: 150,
    initial: true
  },
  state: {
    type: Types.Select,
    options: 'draft, published, archived',
    default: 'draft',
    index: true,
    note: "When published, this will be posted to the entire site."
  },
  author: {
    type: Types.Relationship,
    ref: 'User',
    index: true
  },
  publishedDate: {
    type: Types.Date,
    index: true
  }
});

SiteWideAlert.schema.methods.notification = function(req, res, next) {
  
}

SiteWideAlert.defaultSort = '-publishedDate';
SiteWideAlert.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
SiteWideAlert.register();
