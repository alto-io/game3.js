// import gameSessions_gqlSchema from './gameSessions_gqlSchema';
// import replay_gqlSchema from './replay_gqlSchema';
const tournaments_gqlSchema = require('./tournaments_gqlSchema');

const graphql = require('graphql');
import { GlobalState } from '@game3js/common';

const dbMethods = GlobalState.ServerState;

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList
} = graphql

const root_gql_schema = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    tournament: { 
      type: tournaments_gqlSchema,
      args: { id: {type: GraphQLID}},
      resolve: async (parent, args) => {
        const res = await dbMethods.dbManager.getTournament(args.id);
        console.log("DATA", res);
        return res[0];
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: root_gql_schema
});