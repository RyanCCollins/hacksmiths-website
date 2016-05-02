var keystone = require('keystone');
var User = keystone.list('User');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	locals.title = 'Hacksmiths';


	locals.organizers = [{
		name: 'Ryan Collins',
		image: '/images/ryan.jpg',
		twitter: 'ryancollinsio',
		github: 'ryanccollins',
		title: 'Ryan built the Hacksmiths platform from the ground up.  He has nearly 8 years experience architecting large-scale web applications and data systems.  You can find him spending his free time contributing to open source projects and leading the Hacksmiths development team.'
	}, {
		name: 'Sean Craig',
		image: '/images/sean.jpg',
		twitter: 'swhc1066',
		title: 'Sean is a professional User Experience and Interface Designer with years of experience in the industry.  He runs the digital product design team here at the Hacksmiths project, donating his time to expertly crafting the projects the team works on.'
	}]

	// Render the view
	view.render('index');

};
