var keystone = require('keystone'),
  ProjectIdea = keystone.list('ProjectIdea'),
  User = keystone.list('User'),
  Event = keystone.list('Event');

  exports = module.exports = function(req, res) {

    var findNextEvent = function() {
        return Event.model.findOne()
                .where('state', 'votingInProgress')
                .where('requiresVote', true)
                .exec();
    }

    var fetchUser = function(id) {
      return User.model.findById(id).exec();
    }

    var findExistingIdea = function(user) {
      return ProjectIdea.model.findOne().where('user', user).exec();
    }

    var createIdea = function(idea, user, event) {
      return new ProjectIdea.model({
        user: user,
        idea: idea,
        event: event
      }).save();
    }

    var idea = req.body.idea;
    var theUser;
    fetchUser(req.body.user)
      .then(function(user) {
        theUser = user;
      return findNextEvent();
    }).then(function(event) {
      return createIdea(idea, theUser, event);
    }).then(function(error) {
      if (error) {
        console.log("Errror: ", err)
        return res.apiResponse({ success: false, error: error });
      } else {
        return res.apiResponse({ success: true })
      }
    }).catch(function(err) {
      console.log("Errror: ", err)
      return res.apiResponse({ success: false, error: err });
    });

  }
