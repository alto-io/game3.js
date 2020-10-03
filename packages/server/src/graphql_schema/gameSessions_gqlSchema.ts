import { gql } from 'apollo-server-express';
import {
  GlobalState
} from '@game3js/common';

import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';

const db = GlobalState.ServerState;

export const typeDef = gql`
  scalar JSON
  scalar JSONObject

  extend type Mutation {
    createSessionId(playerAddress: String!, tournamentId: ID!): NewSessionId
    createSession(gameName: String!, sessionId: ID!, tournamentId: ID!, gamePayload: JSON!): NewSessionData
    updateScore(sessionId: ID!, playerAddress: String!, tournamentId: ID!, gamePayload: JSON!): UpdatedScore
    updateGameNo(sessionId: ID!, playerAddress: String!, tournamentId: ID!): UpdateGameNumber
  }
  extend type Query {
    getSessionData(sessionId: ID!, playerAddress: String!, tournamentId: ID!): PlayerData
    getSessionId(playerAddress: String!, tournamentId: ID!): SessionID
  }
  type PlayerData {
    metadata: JSON
    gameNo: Int
    score: Int
    highScore: Int
  }
  type SessionID {
    success: Boolean
    sessionIdData: SessionIdData
    gameSessionData: PlayerData
  }
  type UpdatedScore {
    result: PlayerData
    newHighScore: Boolean
  }
  type UpdateGameNumber {
    result: PlayerData
  }
  type NewSessionData {
    success: Boolean
    sessionData: SessionData
  }
  type SessionData {
    sessionId: ID
    tournamentId: ID
    gameName: String
  }
  type NewSessionId {
    success: Boolean
    sessionIdData: SessionIdData
  }
  type SessionIdData {
    id: ID
    tournamentId: ID
    playerAddress: String
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
  Mutation: {
    createSessionId: async (parent, args) => {
      const {playerAddress, tournamentId} = args;
      let result = await db.dbManager.serverCreateSessionId(playerAddress, tournamentId);
      return result;
    },
    createSession: async(parent, args) => {
      const { gameName, sessionId, tournamentId, gamePayload } = args;
      let result = await db.dbManager.makeNewGameSession(gameName, sessionId, tournamentId, gamePayload);
      return result;
    },
    updateScore: async(parent, args) => {
      const { sessionId, playerAddress, tournamentId, gamePayload } = args;
      let result = await db.dbManager.serverUpdateScore(sessionId, playerAddress, tournamentId, gamePayload);
      return result;
    },
    updateGameNo: async (parent, args) => {
      const { sessionId, playerAddress, tournamentId } = args;
      let result = await db.dbManager.updateGameNumber(sessionId, playerAddress, tournamentId);
      return result;
    }
  },
  UpdatedScore: {
    result: async (parent, args) => {
      const {sessionId, playerAddress, tournamentId} = parent.params;
      let result = await db.dbManager.serverGetGameSession(sessionId, playerAddress, tournamentId);
      return result;
    }
  },
  SessionID: {
    gameSessionData: async(parent, args) => {
      let result = await db.dbManager.serverGetGameSession(parent.sessionIdData.id, parent.sessionIdData.playerAddress, parent.sessionIdData.tournamentId);
      return result;
    }
  }
}