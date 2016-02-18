var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Categories Model
 * =====================
 */

var TeamStats = new keystone.List('TeamStats', {
    nocreate: true,
    noedit: true
});

TeamStats.add({
    team: {type: Types.Relationship, many: false, ref: 'Project'},
    totalCommits: {type: Number, default: 0},
    totalHatTips: {type: Number, default: 0}
});

TeamStats.relationship({path: 'team', ref: 'Team', refPath:'stats'});

TeamStats.defaultColumns = 'team, totalCommits, totalHatTips';
TeamStats.register();