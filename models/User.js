var async = require('async');
var crypto = require('crypto');
var keystone = require('keystone');
var createHash = require('create-hash');
var Types = keystone.Field.Types;

/**
 * Users Model
 * ===========
 */

var User = new keystone.List('User', {
    track: true,
    autokey: { path: 'key', from: 'name', unique: true }
});

var deps = {
    mentoring: { 'mentoring.available': true },
    github: { 'services.github.isConfigured': true },
    twitter: { 'services.twitter.isConfigured': true },
    isAvailableForEvents: {'availability.isAvailableForEvents': true}
};

User.add({
    name: { type: Types.Name, required: true, index: true },
    email: { type: Types.Email, initial: true, index: true },
    password: { type: Types.Password, initial: true },
    resetPasswordKey: { type: String, hidden: true },
    authHash: { type: String, default: '', index: true },
}, 'Profile', {
    isPublic: { type: Boolean, default: true },
    isLeader: Boolean,
    photo: { type: Types.CloudinaryImage },
    website: { type: Types.Url, note: 'Full website URL, including http://'},
    bio: { type: Types.Markdown },
    gravatar: { type: String, noedit: true },
}, 'Notifications', {
    notifications: {
        posts: { type: Boolean },
        events: { type: Boolean, default: true },
        projects: { type: Boolean, default: true }
    }
}, 'Event Involvement', {
    availability: {
        isAvailableForEvents: {type: Types.Boolean, default: false, label: 'Available to work on projects.'},
        daysAvailable: {
            monday: {type: Types.Boolean, default: false, label: 'Monday', dependsOn: deps.isAvailableForEvents },
            tuesday: {type: Types.Boolean, default: false, label: 'Tuesday', dependsOn: deps.isAvailableForEvents },
            wednesday: {type: Types.Boolean, default: false, label: 'Wednesday', dependsOn: deps.isAvailableForEvents },
            thursday: {type: Types.Boolean, default: false, label: 'Thursday', dependsOn: deps.isAvailableForEvents },
            friday: {type: Types.Boolean, default: false, label: 'Friday', dependsOn: deps.isAvailableForEvents },
            saturday: {type: Types.Boolean, default: false, label: 'Saturday', dependsOn: deps.isAvailableForEvents },
            sunday: {type: Types.Boolean, default: false, label: 'Sunday', dependsOn: deps.isAvailableForEvents },
        },
        explanation: {type: Types.Html, note: 'Give a brief description of your availability.', dependsOn: deps.isAvailableForEvents }
    },
    areasOfExpertise: {type: Types.Relationship, ref: 'Skill', many: true, note: 'What is the area you are most skilled in?', dependsOn: deps.isAvailableForEvents },
    skillExplanation: {type: Types.Markdown, dependsOn: deps.isAvailableForEvents  },
    rolesToFill: {type: Types.Relationship, ref: 'Role', many: true, note: 'What role do you see yourself filling?', dependsOn: deps.isAvailableForEvents },
    projectInterests: {type: Types.Relationship, ref: 'Project', many: true, dependsOn: deps.isAvailableForEvents },
}, 'Memberships', {
    enrollments: { type: Types.Relationship, ref: 'Nanodegree', many: true, filters: {  }},
    enrollmentStatus: {type: Types.Select, options: ['Student', 'Graduate'], required: true, initial: true, default: 'Student'},
    teams: { type: Types.Relationship, ref: 'Team', many: true, filters: {}},
    organization: { type: Types.Relationship, ref: 'Organization', refPath: 'organization', note: 'Are you part of an organization?'},
}, 'Mentoring', {
    mentoring: {
        available: { type: Boolean, label: 'Is Available', index: true },
        free: { type: Boolean, label: 'For Free', dependsOn: deps.mentoring },
        paid: { type: Boolean, label: 'For Payment', dependsOn: deps.mentoring },
        swap: { type: Boolean, label: 'For Swap', dependsOn: deps.mentoring },
        have: { type: String, label: 'Has...', dependsOn: deps.mentoring },
        want: { type: String, label: 'Wants...', dependsOn: deps.mentoring }
    }
}, 'Permissions', {
        isAdmin: { type: Boolean, label: 'Can Admininstrate the site.' },
        isTeamLeader: { type: Boolean, label: 'Can create tasks for team.', default: true },
        isMember: { type: Boolean, label: 'Has a verified email address and is a member.' }
}, 'Services', {
    services: {
        github: {
            isConfigured: { type: Boolean, label: 'GitHub has been authenticated' },

            profileId: { type: String, label: 'Profile ID', dependsOn: deps.github },

            username: { type: String, label: 'Username', dependsOn: deps.github },
            avatar: { type: String, label: 'Image', dependsOn: deps.github },

            accessToken: { type: String, label: 'Access Token', dependsOn: deps.github },
            refreshToken: { type: String, label: 'Refresh Token', dependsOn: deps.github }
        },
        twitter: {
            isConfigured: { type: Boolean, label: 'Twitter has been authenticated' },

            profileId: { type: String, label: 'Profile ID', dependsOn: deps.twitter },

            username: { type: String, label: 'Username', dependsOn: deps.twitter },
            avatar: { type: String, label: 'Image', dependsOn: deps.twitter },

            accessToken: { type: String, label: 'Access Token', dependsOn: deps.twitter },
            refreshToken: { type: String, label: 'Refresh Token', dependsOn: deps.twitter }
        },
    }
}, 'Meta', {
    sortPriority: { type: Number, size: 'small', default: 10 },
    rank: {type: Number, noedit: true},
    isTopContributor: { type: Boolean, default: false, noedit: true},
    totalHatTips: { type: Number, default: 0},
    lastRSVP: { type: Date, noedit: true },
    projectsContributedTo: {type: Types.Relationship, ref: 'Project', many: true, noedit: true, hidden: true},
});

