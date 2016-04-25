var keystone = require('keystone'),
	RSVP = keystone.list('RSVP');

exports = module.exports = function(req, res) {

	RSVP.model.findOne()
		.where('who', req.user._id)
		.where('event', req.body.data.event)
		.exec(function(err, rsvp) {
			if (err || !user) return res.apiResponse({
				success: false
			});

			if (rsvp) {
				rsvp.set({
					participating: req.body.data.participating
				}).save(function(err) {
					if (err) return res.apiResponse({
						success: false,
						err: err
					});
					return res.apiResponse({
						success: true,
						participating: req.body.data.participating
					});
				});

			} else {

				new RSVP.model({
					event: req.body.data.event,
					who: req.user,
					participating: req.body.data.participating
				}).save(function(err) {
					if (err) return res.apiResponse({
						success: false,
						err: err
					});
					return res.apiResponse({
						success: true
					});
				});
			}
		});
}
