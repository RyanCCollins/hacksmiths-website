var keystone = require('keystone'),
    ProjectIdea = keystone.list('ProjectIdea'),
    User = keystone.list('User');

exports = module.exports = function(req, res) {
  var ideaId = req.params.id;
  var user = req.body.user;


  /* Return a promise from exec() in find user by id */
  var findUser = function(userId) {
    return User.model.findById(userId).exec();
  }

  var findAndRemoveIdea = function(id, user) {
    return ProjectIdea.model.findById(id).exec().then(function(doc) {
      // If the user also posted the idea
      if (user === doc.user) {
        return doc.remove().exec();
      } else {
        var error = "User trying to remove a document that they did not create";
        return { error: error };
      }
    })
  }

  findUser(req.body.user).then(function(user) {
    return findAndRemoveIdea(ideaId, user);
  }).catch(function(error) {
    throw "An error occured while finding user" + error
  }).then(function() {
    return res.apiResponse({ success: true });
  }).catch(function(error) {
    return res.apiResponse({ success: false, error: error });
  })

}
