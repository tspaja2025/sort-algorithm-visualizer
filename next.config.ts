import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/sort-algorithm-visualizer' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/sort-algorithm-visualizer/' : '',
};

export default nextConfig;
