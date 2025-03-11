export const getCacheControlHeader = (ttl: number): string => {
  const staleTime = ttl * 10;
  return `public, max-age=${ttl}, s-maxage=${ttl}, stale-while-revalidate=${staleTime}, stale-if-error=${staleTime}`;
};

/**
 * Cache control header for static config responses
 * @returns
 */
export const getConfigCacheControlHeader = (): string => {
  const ttl = process.env.CONFIG_CACHE_TTL || 300;
  return getCacheControlHeader(Number(ttl));
};

/**
 * Cache control header for dynamic data responses
 * @returns
 */
export const getDataCacheControlHeader = (): string => {
  const ttl = process.env.DATA_CACHE_TTL || 300;
  return getCacheControlHeader(Number(ttl));
};

/**
 * Cache ttl for health check responses, should be low but any to avoid spamming the service
 * @returns
 */
export const getConfigCacheTTL = (): number => {
  return Number(process.env.CONFIG_CACHE_TTL || 5);
};
