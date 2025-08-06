import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'

const guides = [
  {
    href: '/getting-started',
    name: '系統登入',
    description: '了解如何登入 AMIGO 後台系統並熟悉基本操作介面。',
  },
  {
    href: '/device-management',
    name: '設備管理',
    description: '學習如何監控和管理您的自動販賣機設備。',
  },
  {
    href: '/product-management',
    name: '商品管理',
    description: '掌握商品上架、庫存管理和價格設定的操作方法。',
  },
  {
    href: '/financial-reports',
    name: '財務報表',
    description: '了解如何查看和分析營收、成本和利潤數據。',
  },
]

export function Guides() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="guides">
        操作指南
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 sm:grid-cols-2 xl:grid-cols-4 dark:border-white/5">
        {guides.map((guide) => (
          <div key={guide.href}>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {guide.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {guide.description}
            </p>
            <p className="mt-4">
              <Button href={guide.href} variant="text" arrow="right">
                了解更多
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
