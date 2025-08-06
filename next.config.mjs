import nextMDX from '@next/mdx'

import { recmaPlugins } from './src/mdx/recma.mjs'
import { rehypePlugins } from './src/mdx/rehype.mjs'
import { remarkPlugins } from './src/mdx/remark.mjs'
import withSearch from './src/mdx/search.mjs'

const withMDX = nextMDX({
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins,
  },
})

// 檢查是否為 GitHub Pages 部署
const isGithubPages = process.env.GITHUB_PAGES === 'true'
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 頁面擴展名配置
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],

  // 靜態導出配置 (僅在生產環境使用)
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    images: {
      unoptimized: true,
    },
  }),

  // GitHub Pages 路徑配置
  basePath: isGithubPages && repoName ? `/${repoName}` : '',
  assetPrefix: isGithubPages && repoName ? `/${repoName}/` : '',

  // 文件追蹤配置
  outputFileTracingIncludes: {
    '/**/*': ['./src/app/**/*.mdx'],
  },

  // 禁用 trailing slash (避免 GitHub Pages 路由問題)
  trailingSlash: true,

  // 禁用 x-powered-by header
  poweredByHeader: false,

  // 壓縮配置
  compress: true,

  // 實驗性功能
  experimental: {
    // 優化包導入
    optimizePackageImports: ['@headlessui/react', 'framer-motion'],
  },
}

export default withSearch(withMDX(nextConfig))
