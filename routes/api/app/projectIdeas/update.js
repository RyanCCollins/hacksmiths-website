var keystone = require('keystone'),
    User = keystone.list('User'),
    ProjectIdea = keystone.list('ProjectIdea');

exports = module.exports = function(req, res) {
  var user = req.body.user;
  var id = req.params.id;
  var ideaParams = req.body.idea;

  var userPromise = User.model.findById(user).exec();
  var projectIdea = ProjectIdea.model.findById(id).exec();
  var updateIdea = function(idea, params) {
    var ideaParams = params;
    ideaParams.description = {
      md: params.description
    };
    return idea.update(params).exec();
  };

  var userError = function(message) {
    return message;
  };

  userPromise.then(function(user) {
    if (!user) {
      throw userError("User not found.")
    }
    return projectIdea;
  }).catch(function(error) {
    return res.apiResponse({ success: false, error: error });
  }).then(function(idea) {
    return updateIdea(idea, ideaParams);
  }).then(function() {
    return res.apiResponse({ success: true })
  }).catch(function() {
    return res.apiResponse({ success: false, error: "An error occured while updating the project idea."})
  });
};
