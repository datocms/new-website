import { useQuerySubscription as realUseQuerySubscription } from 'react-datocms';

export function useQuerySubscription(config) {
  return realUseQuerySubscription({
    ...config,
    environment: process.env.NEXT_PUBLIC_DATOCMS_ENVIRONMENT_ID,
  });
}
