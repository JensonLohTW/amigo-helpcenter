import { Button } from '@/components/Button'
import { HeroPattern } from '@/components/HeroPattern'

export default function NotFound() {
  return (
    <>
      <HeroPattern />
      <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-semibold text-zinc-900 dark:text-white">
          404
        </p>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
          頁面未找到
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
          抱歉，我們找不到您要訪問的頁面。
        </p>
        <Button href="/" arrow="right" className="mt-8">
          返回首頁
        </Button>
      </div>
    </>
  )
}
