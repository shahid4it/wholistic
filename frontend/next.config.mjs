/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects() {
    return [
      {
        source: "/resources/horoscope",
        destination: "/resources/horoscope/Aries",
        permanent: true,
      },
    ];
  },
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
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
