/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Proxy all /api/* calls to FastAPI backend
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
      // Proxy /metrics to Prometheus endpoint on FastAPI backend
      {
        source: '/metrics',
        destination: 'http://127.0.0.1:8000/metrics',
      },
    ]
  },
}
module.exports = nextConfig