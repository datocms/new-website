import tiny from 'tiny-json-http';

export async function request({ query, variables, preview }) {
  const { body } = await tiny.post({
    url: `https://graphql.datocms.com${preview ? '/preview' : '/'}`,
    headers: {
      authorization:
        'Bearer faeb9172e232a75339242faafb9e56de8c8f13b735f7090964',
    },
    data: {
      query,
      variables,
    },
  });

  if (body.errors) {
    throw body.errors;
  }

  return body;
}

export function gqlStaticPaths(query, paramName, dataToParams) {
  return async () => {
    const { data } = await request({ query });

    const s = {
      fallback: 'blocking',
      paths: dataToParams(data).map((param) => ({
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

    const props = {
      preview: preview ? true : false,
    };

    const returnValue = {
      props:
        typeof dataToProps === 'function'
          ? {
              ...dataToProps(data, { params, variables }),
              ...props,
            }
          : { ...data, ...props },
    };

    return returnValue;
  };
}

export function gqlStaticPropsWithSubscription(query, paramsToVars) {
  return async ({ params, preview }) => {
    const variables =
      typeof paramsToVars === 'function' ? paramsToVars(params) : params;

    const { data } = await request({
      query,
      variables,
      preview,
    });

    return {
      props: {
        preview: preview ? true : false,
        subscription: preview
          ? {
              query,
              token: 'faeb9172e232a75339242faafb9e56de8c8f13b735f7090964',
              variables: variables || null,
              preview: true,
              enabled: true,
              initialData: data,
            }
          : { enabled: false, initialData: data },
      },
    };
  };
}

export const imageFields = `
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

export const seoMetaTagsFields = `
fragment seoMetaTagsFields on Tag {
  attributes
  content
  tag
}
`;

export const reviewFields = `
fragment reviewFields on ReviewRecord {
  name
  role
  quote { value }
  image {
    responsiveImage(imgixParams: { w: 150, h: 150, fit: crop, crop: faces }) {
      ...imageFields
    }
  }
}
`;
