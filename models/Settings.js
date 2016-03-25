var bindLastModified = require('../lib/bindLastModified');
var keystone = require('keystone');
var modelToJSON = require('../lib/modelToJSON');
var Types = keystone.Field.Types;

var Settings = new keystone.List('Settings', {
  nocreate: true,
  nodelete: true
});

Settings.add({
  name: {
    type: String,
    noedit: true
  },


});

modelToJSON(Settings);

bindLastModified(Settings, 'settings');

Settings.defaultColumns = 'name';
Settings.register();
