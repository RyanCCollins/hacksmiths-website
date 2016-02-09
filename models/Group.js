var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Categories Model
 * =====================
 */

var Group = new keystone.List('Group', {
    track: true,
    autokey: { from: 'title', path: 'key', unique: true },
    map: { name: 'title' }
});

Group.add({
    title: { type: String, required: true, initial: true },
    nanodegree: {type: Types.Relationship, ref: 'Nanodegree', many: false, initial: true, required: true},
    logo: { type: Types.CloudinaryImage },
    description: {type: Types.Markdown, height: 200},
    link: {type: Types.Url },
});


/**
 * Relationships
 * =============
 */

Group.relationship({ ref: 'User', refPath: 'author', path: 'enrollments'});

/**
 * Registration
 * ============
 */
Group.defaultSort = 'title';
Group.defaultColumns = 'title';

Group.register();