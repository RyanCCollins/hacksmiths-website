var keystone = require('keystone');

var User = keystone.list('User');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'members';

	view.query('members', User.model.find().sort('name').where('isPublic', true).populate(
		'organization').where('mentoring.available', true), 'posts');

	view.render('site/mentors');
};
