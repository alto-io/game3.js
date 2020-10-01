const tournaments_gqlSchema = require('./tournaments_gqlSchema');

import { GlobalState } from '@game3js/common';

const dbMethods = GlobalState.ServerState;

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

module.exports = root_gql_schema;