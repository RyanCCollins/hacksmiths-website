var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Organizations Model
 * ===================
 */

var Organization = new keystone.List('Organization', {
	track: true,
	autokey: { path: 'key', from: 'name', unique: true }
});

Organization.add({
	name: { type: String, index: true },
	logo: { type: Types.CloudinaryImage },
	website: Types.Url,
	isHiring: Boolean,
	description: { type: Types.Markdown },
	location: Types.Location
});


/**
 * Relationships
 * =============
 */

Organization.relationship({ ref: 'User', refPath: 'organization', path: 'members' });


// Pull out avatar image
Organization.schema.virtual('logoUrl').get(function() {
    if (this.logo.exists) return this._.logo.thumbnail(120,120);
});

/**
 * Registration
 * ============
 */

Organization.defaultColumns = 'name, website, isHiring';
Organization.register();
