import { gql } from 'apollo-server-express';
import {
  GlobalState
} from '@game3js/common';

import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';

const db = GlobalState.ServerState;

export const typeDef = gql`
  scalar JSON
  scalar JSONObject

  extend type Query {
    getSessionData(sessionId: ID!, playerAddress: String!, tournamentId: ID!): PlayerData
    getSessionId(playerAddress: String!, tournamentId: ID!): SessionID
  }
  type PlayerData {
    gameNo: Int
    score: Int
    highScore: Int
  }
  type SessionID {
    success: Boolean
    sessionId: String
    gameSessionData: PlayerData
  }
`

export const resolvers = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
  Query: {
    getSessionData: async (parent, args) => {
      const { sessionId, playerAddress, tournamentId } = args;
      let result = await db.dbManager.serverGetGameSession(sessionId, playerAddress, tournamentId);
      return result;
    },
    getSessionId: async (parent, args) => {
      const { playerAddress, tournamentId } = args;
      let result = await db.dbManager.getGameSessionId(playerAddress, tournamentId);
      return result;
    }
  },
  SessionID: {
    gameSessionData: async(parent, args) => {
      let result = await db.dbManager.serverGetGameSession(parent.sessionId, parent.playerAddress, parent.tournamentId);
      return result;
    }
  }
}