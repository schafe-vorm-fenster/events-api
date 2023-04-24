export const ConfigCacheControlHeader: string = `public, max-age=${
  process.env.CONFIG_CACHE_MAX_AGE || 300
}, s-maxage=${
  process.env.CONFIG_CACHE_MAX_AGE || 300
}, stale-while-revalidate=${
  process.env.CONFIG_CACHE_STALE_WHILE_REVALIDATE || 60
}, stale-if-error=${process.env.CONFIG_CACHE_STALE_WHILE_REVALIDATE || 60}`;
