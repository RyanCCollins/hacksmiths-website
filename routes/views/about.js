var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'about';
	locals.page.title = 'About uHub';
	
	locals.organisers = [
		{ name: 'Ryan Collins', image: '/images/ryan.jpg', twitter: 'tech_rapport',       title: 'Udacity student extraordinaire.  Creator of uhub.' }
	]
	
	view.render('site/about');
	
}
