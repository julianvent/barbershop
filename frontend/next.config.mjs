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
};

export default nextConfig;
