var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'about';
	locals.page.title = 'About Hacksmiths';

	locals.organisers = [{
		name: 'Ryan Collins',
		image: '/images/ryan.jpg',
		twitter: 'ryancollinsio',
		title: 'Udacity student extraordinaire.  Creator of Hacksmiths.'
	}]

	view.render('site/about');

}
