var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'privacy';
	locals.page.title = 'Hacksmiths Privacy Policy';

	view.render('site/privacy');

};