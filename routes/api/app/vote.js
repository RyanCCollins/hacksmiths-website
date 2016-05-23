var async = require('async'),
  keystone = require('keystone'),
  Event = keystone.list('Event'),
  ProjectIdeaVote = keystone.list('ProjectIdeaVote'),
  ProjectIdea = keystone.list('ProjectIdea'),
  Promise = require('bluebird'),
  User = keystone.list('User');

exports = module.exports = function(req, res) {

  var findEvent = function() {
    return Event.model.findOne()
      .where('state', 'votingInProgress')
      .sort('-startDate')
      .exec().then(function(event) {
        return findProjectIdea(event);
      }, function(err) {

      }).then(function(idea) {

      }, function(err) {

      }).then(function(vote) {

      })
  }

  var findProjectIdea = function(event) {
    return ProjectIdea.model.findOne().where('event', event).exec();
  }

  var findProjectIdeaVotes = function(idea) {
    return ProjectIdeaVotes.model.find().where('idea')
  }

  async.series([
    function(next) {
      return next();
    }
  ], function(err) {
    if (err) {
      returnValues.err = err;
      returnValues.success = false;
    } else {
      returnValues.success = true;
    }
    res.json(returnValues);
  });

  User.model.findById(req.body.user).exec(function(err, user) {
    if (err || !user) return res.apiResponse({ success: false });
    var projectIdea = ProjectIdea.findById(req.body.idea);
    ProjectIdeaVote.findOne()
      .where('createdBy', user)
      .where('idea', req.body.idea)
      .exec(function(err, vote) {
        if (vote) {
          if (req.body.cancel == 'true') {

          }
        } else {

        }
      })
  });
}
