var keystone = require('keystone');
var async = require('async');
var   _ = require('underscore');
var   moment = require('moment');
var   crypto = require('crypto');


var auth = require('../../../lib/auth');

exports = module.exports = function(req, res) {
    var body = req.body || {};

    var authHash = body.authToken && auth.hash(body.authToken)

    async.series({



    })

    var data = { members: {}};

    var queries = {
        people: function(callback) {
            //If authenticated, get all users

        }
    }
};
