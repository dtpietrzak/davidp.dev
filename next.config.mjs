/** @type {import('next').NextConfig} */
import pwa from 'next-pwa'
const withPWA = pwa({
  dest: 'public',
})

const nextConfig = withPWA({
  // next.js config
})

export default nextConfig
