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

			if (req.body.statusOnly) {
				console.log("==========statusOnly=============")

				return res.apiResponse({
					success: true,
					rsvped: rsvp ? true : false,
					attending: rsvp && rsvp.attending ? true : false
				});

			} else {

				if (rsvp) {
					console.log("==========rsvp=============");
					console.log("req.body.attending", req.body);
					rsvp.set({
						attending: req.body.data.attending
					}).save(function(err) {
						if (err) return res.apiResponse({
							success: false,
							err: err
						});
						return res.apiResponse({
							success: true,
							attending: req.body.data.attending
						});
					});

				} else {
					console.log("==========saving to rsvp model=============");
					new RSVP.model({
						event: req.body.data.event,
						who: req.user,
						attending: req.body.data.attending
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

			}

		});

}
