import glob from 'fast-glob'
import { type Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import { type Section } from '@/components/SectionProvider'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - AMIGO 幫助中心',
    default: 'AMIGO 幫助中心 - 自動販賣機後台系統操作手冊',
  },
  description: 'AMIGO 自動販賣機後台系統完整操作手冊，包含系統登入、設備管理、商品管理、財務報表等功能說明，為加盟主提供詳細的使用指南。',
  keywords: ['AMIGO', '自動販賣機', '後台系統', '操作手冊', '加盟主', '設備管理', '商品管理', '財務報表'],
  authors: [{ name: 'AMIGO 開發團隊' }],
  creator: 'AMIGO 開發團隊',
  publisher: 'AMIGO',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    title: 'AMIGO 幫助中心 - 自動販賣機後台系統操作手冊',
    description: 'AMIGO 自動販賣機後台系統完整操作手冊，為加盟主提供詳細的使用指南。',
    siteName: 'AMIGO 幫助中心',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AMIGO 幫助中心 - 自動販賣機後台系統操作手冊',
    description: 'AMIGO 自動販賣機後台系統完整操作手冊，為加盟主提供詳細的使用指南。',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#18181b' },
  ],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let pages = await glob('**/*.mdx', { cwd: 'src/app' })
  let allSectionsEntries = (await Promise.all(
    pages.map(async (filename) => [
      '/' + filename.replace(/(^|\/)page\.mdx$/, ''),
      (await import(`./${filename}`)).sections,
    ]),
  )) as Array<[string, Array<Section>]>
  let allSections = Object.fromEntries(allSectionsEntries)

  return (
    <html lang="zh-TW" className="h-full" suppressHydrationWarning>
      <body className="flex min-h-full bg-white antialiased dark:bg-zinc-900">
        <Providers>
          <div className="w-full">
            <Layout allSections={allSections}>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
