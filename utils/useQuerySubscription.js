import { useQuerySubscription as realUseQuerySubscription } from 'react-datocms';

export function useQuerySubscription(config) {
  return realUseQuerySubscription({
    ...config,
    environment: process.env.NEXT_PUBLIC_DATOCMS_ENVIRONMENT_ID,
    fetcher: (baseUrl, { headers, method, body }) =>
      fetch(baseUrl, {
        headers: {
          ...headers,
          ...(process.env.VERCEL_ENV === 'preview'
            ? {
                'X-Visual-Editing': 'vercel-v1',
                'X-Base-Editing-Url': 'https://cms.datocms.com',
              }
            : {}),
        },
        method,
        body,
      }),
  });
}
