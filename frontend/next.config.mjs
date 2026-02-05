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
    domains: ["195.35.56.144", "localhost"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
