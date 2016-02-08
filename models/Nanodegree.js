var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Categories Model
 * =====================
 */

var Nanodegree = new keystone.List('Nanodegree', {
	track: true,
	autokey: { from: 'title', path: 'key', unique: true },
	map: { name: 'title' }
});

Nanodegree.add({
	title: { type: String, required: true, initial: true },
	logo: { type: Types.CloudinaryImage },
	description: {type: Types.Markdown, height: 200},
	link: {type: Types.Url },
});


/**
 * Relationships
 * =============
 */

Nanodegree.relationship({ ref: 'User', refPath: 'author', path: 'enrollments'});

/**
 * Registration
 * ============
 */
Nanodegree.defaultSort = 'title';
Nanodegree.defaultColumns = 'title';

Nanodegree.register();