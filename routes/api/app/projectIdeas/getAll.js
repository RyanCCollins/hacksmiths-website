var keystone = require('keystone'),
    ProjectIdea = keystone.list('ProjectIdea');

exports = module.exports = function(req, res) {

  var getAllProjectIdeas = function() {
    return ProjectIdea.model.find().exec();
  };

  getAllProjectIdeas().then(function(ideas) {
    var ideaJSON = ideas.toJSON();
    return res.apiResponse({ success: true, ideas: ideaJSON })
  }).catch(function(error) {
    return res.apiResponse({ success: false, error: error });
  });

};
