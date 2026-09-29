import type { NextConfig } from 'next'

const SECURITY_HEADERS = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const config: NextConfig = {
  assetPrefix: process.env.NEXT_PUBLIC_STATIC_BASE_URL || undefined,
  crossOrigin: process.env.NEXT_PUBLIC_STATIC_BASE_URL ? 'anonymous' : undefined,
  transpilePackages: ['@tiny/core'],
  serverExternalPackages: ['pg', '@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner'],
  eslint: { ignoreDuringBuilds: true },
  poweredByHeader: false,
  expireTime: 3600,
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }]
  },
}

export default config
