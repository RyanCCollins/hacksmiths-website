var async = require('async'),
  keystone = require('keystone'),
  ProjectIdeaVote = keystone.list('ProjectIdeaVote'),
  ProjectIdea = keystone.list('ProjectIdea'),
  User = keystone.list('User');

exports = module.exports = function(req, res) {

  User.model.findById(req.body.user).exec(function(err, user) {
    if (err || !user) return res.apiResponse({ success: false });

    ProjectIdeaVote.findOne()
      .where('createdBy', user)
      .where('idea', req.body.idea)
      .exec(function(err, vote) {
        if (vote) {
          if (req.body.for) {

          }
        } else {

        }
      })

  });


  User.model.findById(req.body.user).exec(function(err, user) {
    if (err || !user) return res.apiResponse({ success: false });
    ProjectIdea.findOne()
      .where('author', user)
      .where('event', req.body.event)
      .exec(function(err, idea) {
        if (idea) {
          if (req.body.cancel == 'true') {

          }
        } else {

        }
      })
    RSVP.model.findOne()
      .where('who', user)
      .where('event', req.body.event)
      .exec(function(err, rsvp) {

        if (rsvp) {

          if (req.body.participating == 'false' && req.body.cancel == 'true') {
            console.log('[api.app.rsvp] - Existing RSVP found, deleting...');
            rsvp.remove(function(err) {
              if (err) return res.apiResponse({ success: false, err: err });
              console.log('[api.app.rsvp] - Deleted RSVP.');
              return res.apiResponse({ success: true });
            });
          } else {
            console.log('[api.app.rsvp] - Existing RSVP found, updating...');
            rsvp.set({
              participating: req.body.participating == 'true',
              changedAt: req.body.changed
            }).save(function(err) {
              if (err) return res.apiResponse({ success: false, err: err });
              console.log('[api.app.rsvp] - Updated RSVP.');
              return res.apiResponse({ success: true });
            });
          }

        } else {

          console.log('[api.app.rsvp] - No RSVP found, creating...');

          new RSVP.model({
            event: req.body.event,
            who: user,
            participating: req.body.participating == 'true',
            changedAt: req.body.changed
          }).save(function(err) {
            if (err) return res.apiResponse({ success: false, err: err });
            console.log('[api.app.rsvp] - Created RSVP.');
            return res.apiResponse({ success: true });
          });

        }

      });
  });

}
