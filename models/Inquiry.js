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
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	phone: { type: String },
	inquiryType: { type: Types.Select, options: [
		{ value: 'message', label: 'Just leaving a message' },
		{ value: 'question', label: 'I\'ve got a question' },
		{ value: 'other', label: 'Something else...' }
	] },
	message: { type: Types.Markdown, required: true },
	createdAt: { type: Date, default: Date.now }
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

	var enquiry = this;

	keystone.list('User').model.find().where('isAdmin', true).exec(function(err, admins) {

		if (err) return callback(err);

		new keystone.Email('enquiry-notification').send({
			to: admins,
			from: {
				name: 'Hacksmiths',
				email: 'contact@hacksmiths.com'
			},
			subject: 'New Inquiry for Hacksmiths',
			enquiry: enquiry
		}, callback);

	});

};

Inquiry.defaultSort = '-createdAt';
Inquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Inquiry.register();
