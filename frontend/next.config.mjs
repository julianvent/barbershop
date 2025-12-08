/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:slug*",
        destination: "http://backend:8000/:slug*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/signin",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/dashboard/appointments",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
