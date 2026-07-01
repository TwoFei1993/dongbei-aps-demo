import type { NextConfig } from 'next'
// Next.js 15.4.0 — pinned per project spec; see CVE-2025-66478 for upgrade notes
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}
export default nextConfig
