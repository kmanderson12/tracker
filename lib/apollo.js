import ApolloClient from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';

export function withApollo(PageComponent) {
  const WithApollo = ({ apolloClient, apolloState, ...pageProps }) => {
    const client = apolloClient || initApolloClient(apolloState);

    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };

  WithApollo.getInitialProps = async ctx => {
    const { AppTree } = ctx;
    const apolloClient = (ctx.apolloClient = initApolloClient());

    let pageProps = {};
    if (PageComponent.getInitialProps) {
      pageProps = await PageComponent.getInitialProps(ctx);
    }

    if (typeof window === 'undefined') {
      if (ctx.res && ctx.res.finished) {
        return pageProps;
      }

      try {
        const { getDataFromTree } = await import('@apollo/react-ssr');
        await getDataFromTree(
          <AppTree
            pageProps={{
              ...pageProps,
              apolloClient,
            }}
          />
        );
      } catch (e) {
        console.error(e);
      }
      Head.rewind();
    }
    const apolloState = apolloClient.cache.extract();
    return {
      ...pageProps,
      apolloState,
    };
  };

  return WithApollo;
}

const isDev = process.env.NODE_ENV !== 'production';
const url = isDev
  ? 'http://localhost:3000'
  : 'https://tracker.kmanderson12.now.sh';

const initApolloClient = (initialState = {}) => {
  const cache = new InMemoryCache().restore(initialState);
  const link = new HttpLink({
    uri: `${url}/api/graphql`,
    fetch,
  });
  const ssrMode = typeof window === 'undefined';

  const client = new ApolloClient({
    ssrMode,
    link,
    cache,
  });

  return client;
};
