var keystone = require('keystone'),
    Nanodegree = keystone.list('Nanodegree');

exports = module.exports = function(req, res) {
  var loadNanodegrees = function() {
    return Nanodegree.model.find().exec();
  }

  var parseNanodegree = function(result) {
    var nanodegree = {
      id: result._id,
      title: result.title,
      description: keystone.utils.cropString(keystone.utils.htmlToText(result
        .description.html), 250, '...', true),
      key: result.key,
      link: result.link,
      updatedAt: result.updatedAt,
      logo: result.logo.url
    };
    return nanodegree;
  }

  var parseNanodegrees = function(results) {
      var nanodegrees = results.map(function(result) {
        return parseNanodegree(result);
      });
      return nanodegrees;
  }

  loadNanodegrees().then(function(nanodegrees) {
    return parseNanodegrees(nanodegrees);
  }).then(function(nanodegreeResults) {
    return res.apiResponse({ success: true, nanodegrees: nanodegreeResults })
  }).catch(function(error) {
    return res.apiRespons({ success: false, error: error })
  })
}
