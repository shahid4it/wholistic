/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
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
