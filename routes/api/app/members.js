var keystone = require('keystone');
var async = require('async');
var   _ = require('underscore');
var   moment = require('moment');
var   crypto = require('crypto');
var User = keystone.list('User');

var auth = require('../../../lib/auth/auth');

exports = module.exports = function(req, res) {

    //if (!req.body.username || !req.body.password) return res.apiResponse({ success: false });

    var data = {};
    var body = req.body || {};

    var authHash = body.authToken && auth.hash(body.authToken);
    var authenticated = false;

    async.series([
        function(next) {
            if (!authHash) return next();

            keystone.list('User').model.findOne({ authHash: authHash}).exec(function(err, results) {
                if (err) {
                    console.log(err);
                }

                authenticated = results.authenticated;

                return next();
            });
        },
        function(next) {
            var conditions = {};

            if (!authenticated) {
                // Unregistered people receive just the team leaders and top contributors
                conditions = {
                        isPublic: true,
                        $or: [{ isLeader: true }, { isTopContributor: true }]
                    };
            } else {
                // Authenticated users receive entire list
                conditions = { $or: [{ isLeader: true }, { isTopContributor: true }, { isPublic: true }] }

            }
            // Remove conditions for now, but add them within the Find method later
            User.model.find().sort('name').exec(function(err, members) {
                if (err) {
                    console.log(err);
                } else {
                    data.members = members;
                    return next();
                }
            });
        }
        ], function(err) {

            var response = {
                success: true,
                authenticated: authenticated,
                members: data.members
            };

        res.apiResponse(response);

        });

};