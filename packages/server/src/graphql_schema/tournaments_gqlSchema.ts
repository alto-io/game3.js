import {gql} from 'apollo-server-express';
import { 
  GlobalState
} from '@game3js/common';

const db = GlobalState.ServerState;

export const typeDef = gql`
  extend type Query {
    tournament(id: ID!): Tournament
    getWinners(id: ID!, resultsCount: Int!): [String]
  }
  extend type Mutation {
    createTournament(tournament: TournamentObj!): Tournament
    updateTournament(id: ID!, updateObj: TournamentObj!): Result
  }
  input TournamentObj {
    id: ID
    endTime: String
    state: String
    pool: String
    data: String
    shares: [String]
  }
  type Tournament {
    id: ID
    endTime: String
    state: String
    pool: String
    data: String
    shares: [String]
  }
  type Result {
    success: Boolean
    updatedData: Tournament
  }
`;

export const resolvers = {
  Query: {
    tournament: async(parent, args) => {
      let result = await db.dbManager.getTournament(args.id);
      return result[0];
    },
    getWinners: async(parent, args) => {
      return await db.dbManager.getTopResults(args.id, args.resultsCount);
    } 
  },
  Mutation: {
    createTournament: async (parent, args) => {
      let result = await db.dbManager.newTournament(args.tournament);
      return result;
    },
    updateTournament: async (parent, args) => {
      let result = await db.dbManager.updateTournament(args.id, args.updateObj);
      return result;
    }
  }
}