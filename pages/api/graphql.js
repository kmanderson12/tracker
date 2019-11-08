import { ApolloServer, gql } from 'apollo-server-micro';
import { mergeResolvers, mergeTypeDefs } from 'graphql-toolkit';
import connectDb from '../../lib/mongoose';
import { habitsResolvers } from '../../src/api/habits/resolvers';
import { habitsMutations } from '../../src/api/habits/mutations';
import Habits from '../../src/api/habits/habits.graphql';

const fakeTypeDefs = gql`
  type Query {
    sayHello: String
  }
`;

const fakeResolvers = {
  Query: {
    sayHello: () => {
      return 'Hello there! How are you?';
    },
  },
};

const typeDefs = mergeTypeDefs([fakeTypeDefs, Habits]);

const resolvers = mergeResolvers([
  fakeResolvers,
  habitsResolvers,
  habitsMutations,
]);

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

const server = apolloServer.createHandler({ path: '/api/graphql' });
export default connectDb(server);
