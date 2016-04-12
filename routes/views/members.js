var keystone = require('keystone'),
	_ = require('underscore');

var User = keystone.list('User');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'members';
	locals.page.title = 'Members - Hacksmiths';


	// Load Team Leaders
	view.on('init', function(next) {
		User.model.find()
			.sort('name.first')
			.where('isPublic', true)
			.where('isLeader', true)
			.exec(function(err, leaders) {
				if (err) res.err(err);
				locals.leaders = leaders;
				next();
			});
	});


	// Load Leaderboard

	view.on('init', function(next) {
		User.model.find()
			.sort('-rank name.first')
			.where('istopContributor', true)
			.exec(function(err, contributors) {
				if (err) res.err(err);
				locals.topContributors = contributors;
				next();
			});
	});


	// Pluck IDs for filtering Community

	view.on('init', function(next) {
		locals.leaderIDs = _.pluck(locals.leaders, 'id');
		locals.topContributorsIDs = _.pluck(locals.topContributors, 'id');
		console.log('Leader IDs: ' + locals.leaderIDs);
		next();
	});


	// Load Community

	view.on('init', function(next) {
		User.model.find()
			.sort('-lastRSVP')
			.where('isPublic', true)
			.where('_id').nin(locals.leaderIDs)
			.where('_id').nin(locals.topContributorsIDs)
			.exec(function(err, community) {
				if (err) res.err(err);
				console.log(community);
				locals.community = community;
				next();
			});
	});


	view.render('site/members');
};
