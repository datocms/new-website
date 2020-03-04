import gql from 'graphql-tag';
import tiny from 'tiny-json-http';

export async function request({ query, variables, preview }) {
  const { body } = await tiny.post({
    url: `https://graphql.datocms.com${preview ? '/preview' : '/'}`,
    headers: {
      authorization:
        'Bearer faeb9172e232a75339242faafb9e56de8c8f13b735f7090964',
    },
    data: {
      query: query.loc && query.loc.source.body,
      variables,
    },
  });

  return body;
}

export function gqlStaticPaths(query, paramName, dataToParams) {
  return async () => {
    const { data } = await request({ query });

    const s = {
      fallback: true,
      paths: dataToParams(data).map(param => ({
        params: {
          [paramName]: Array.isArray(param) ? param : param.toString(),
        },
      })),
    };

    return s;
  };
}

export function gqlStaticProps(query, paramsToVars, dataToProps) {
  return async ({ params, preview }) => {
    const variables =
      typeof paramsToVars === 'function' ? paramsToVars(params) : params;

    const { data } = await request({
      query,
      variables,
      preview,
    });

    return {
      props:
        typeof dataToProps === 'function'
          ? dataToProps(data, { params, variables })
          : data,
    };
  };
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
