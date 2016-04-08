var keystone = require('keystone');
var Types = keystone.Field.Types;
var GitHubApi = require("node-github");

var ProjectRepo = new keystone.List('ProjectRepo', {
  track: true,
  autokey: {
    path: 'key',
    from: 'name',
    unique: true
  }
});

ProjectRepo.add({
  name: {
    type: String,
    required: true,
    note: 'What is the name of the repository?'
  },
  project: {
    type: Types.Relationship,
    many: false,
    ref: 'Project',
    note: 'Which project does the repository belong to?',
    initial: true,
    required: true
  },
  url: {
    type: Types.Url,
    required: true,
    initial: true,
    note: 'What is the main URL of the repository?'
  },
});

// ProjectRepo.schema.virtual('totalCommits').get(function() {
//   var github = new GithubApi({
//     version: "3.0.0",
//     debug: true,
//     protocol: "https",
//     host: "api.github.com",
//
//   })
// });

ProjectRepo.defaultColumns = 'project, url'
ProjectRepo.register();
