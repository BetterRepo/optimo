/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/create",
        destination: "/features/project-creation",
      },
      {
        source: "/schedule",
        destination: "/features/survey-booking",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/features/project-creation",
        destination: "/create",
        permanent: true,
      },
      {
        source: "/features/survey-booking",
        destination: "/schedule",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig; 