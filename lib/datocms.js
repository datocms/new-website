import React from 'react';
import Head from 'next/head';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import introspectionQueryResultData from './fragmentTypes.json';
import gql from 'graphql-tag';

let apolloClient = null;

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 * @param  {Object} initialState
 */
export function initApolloClient(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return createApolloClient(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createApolloClient(initialState);
  }

  return apolloClient;
}

/**
 * Creates and configures the ApolloClient
 * @param  {Object} [initialState={}]
 */
function createApolloClient(initialState = {}) {
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined', // Disables forceFetch on the server (so queries are only run once)
    link: new HttpLink({
      uri: 'https://graphql.datocms.com/', // Server URL (must be absolute)
      headers: {
        authorization:
          'Bearer faeb9172e232a75339242faafb9e56de8c8f13b735f7090964',
      },
      fetch,
    }),
    cache: new InMemoryCache({ fragmentMatcher }).restore(initialState),
  });
}

export function performQuery(query, propsToVars, convertData) {
  return async props => {
    const apolloClient = initApolloClient();

    const variables = typeof propsToVars === 'function' ? propsToVars(props) : propsToVars;

    const { data } = await apolloClient.query({
      query,
      variables,
    });

    const result = typeof convertData === 'function' ? convertData(data, props, variables) : data;

    return result;
  };
}

export function gqlStaticPaths(query, paramName, dataToParams) {
  return performQuery(query, null, data =>
    dataToParams(data).map(param => ({
      params: {
        [paramName]: Array.isArray(param) ? param : param.toString(),
      },
    })),
  );
}

export function gqlStaticProps(query, paramsToVars, dataToProps) {
  return performQuery(
    query,
    ({ params }) =>
      typeof paramsToVars === 'function' ? paramsToVars(params) : params,
    (data, props, variables) => ({
      props: typeof dataToProps === 'function' ? dataToProps(data, { params: props.params, variables }) : data,
    }),
  );
}

export const imageFields = gql`
  fragment imageFields on ResponsiveImage {
    aspectRatio
    base64
    height
    sizes
    src
    srcSet
    webpSrcSet
    width
    alt
    title
  }
`;

export const seoMetaTagsFields = gql`
  fragment seoMetaTagsFields on Tag {
    attributes
    content
    tag
  }
`;
