var keystone = require('keystone'),
	moment = require('moment');

var User = keystone.list('User');
var RSVP = keystone.list('RSVP');
var Event = keystone.list('Event');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'members';
	locals.moment = moment;


	// Load the Member
	view.on('init', function(next) {
		User.model.findOne()
		.where('key', req.params.member)
		.populate('projects')
		.exec(function(err, member) {
			if (err) return res.err(err);
			if (!member) {
				req.flash('info', 'Sorry, we couldn\'t find a matching member');
				return res.redirect('/members');
			}
			locals.member = member;
			next();
		});
	});


	view.on('init', function(next) {
		RSVP.model.find()
			.where('who', locals.member.id)
			.exec(function(error, rsvps) {
				if (error) return res.err(err);
				locals.rsvps = rsvps;
				next();
		});
	});

	view.on('init', function(next){
		Event.model.find()
			.where('id').in(locals.rsvps)
			.exec(function(error, results) {
				locals.events = results;
				next();
			});
	});

	// Set the page title and populate related documents

	view.on('render', function(next) {
		if (locals.member) {
			locals.page.title = locals.member.name.full + ' - Hacksmiths';
			locals.member.populateRelated('posts projects', next);
		}
	});

	view.render('site/member');

};
