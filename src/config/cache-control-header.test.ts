import {
  getCacheControlHeader,
  getConfigCacheControlHeader,
  getDataCacheControlHeader,
} from "./cache-control-header";

describe("Cache Control Header", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("getCacheControlHeader", () => {
    it("should generate correct cache control header with given TTL", () => {
      const ttl = 300;
      const expected = `public, max-age=300, s-maxage=300, stale-while-revalidate=3000, stale-if-error=3000`;

      expect(getCacheControlHeader(ttl)).toBe(expected);
    });

    it("should calculate stale time as 10x the TTL", () => {
      const ttl = 60;
      const expected = `public, max-age=60, s-maxage=60, stale-while-revalidate=600, stale-if-error=600`;

      expect(getCacheControlHeader(ttl)).toBe(expected);
    });
  });

  describe("getConfigCacheControlHeader", () => {
    it("should use CONFIG_CACHE_TTL from environment when available", () => {
      process.env.CONFIG_CACHE_TTL = "600";
      const expected = `public, max-age=600, s-maxage=600, stale-while-revalidate=6000, stale-if-error=6000`;

      expect(getConfigCacheControlHeader()).toBe(expected);
    });

    it("should use default TTL of 300 when CONFIG_CACHE_TTL is not set", () => {
      delete process.env.CONFIG_CACHE_TTL;
      const expected = `public, max-age=300, s-maxage=300, stale-while-revalidate=3000, stale-if-error=3000`;

      expect(getConfigCacheControlHeader()).toBe(expected);
    });
  });

  describe("getDataCacheControlHeader", () => {
    it("should use DATA_CACHE_TTL from environment when available", () => {
      process.env.DATA_CACHE_TTL = "900";
      const expected = `public, max-age=900, s-maxage=900, stale-while-revalidate=9000, stale-if-error=9000`;

      expect(getDataCacheControlHeader()).toBe(expected);
    });

    it("should use default TTL of 300 when DATA_CACHE_TTL is not set", () => {
      delete process.env.DATA_CACHE_TTL;
      const expected = `public, max-age=300, s-maxage=300, stale-while-revalidate=3000, stale-if-error=3000`;

      expect(getDataCacheControlHeader()).toBe(expected);
    });
  });
});
