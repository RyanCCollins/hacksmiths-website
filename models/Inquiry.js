var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Inquiry Model
 * =============
 */

var Inquiry = new keystone.List('Inquiry', {
	nocreate: true,
	noedit: true
});

Inquiry.add({
	name: {
		type: Types.Name,
		required: true
	},
	email: {
		type: Types.Email,
		required: true
	},
	organization: {
		type: String
	},
	phone: {
		type: String
	},
	inquiryType: {
		type: Types.Select,
		options: [{
			value: 'join',
			label: 'I would like to join your cause!'
		}, {
			value: 'services',
			label: 'I have a project idea for you.'
		}, {
			value: 'message',
			label: 'I have a message for you.'
		}, {
			value: 'sponsor',
			label: 'I would like to sponsor your events.'
		}, {
			value: 'other',
			label: 'Something else...'
		}]
	},
	message: {
		type: Types.Markdown,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

Inquiry.schema.pre('save', function(next) {
	this.wasNew = this.isNew;
	next();
});

Inquiry.schema.post('save', function() {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Inquiry.schema.methods.sendNotificationEmail = function(callback) {

	if ('function' !== typeof callback) {
		callback = function() {};
	}

	var inquiry = this;

	keystone.list('User').model.find().where('isAdmin', true).exec(function(err,
		admins) {

		if (err) return callback(err);

		new keystone.Email('inquiry-notification').send({
			to: admins,
			from: {
				name: 'Hacksmiths',
				email: 'admin@hacksmiths.io'
			},
			subject: 'New Inquiry for Hacksmiths',
			inquiry: inquiry
		}, callback);

	});

};

Inquiry.defaultSort = '-createdAt';
Inquiry.defaultColumns = 'name, email, inquiryType, createdAt';
Inquiry.register();
