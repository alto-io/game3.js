const graphql = require('graphql')

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLID
} = graphql

const tournaments_gqlSchema = new GraphQLObjectType({
  name: "Tournaments",
  fields: () => ({
    id: {type: GraphQLID},
    endTime: {type: GraphQLString},
    state: {type: GraphQLString},
    pool: {type: GraphQLString},
    data: {type: GraphQLString},
    shares: {type: new GraphQLList(GraphQLString)}
  })
})

module.exports = tournaments_gqlSchema;