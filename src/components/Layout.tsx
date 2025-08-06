'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Logo } from '@/components/Logo'
import { Navigation } from '@/components/Navigation'
import { SectionProvider, type Section } from '@/components/SectionProvider'
import { useSidebarStore } from '@/lib/sidebar-store'

// 側邊欄收齊按鈕組件
function SidebarToggle() {
  const { isCollapsed, toggle } = useSidebarStore()

  return (
    <button
      type="button"
      onClick={toggle}
      className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md transition-colors hover:bg-zinc-900/5 dark:hover:bg-white/5"
      aria-label={isCollapsed ? '展開側邊欄' : '收起側邊欄'}
    >
      <svg
        className="w-4 h-4 stroke-zinc-900 dark:stroke-white"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        {isCollapsed ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        )}
      </svg>
    </button>
  )
}

export function Layout({
  children,
  allSections,
}: {
  children: React.ReactNode
  allSections: Record<string, Array<Section>>
}) {
  const pathname = usePathname()
  const { isCollapsed } = useSidebarStore()

  return (
    <SectionProvider sections={allSections[pathname] ?? []}>
      <div className={`h-full transition-all duration-300 ${isCollapsed ? 'lg:ml-16' : 'lg:ml-72 xl:ml-80'}`}>
        <motion.header
          layoutScroll
          className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
        >
          <div className={`contents lg:pointer-events-auto lg:block lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:pt-4 lg:pb-8 lg:dark:border-white/10 transition-all duration-300 ${
            isCollapsed ? 'lg:w-16 lg:px-3' : 'lg:w-72 lg:px-6 xl:w-80'
          }`}>
            {/* 簡化的側邊欄頂部 - 只保留 AMIGO 品牌標識和收齊按鈕 */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <Link href="/" aria-label="Home" className={`transition-all duration-300 ${isCollapsed ? 'mx-auto' : ''}`}>
                <Logo className="h-6" />
              </Link>
              {!isCollapsed && <SidebarToggle />}
            </div>
            {isCollapsed && (
              <div className="hidden lg:flex justify-center mb-2">
                <SidebarToggle />
              </div>
            )}
            <Navigation className="hidden lg:mt-4 lg:block" />
          </div>
        </motion.header>
        <Header />
        <div className="relative flex h-full flex-col px-4 pt-14 sm:px-6 lg:px-8">
          <main className="flex-auto">{children}</main>
          <Footer />
        </div>
      </div>
    </SectionProvider>
  )
}
