'use strict';

var GraphQL = require('graphql');
var keystoneTypes = require('./keystoneTypes');

var keystone = require('keystone');
var Event = keystone.list('Event');
var ScheduleItem = keystone.list('ScheduleItem');
var User = keystone.list('User');
var RSVP = keystone.list('RSVP');
var Organization = keystone.list('Organization');

function getEvent(id) {
	if (id === 'next') {
		return Event.model.findOne().sort('-startDate').where('state', 'active').exec();
	} else if (id === 'last') {
		return Event.model.findOne().sort('-startDate').where('state', 'past').exec();
	} else {
		return Event.model.findById(id).exec();
	}
}

var eventStateEnum = new GraphQL.GraphQLEnumType({
	name: 'EventState',
	description: 'The state of the Event',
	values: {
		draft: {
			description: "No published date, it's a draft Event"
		},
		scheduled: {
			description: "Publish date is before today, it's a scheduled Event"
		},
		active: {
			description: "Publish date is after today, it's an active Event"
		},
		past: {
			description: "Event date plus one day is after today, it's a past Event"
		}
	}
});

var eventType = new GraphQL.GraphQLObjectType({
	name: 'Event',
	fields: function fields() {
		return {
			id: {
				type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID),
				description: 'The id of the Event.'
			},
			name: {
				type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
				description: 'The name of the Event.'
			},
			publishedDate: keystoneTypes.date(Event.fields.publishedDate),
			state: {
				type: new GraphQL.GraphQLNonNull(eventStateEnum)
			},
			startDate: keystoneTypes.datetime(Event.fields.startDate),
			endDate: keystoneTypes.datetime(Event.fields.endDate),
			place: {
				type: GraphQL.GraphQLString
			},
			map: {
				type: GraphQL.GraphQLString
			},
			description: {
				type: GraphQL.GraphQLString
			},
			maxRSVPs: {
				type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLInt)
			},
			totalRSVPs: {
				type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLInt)
			},
			url: {
				type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString)
			},
			spotsRemaining: {
				type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLInt)
			},
			spotsAvailable: {
				type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLBoolean)
			},
			rsvps: {
				type: new GraphQL.GraphQLList(rsvpType),
				resolve: function resolve(source) {
					return RSVP.model.find().where('event', source.id).exec();
				}
			}
		};
	}
});

var userType = new GraphQL.GraphQLObjectType({
	name: 'User',
	fields: function fields() {
		return {
			id: {
				type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID),
				description: 'The id of the user.'
			},
			name: {
				type: new GraphQL.GraphQLNonNull(keystoneTypes.name)
			},
			email: {
				type: keystoneTypes.email,
				resolve: function resolve(source) {
					return {
						email: source.email,
						gravatarUrl: source._.email.gravatarUrl
					};
				}
			},
			rsvps: {
				type: new GraphQL.GraphQLList(rsvpType),
				resolve: function resolve(source) {
					return RSVP.model.find().where('who', source.id).exec();
				}
			}
		};
	}
});

var rsvpType = new GraphQL.GraphQLObjectType({
	name: 'RSVP',
	fields: {
		id: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID),
			description: 'The id of the RSVP.'
		},
		event: {
			type: new GraphQL.GraphQLNonNull(eventType),
			resolve: function resolve(source) {
				return Event.model.findById(source.event).exec();
			}
		},
		who: {
			type: new GraphQL.GraphQLNonNull(userType),
			resolve: function resolve(source) {
				return User.model.findById(source.who).exec();
			}
		},
		attending: {
			type: GraphQL.GraphQLBoolean
		},
		createdAt: keystoneTypes.datetime(Event.fields.createdAt),
		changedAt: keystoneTypes.datetime(Event.fields.changedAt)
	}
});

var organizationType = new GraphQL.GraphQLObjectType({
	name: 'Organization',
	fields: {
		name: {
			type: GraphQL.GraphQLString
		},
		logo: {
			type: keystoneTypes.cloudinaryImage
		},
		website: {
			type: GraphQL.GraphQLString
		},
		isHiring: {
			type: GraphQL.GraphQLBoolean
		},
		description: {
			type: keystoneTypes.markdown
		},
		location: {
			type: keystoneTypes.location
		},
		members: {
			type: new GraphQL.GraphQLList(userType),
			resolve: function resolve(source) {
				return User.model.find().where('organization', source.id).exec();
			}
		}
	}
});

var queryRootType = new GraphQL.GraphQLObjectType({
	name: 'Query',
	fields: {
		event: {
			type: eventType,
			args: {
				id: {
					description: 'id of the event, can be "next" or "last"',
					type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID)
				}
			},
			resolve: function resolve(_, args) {
				return getEvent(args.id);
			}
		},
	},
	organization: {
		type: organizationType,
		args: {
			id: {
				description: 'id of the organization',
				type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID)
			}
		},
		resolve: function resolve(_, args) {
			return Organization.model.findById(args.id).exec();
		}
	},
	user: {
		type: userType,
		args: {
			id: {
				description: 'id of the user',
				type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID)
			}
		},
		resolve: function resolve(_, args) {
			return User.model.findById(args.id).exec();
		}
	},
	rsvp: {
		type: rsvpType,
		args: {
			id: {
				description: 'id of the RSVP',
				type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID)
			}
		},
		resolve: function resolve(_, args) {
			return RSVP.model.findById(args.id).exec();
		}
	}
}
});

module.exports = new GraphQL.GraphQLSchema({
	query: queryRootType
});
