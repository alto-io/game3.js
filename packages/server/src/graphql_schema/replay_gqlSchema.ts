import { gql } from 'apollo-server-express';
import {
  GlobalState
} from '@game3js/common';

const db = GlobalState.ServerState;

export const typeDef = gql`
  extend type Mutation {
    serverPutReplay(requestBody: RequestBody!): NewPlayerData 
  }
  input RequestBody {
    sessionId: ID!
    playerAddress: String!
    fileHash: String!
  }
  type NewPlayerData {
    result: String
    playerData: PlayerData
  }
`
export const resolvers = {
  Mutation: {
    serverPutReplay: async(parent, args) => {
      const {requestBody} = args;
      let result = await db.dbManager.serverPutGameReplay(requestBody);
      return result;
    }
  }
}