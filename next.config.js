/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // SwaggerUI uses some non-strict React features
  experimental: {
    useCache: true,
    dynamicIO: true,
    cacheLife: {
      classification: {
        stale: 3600, // 1 hour
        revalidate: 900, // 15 minutes
        expire: 3600, // 1 hour, just to reduce http traffic
      },
      translation: {
        stale: 3600, // 1 hour
        revalidate: 900, // 15 minutes
        expire: 3600, // 1 hour, just to reduce http traffic
      },
      geo: {
        stale: 3600, // 1 hour
        revalidate: 900, // 15 minutes
        expire: 3600, // 1 hour, just to reduce http traffic
      },
    },
  },

};

module.exports = nextConfig;
