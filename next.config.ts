import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
}
// next.config.js
module.exports = {
  images: {
    domains: ['images.unsplash.com'],
  },
}

export default nextConfig
// import type { NextConfig } from 'next'

// const nextConfig: NextConfig = {
//   images: {
//     domains: ['images.unsplash.com'],
//   },
//   webpack(config) {
//     config.resolve.extensionAlias = {
//       '.js': ['.js', '.ts'],
//       '.mjs': ['.mjs', '.js'],
//     }
//     return config
//   },
// }

// export default nextConfig
