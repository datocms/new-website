import gql from 'graphql-tag';
import tiny from 'tiny-json-http';

export async function request({ query, variables }) {
  const { body } = await tiny.post({
    url: `https://graphql.datocms.com/preview`,
    headers: {
      authorization:
          'Bearer faeb9172e232a75339242faafb9e56de8c8f13b735f7090964',
    },
    data: {
      query: query.loc && query.loc.source.body,
      variables,
    }
  });

  return body;
}

export function performQuery(query, propsToVars, convertData) {
  return async props => {
    const variables = typeof propsToVars === 'function' ? propsToVars(props) : propsToVars;

    const { data } = await request({
      query,
      variables,
    });

    const result = typeof convertData === 'function' ? convertData(data, props, variables) : data;

    return result;
  };
}

export function gqlStaticPaths(query, paramName, dataToParams) {
  return performQuery(query, null, data => ({
    paths: dataToParams(data).map(param => ({
      params: {
        [paramName]: Array.isArray(param) ? param : param.toString(),
      },
    })),
  }));
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
