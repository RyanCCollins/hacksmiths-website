var keystone = require('keystone'),
    ProjectIdea = keystone.list('ProjectIdea');

exports = module.exports = function(req, res) {
  var projectIdeaID = req.params.id;
  var getOneIdea = function(id) {
    return ProjectIdea.findById(id).exec();
  };

  getOneIdea(projectIdeaID).then(function(idea) {
    var ideaJSON = idea.toJSON();
    return res.apiResponse({ success: true, idea: ideaJSON });
  }).catch(function(err) {
    return res.apiResponse({ success: false, error: err });
  });
};
