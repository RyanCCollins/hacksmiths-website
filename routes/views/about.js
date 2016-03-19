var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'about';
	locals.page.title = 'About Hacksmiths';

	locals.organizers = [{
		name: 'Ryan Collins',
		image: '/images/ryan.jpg',
		twitter: 'ryancollinsio',
		title: 'Udacity student extraordinaire.  Creator of Hacksmiths.'
	}, {
		name: 'Sean Craig',
		image: '/images/sean.jpg'
		twitter: 'swhc1066'
		title: 'UI / UX Designer.'
	}]

	view.render('site/about');

}
