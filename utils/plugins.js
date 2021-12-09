import { useCallback } from 'react';

export function useGenerateUrl(router) {
  return useCallback(
    (url, additionalParams = {}) => {
      const params = new URLSearchParams(router.asPath.split('?')[1]);
      Object.entries(additionalParams).forEach(([k, v]) => {
        params.set(k, v);
      });
      if (params.toString()) {
        return `${url}?${params.toString()}`;
      }
      return url;
    },
    [router.asPath],
  );
}
