var keystone = require('keystone'),
    ProjectIdea = keystone.list('ProjectIdea');

exports = module.exports = function(req, res) {

  ProjectIdea.model.find().exec()
    .then(function(ideas) {
      var ideaMap = [];
      var ideas = ideas.map(function(idea, index) {
        ideaMap[index] = idea;
      });
    return res.apiResponse({ success: true, ideas: ideaMap })
  }).catch(function(error) {
    return res.apiResponse({ success: false, error: error });
  });

};
