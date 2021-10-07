import tiny from 'tiny-json-http';
import handleServerSideError from './handleServerSideError';

export async function request({ query, variables, preview }) {
  const { body } = await tiny.post({
    url: `https://graphql.datocms.com${preview ? '/preview' : '/'}`,
    headers: {
      authorization: `Bearer ${process.env.NEXT_PUBLIC_DATOCMS_READONLY_TOKEN}`,
    },
    data: {
      query,
      variables,
    },
  });

  if (body.errors) {
    console.log(body.errors);

    throw `Invalid GraphQL response! Query: ${JSON.stringify(
      query,
    )}, Variables: ${JSON.stringify(
      variables,
    )}, Preview: ${preview}, Response: ${JSON.stringify(body)}`;
  }

  return body;
}

export function gqlStaticPaths(query, paramName, dataToParams) {
  return async () => {
    const { data } = await request({ query });

    return {
      fallback: 'blocking',
      paths: dataToParams(data).map((param) => ({
        params: {
          [paramName]: Array.isArray(param) ? param : param.toString(),
        },
      })),
    };
  };
}

export const handleErrors = (handler) => {
  return async (context) => {
    try {
      return await handler(context);
    } catch (e) {
      await handleServerSideError(e, context);
    }
  };
};

export function gqlStaticProps(query, { requiredKeys, paramsToVars } = {}) {
  return handleErrors(async ({ params, preview }) => {
    const variables =
      typeof paramsToVars === 'function' ? paramsToVars(params) : params;

    const { data } = await request({
      query,
      variables,
      preview,
    });

    const notFound =
      requiredKeys &&
      requiredKeys.some((key) =>
        Array.isArray(data[key])
          ? data[key].length === 0
          : data[key] === null || data === undefined,
      );

    const props = {
      preview: preview ? true : false,
    };

    return {
      notFound,
      props: { ...data, ...props },
    };
  });
}

export function gqlStaticPropsWithSubscription(
  query,
  { requiredKeys, paramsToVars, revalidate } = {},
) {
  return handleErrors(async ({ params, preview }) => {
    const variables =
      typeof paramsToVars === 'function' ? paramsToVars(params) : params;

    const { data } = await request({
      query,
      variables,
      preview,
    });

    const notFound =
      requiredKeys &&
      requiredKeys.some((key) =>
        Array.isArray(data[key])
          ? data[key].length === 0
          : data[key] === null || data === undefined,
      );

    return {
      notFound,
      revalidate,
      props: {
        preview: preview ? true : false,
        subscription: preview
          ? {
              query,
              token: process.env.NEXT_PUBLIC_DATOCMS_READONLY_TOKEN,
              variables: variables || null,
              preview: true,
              enabled: true,
              initialData: data,
            }
          : { enabled: false, initialData: data },
      },
    };
  });
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
