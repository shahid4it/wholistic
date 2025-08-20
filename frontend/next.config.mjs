/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites() {
    return [
      {
        source: "/graphql",
        destination: process.env.STRAPI_GRAPHQL_URL,
      },
    ];
  },
  images: {
    domains: ["127.0.0.1"],
  },
};

export default nextConfig;
