// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone');
var secrets = require('./lib/auth/secrets');


// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({

	'name': 'Hacksmiths',
	'brand': 'Hacksmiths',

	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'jade',

	'emails': 'templates/emails',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User'

});

// Load your project's Models

keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	plural: keystone.utils.plural,
	editable: keystone.content.editable,
	moment: require('moment'),
	js: 'javascript:;'
});

// Load your project's Routes

keystone.set('routes', require('./routes'));

keystone.set('cloudinary config', secrets.cloudinary.uri);
keystone.set('mandrill api key', secrets.mandrill.API_KEY );
keystone.set('mandrill username', secrets.mandrill.username );

// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.

keystone.set('email locals', {
	utils: keystone.utils,
	logo_src: '/images/logo-email.gif',
	logo_width: 194,
	logo_height: 76,
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#2697de',
		buttons: {
			color: '#fff',
			background_color: '#2697de',
			border_color: '#1a7cb7'
		}
	}
});

// Setup replacement rules for emails, to automate the handling of differences
// between development a production.

// Be sure to update this rule to include your site's actual domain, and add
// other rules your email templates require.

keystone.set('email rules', [{
	find: '/images/',
	replace: (keystone.get('env') == 'production') ? 'http://hacksmiths.io/images/' : 'http://localhost:4000/images/'
}, {
	find: '/keystone/',
	replace: (keystone.get('env') == 'production') ? 'http://hacksmiths.io/keystone/' : 'http://localhost:4000/keystone/'
}]);

// Load your project's email test routes

keystone.set('email tests', require('./routes/emails'));

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
	'members': ['users', 'organizations', 'teams', 'roles', 'skills', 'nanodegrees'],
	'projects': ['projects', 'events', 'teams', 'schedules', 'rsvps', 'inquiries'],
	'stats': ['team-stats', 'project-stats'],
	'blog': ['posts', 'post-categories', 'post-comments'],
	'links': ['links', 'link-tags', 'link-comments'],
	'photo gallery': 'galleries',
});


// Start Keystone to connect to your database and initialise the web server


keystone.start();
