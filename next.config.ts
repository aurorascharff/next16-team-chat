import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    useOffline: true,
  },
  partialPrefetching: true,
  reactCompiler: true,
  typedRoutes: true,
}

export default nextConfig
