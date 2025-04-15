/** @type {import('next').NextConfig} */
const nextConfig = {
  // Simplificar la configuración de PWA
  async rewrites() {
    return [
      {
        source: '/manifest.json',
        destination: '/api/manifest',
      }
    ];
  },
  // Eliminar la configuración de webpack que podría estar causando problemas
  webpack: (config, { isServer }) => {
    return config;
  },
};

export default nextConfig;
