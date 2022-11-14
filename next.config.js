/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  nextConfig,
  images: {
    domains: [
      'firebasestorage.googleapis.com'
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { and: [/\.(js|ts|md|jsx)x?$/] },
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgo: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: {
                        active: false
                      }
                    }
                  }
                }
              ]
            },
            titleProp: true
          }
        }
      ]
    })

    return config
  }
})
