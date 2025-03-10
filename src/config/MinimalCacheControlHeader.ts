const MinimalTTL: number = 5;

export const MinimalCacheControlHeader: string = `public, max-age=${MinimalTTL}, s-maxage=${MinimalTTL}, stale-while-revalidate=${MinimalTTL * 10}, stale-if-error=${MinimalTTL * 10}`;
