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
      // the CMS menu links "Online Classes" to /lecture, but the category is "online-classes"
      {
        source: "/resources/lecture",
        destination: "/resources/online-classes",
        permanent: false,
      },
      // the Resources menu item is a link too, but has no page of its own
      {
        source: "/resources",
        destination: "/resources/blog",
        permanent: false,
      },
    ];
  },
  rewrites() {
    return [
      {
        source: "/graphql",
        destination: `${process.env.STRAPI_URL}/graphql`,
      },
      {
        source: "/strapi/:path*",
        destination: `${process.env.STRAPI_URL}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "195.35.56.144" },
      { protocol: "https", hostname: "195.35.56.144" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
