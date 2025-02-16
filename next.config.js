/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // SwaggerUI uses some non-strict React features
  swcMinify: true,
};

module.exports = nextConfig;
