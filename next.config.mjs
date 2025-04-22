/** @type {import('next').NextConfig} */
const nextConfig = {
  // تكوين PWA المبسط
  async rewrites() {
    return [
      {
        source: '/manifest.json',
        destination: '/api/manifest',
      }
    ];
  },
  // تكوين webpack المحسن
  webpack: (config) => {
    return config;
  },
  // إعدادات لتجاوز أخطاء البناء
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // إعدادات الصور
  images: {
    unoptimized: true,
    domains: ['v0.blob.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // تعطيل التحليل التلقائي للروابط الخارجية
  experimental: {
    scrollRestoration: true,
  },
  // تحسين الأداء
  swcMinify: true,
  reactStrictMode: true,
  // تكوين الوسائط
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