User.schema.index({ isPublic: 1, isLeader: 1, isTopContributor: 1 });
User.schema.index({ isPublic: 1, isLeader: 1, isTopContributor: 1, sortPriority: 1 });
/**
    Pre-save
    =============
*/

User.schema.pre('save', function(next) {
    var member = this;
    async.parallel([
        function(done) {
            if (!member.email) return done();
            member.gravatar = crypto.createHash('md5').update(member.email.toLowerCase().trim()).digest('hex');
            return done();
        },
        function(done) {
            keystone.list('RSVP').model.findOne({ who: member.id }).sort('changedAt').exec(function(err, rsvp) {
                if (err) {
                    console.error("===== Error setting user last RSVP date =====");
                    console.error(err);
                    return done();
                }
                if (!rsvp) return done();
                member.lastRSVP = rsvp.changedAt;
                return done();
            });
        }
    ], next);
});


/**
    Relationships
    =============
*/

User.relationship({ ref: 'Team', refPath: 'members', path: 'teams' });
User.relationship({ ref: 'Project', refPath: 'contributors', path: 'projectsContributedTo' });
User.relationship({ ref: 'Post', refPath: 'author', path: 'posts' });
User.relationship({ ref: 'RSVP', refPath: 'who', path: 'rsvps' });


/**
 * Virtuals
 * ========
 */

// Link to member
User.schema.virtual('url').get(function() {
    return '/member/' + this.key;
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
    return this.isAdmin;
});

// Pull out avatar image
User.schema.virtual('avatarUrl').get(function() {
    if (this.photo.exists) return this._.photo.thumbnail(120,120);
    if (this.services.github.isConfigured && this.services.github.avatar) return this.services.github.avatar;
    if (this.services.twitter.isConfigured && this.services.twitter.avatar) return this.services.twitter.avatar;
    if (this.gravatar) return 'http://www.gravatar.com/avatar/' + this.gravatar + '?d=http%3A%2F%2Fhacksmiths.io%2Fimages%2Favatar.png&r=pg';
});

// Usernames
User.schema.virtual('twitterUsername').get(function() {
    return (this.services.twitter && this.services.twitter.isConfigured) ? this.services.twitter.username : '';
});
User.schema.virtual('githubUsername').get(function() {
    return (this.services.github && this.services.github.isConfigured) ? this.services.github.username : '';
});

/**
 * Methods
 * =======
*/

User.schema.methods.resetPassword = function(callback) {
    var user = this;
    user.resetPasswordKey = keystone.utils.randomString([16,24]);
    user.save(function(err) {
        if (err) return callback(err);
        new keystone.Email('forgotten-password').send({
            user: user,
            link: '/reset-password/' + user.resetPasswordKey,
            subject: 'Reset your password',
            to: user.email,
            from: {
                name: 'hacksmiths',
                email: 'contact@hacksmiths.com'
            }
        }, callback);
    });
};


/**
 * Registration
 * ============
*/

User.defaultColumns = 'name, email, twitter, isAdmin';
User.register();