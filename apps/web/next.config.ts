import type { NextConfig } from 'next'

const config: NextConfig = {
  // @tiny/core ships TypeScript source rather than a build step.
  transpilePackages: ['@tiny/core'],
  // pg opens sockets, and the AWS SDK is large and resolves its own runtime
  // config — neither should be bundled.
  serverExternalPackages: ['pg', '@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner'],
  eslint: { ignoreDuringBuilds: true },
}

export default config
