/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Don't fail build on TS errors during development
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig