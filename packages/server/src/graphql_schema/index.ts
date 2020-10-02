import {ApolloServer} from 'apollo-server-express';

import { merge } from 'lodash';

import { Query, Mutation } from './query';
import {
   typeDef as Tournament,
   resolvers as tournamentResolvers
  } from './tournaments_gqlSchema';



const typeDefs = [Query, Mutation, Tournament];

let resolver = {}

let _resolvers = merge(resolver, tournamentResolvers);

const schema = new ApolloServer({
  typeDefs,
  resolvers: _resolvers,
  playground: {
    endpoint: 'graphql',
    settings: {
      'editor.theme': 'light'
    }
  }
});

export default schema;