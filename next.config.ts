import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: 'security',
  },
  agentRules: false,
  images: {
    localPatterns: [{ pathname: '/media/**' }, { pathname: '/brand/**' }, { pathname: '/shop/**' }],
  },
}

export default nextConfig
