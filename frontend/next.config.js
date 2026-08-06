/** @type {import('next').NextConfig} */
const backendUrl = process.env.BACKEND_URL || (process.env.VERCEL === '1' ? 'https://testtime-api.onrender.com' : 'http://localhost:4000');

const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
