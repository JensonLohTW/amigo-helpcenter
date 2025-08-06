'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  HomeIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  KeyIcon,
  QrCodeIcon,
  CalculatorIcon,
  ClockIcon,
  SwatchIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'

interface SocialCard {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  onClick?: () => void
  color: string
  hoverColor: string
}

interface SocialFloatingToolbarProps {
  onToolSelect?: (toolId: string) => void
}

export default function SocialFloatingToolbar({ onToolSelect }: SocialFloatingToolbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 點擊外部區域關閉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setHoveredCard(null)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // ESC 鍵關閉
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setHoveredCard(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const cards: SocialCard[] = [
    {
      id: 'home',
      name: '首頁',
      icon: HomeIcon,
      href: '/',
      color: '#3b82f6',
      hoverColor: '#2563eb',
    },
    {
      id: 'getting-started',
      name: '系統登入',
      icon: DocumentTextIcon,
      href: '/getting-started',
      color: '#10b981',
      hoverColor: '#059669',
    },
    {
      id: 'support',
      name: '技術支援',
      icon: QuestionMarkCircleIcon,
      href: '/support',
      color: '#f59e0b',
      hoverColor: '#d97706',
    },
    {
      id: 'password',
      name: '密碼生成器',
      icon: KeyIcon,
      onClick: () => onToolSelect?.('password'),
      color: '#8b5cf6',
      hoverColor: '#7c3aed',
    },
    {
      id: 'qrcode',
      name: 'QR碼生成器',
      icon: QrCodeIcon,
      onClick: () => onToolSelect?.('qrcode'),
      color: '#ec4899',
      hoverColor: '#db2777',
    },
    {
      id: 'calculator',
      name: '計算器',
      icon: CalculatorIcon,
      onClick: () => onToolSelect?.('calculator'),
      color: '#06b6d4',
      hoverColor: '#0891b2',
    },
    {
      id: 'timestamp',
      name: '時間戳轉換',
      icon: ClockIcon,
      onClick: () => onToolSelect?.('timestamp'),
      color: '#84cc16',
      hoverColor: '#65a30d',
    },
    {
      id: 'color',
      name: '顏色選擇器',
      icon: SwatchIcon,
      onClick: () => onToolSelect?.('color'),
      color: '#f97316',
      hoverColor: '#ea580c',
    },
    {
      id: 'tools',
      name: '更多工具',
      icon: WrenchScrewdriverIcon,
      onClick: () => console.log('更多工具'),
      color: '#6b7280',
      hoverColor: '#4b5563',
    },
  ]

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        opacity: { duration: 0.3 }
      }}
    >
      <div ref={containerRef} className="relative">
        {/* 主容器 */}
        <motion.div
          className="relative flex flex-wrap items-center justify-center cursor-pointer"
          animate={{
            width: isOpen ? '14rem' : '3.5rem',
            height: isOpen ? '14rem' : '3.5rem',
          }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 25,
            mass: 0.8
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* 背景漸變 */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: 'linear-gradient(45deg, #2563eb, #7c3aed, #db2777, #f59e0b)',
              backgroundSize: '300% 300%',
              transform: 'rotate(90deg)',
              filter: 'blur(8px)',
              boxShadow: 'inset 0px 0px 120px 10px rgba(0, 0, 0, 0.2)',
            }}
            animate={{
              opacity: isOpen ? 0 : 1,
              backgroundPosition: isOpen ? '100% 100%' : '0% 0%',
            }}
            transition={{
              opacity: { duration: 0.5, ease: 'easeInOut' },
              backgroundPosition: { duration: 2, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }
            }}
          />

          {/* 展開狀態背景 */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            animate={{
              opacity: isOpen ? 1 : 0,
              scale: isOpen ? 1 : 0.9,
            }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          />

          {/* 卡片網格 */}
          <AnimatePresence>
            {isOpen && (
              <div className="grid grid-cols-3 gap-0 w-full h-full relative z-10">
                {cards.map((card, index) => {
                  const IconComponent = card.icon
                  const borderRadius = 
                    index === 0 ? '10px 0 0 0' :
                    index === 2 ? '0 10px 0 0' :
                    index === 6 ? '0 0 0 10px' :
                    index === 8 ? '0 0 10px 0' : '0'

                  return (
                    <motion.div
                      key={card.id}
                      className="relative"
                      initial={{ opacity: 0, scale: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: {
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                          delay: index * 0.08
                        }
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0,
                        y: -10,
                        transition: {
                          duration: 0.2,
                          delay: (8 - index) * 0.03
                        }
                      }}
                    >
                      {card.href ? (
                        <Link
                          href={card.href}
                          className="group relative flex items-center justify-center w-full h-16 bg-gray-900/90 backdrop-blur-sm border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-white/50 dark:bg-gray-800/90 shadow-lg overflow-hidden"
                          style={{ borderRadius }}
                          onMouseEnter={() => setHoveredCard(card.id)}
                          onMouseLeave={() => setHoveredCard(null)}
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsOpen(false)
                          }}
                        >
                          {/* 背景色過渡層 */}
                          <motion.div
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: hoveredCard === card.id ? 1 : 0,
                              background: hoveredCard === card.id ? card.color : 'transparent',
                            }}
                            transition={{
                              duration: 0.3,
                              ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                          />

                          {/* 圖標容器 */}
                          <motion.div
                            className="relative z-10 flex items-center justify-center w-full h-full"
                            animate={{
                              scale: hoveredCard === card.id ? 1.1 : 1,
                            }}
                            transition={{
                              type: 'spring',
                              stiffness: 400,
                              damping: 25
                            }}
                          >
                            <motion.div
                              animate={{
                                rotate: hoveredCard === card.id ? [0, -5, 5, 0] : 0,
                              }}
                              transition={{
                                duration: 0.5,
                                ease: 'easeInOut'
                              }}
                            >
                              <IconComponent className="w-6 h-6 text-white drop-shadow-lg filter" />
                            </motion.div>
                          </motion.div>

                          {/* 光暈效果 */}
                          <motion.div
                            className="absolute inset-0 opacity-0"
                            style={{
                              background: `radial-gradient(circle at center, ${card.color}40 0%, transparent 70%)`,
                            }}
                            animate={{
                              opacity: hoveredCard === card.id ? 1 : 0,
                              scale: hoveredCard === card.id ? 1.2 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="group relative flex items-center justify-center w-full h-16 bg-gray-900/90 backdrop-blur-sm border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-white/50 dark:bg-gray-800/90 shadow-lg overflow-hidden"
                          style={{ borderRadius }}
                          onMouseEnter={() => setHoveredCard(card.id)}
                          onMouseLeave={() => setHoveredCard(null)}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (card.onClick) {
                              card.onClick()
                              setIsOpen(false)
                            }
                          }}
                        >
                          {/* 背景色過渡層 */}
                          <motion.div
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: hoveredCard === card.id ? 1 : 0,
                              background: hoveredCard === card.id ? card.color : 'transparent',
                            }}
                            transition={{
                              duration: 0.3,
                              ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                          />

                          {/* 圖標容器 */}
                          <motion.div
                            className="relative z-10 flex items-center justify-center w-full h-full"
                            animate={{
                              scale: hoveredCard === card.id ? 1.1 : 1,
                            }}
                            transition={{
                              type: 'spring',
                              stiffness: 400,
                              damping: 25
                            }}
                          >
                            <motion.div
                              animate={{
                                rotate: hoveredCard === card.id ? [0, -5, 5, 0] : 0,
                              }}
                              transition={{
                                duration: 0.5,
                                ease: 'easeInOut'
                              }}
                            >
                              <IconComponent className="w-6 h-6 text-white drop-shadow-lg filter" />
                            </motion.div>
                          </motion.div>

                          {/* 光暈效果 */}
                          <motion.div
                            className="absolute inset-0 opacity-0"
                            style={{
                              background: `radial-gradient(circle at center, ${card.color}40 0%, transparent 70%)`,
                            }}
                            animate={{
                              opacity: hoveredCard === card.id ? 1 : 0,
                              scale: hoveredCard === card.id ? 1.2 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </button>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}
          </AnimatePresence>

          {/* 中央提示文字 */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            animate={{
              opacity: isOpen ? 0 : 1,
              scale: isOpen ? 0.8 : 1,
            }}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <motion.div
              className="text-white text-xs font-bold text-center leading-tight tracking-wider"
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop'
              }}
            >
              {isOpen ? (
                <>點擊<br />關閉<br />工具</>
              ) : (
                <>點擊<br />打開<br />工具</>
              )}
            </motion.div>
          </motion.div>

          {/* 脈衝效果 */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            animate={{
              scale: isOpen ? 0 : [1, 1.2, 1],
              opacity: isOpen ? 0 : [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'loop'
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
