var keystone = require('keystone');
var Inquiry = keystone.list('Inquiry');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'contact';
	locals.inquiryTypes = Inquiry.fields.inquiryType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.inquirySubmitted = false;

	// On POST requests, add the Inquiry item to the database
	view.on('post', { action: 'contact' }, function(next) {

		var newInquiry = new Inquiry.model(),
			updater = newInquiry.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, phone, inquiryType, message',
			errorMessage: 'There was a problem submitting your inquiry:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.inquirySubmitted = true;
			}
			next();
		});

	});

	view.render('contact');

};
