import {ApolloServer} from 'apollo-server-express';

import { merge } from 'lodash';

import { Query, Mutation } from './query';
import {
   typeDef as Tournament,
   resolvers as tournamentResolvers
  } from './tournaments_gqlSchema';

import {
  typeDef as GameSession,
  resolvers as gameSessionResolvers
} from './gameSessions_gqlSchema';



const typeDefs = [Query, Mutation, Tournament, GameSession];

let resolver = {}

let _resolvers = merge(resolver, tournamentResolvers, gameSessionResolvers);

const schema = new ApolloServer({
  typeDefs,
  resolvers: _resolvers,
  playground: {
    endpoint: 'graphql',
    settings: {
      'editor.theme': 'dark'
    }
  }
});

export default schema;