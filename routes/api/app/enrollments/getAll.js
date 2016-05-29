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
        .description), 250, '...', true),
      key: result.key,
      link: result.link,
      updatedAt: result.updatedAt
    };
    return nanodegree;
  }

  var parseNanodegrees = function(results) {
    return new Promise(
        var nanodegrees = results.map(function(result) {
        return parseNanodegree(result);
      });
    );
  }

  loadNanodegrees().then(function(nanodegrees) {
    return parseNanodegrees(nanodegrees);

  }).then(function(nanodegreeResults) {
    return res.apiResponse({ success: true, nanodegrees: nanodegreeResults })
  }).catch(function(error) {
    return res.apiRespons({ success: false, error: error })
  })
}

{
    "__v" = 0;
    "_id" = 56e1e04a4275380300761190;
    createdAt = "2016-03-10T20:59:54.917Z";
    createdBy = 56e1d7636879810300fd55c2;
    description =     {
        html = "<p>Learning Ruby\U2014a programming language ideal for beginners\U2014is the first step to mastering Ruby on Rails, the framework that powers sites like GitHub, Groupon, and Twitter.</p>\n";
        md = "Learning Ruby\U2014a programming language ideal for beginners\U2014is the first step to mastering Ruby on Rails, the framework that powers sites like GitHub, Groupon, and Twitter.";
    };
    key = "ruby-language";
    link = "https://www.udacity.com/nanodegrees/nd010";
    logo =     {
        format = svg;
        height = 120;
        "public_id" = lm9snfacjv8vhcjs62yd;
        "resource_type" = image;
        "secure_url" = "https://res.cloudinary.com/dxlayenjj/image/upload/v1457643619/lm9snfacjv8vhcjs62yd.svg";
        signature = 893f0bad3ef751d5a5c871c9a2479cc9703a9d33;
        url = "http://res.cloudinary.com/dxlayenjj/image/upload/v1457643619/lm9snfacjv8vhcjs62yd.svg";
        version = 1457643619;
        width = 120;
    };
    title = "Ruby Language";
    updatedAt = "2016-03-10T21:00:19.647Z";
    updatedBy = 56e1d7636879810300fd55c2;
},
