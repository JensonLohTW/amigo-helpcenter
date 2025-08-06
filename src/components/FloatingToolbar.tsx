'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  WrenchScrewdriverIcon,
  XMarkIcon,
  KeyIcon,
  QrCodeIcon,
  CalculatorIcon,
  ClockIcon,
  SwatchIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

import PasswordGenerator from './tools/PasswordGenerator'
import QRCodeGenerator from './tools/QRCodeGenerator'
import Calculator from './tools/Calculator'
import TimestampConverter from './tools/TimestampConverter'
import ColorPicker from './tools/ColorPicker'

interface Tool {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  component: React.ComponentType
}

// 快捷連結工具
interface QuickLink {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  color: string
  hoverColor: string
}

const quickLinks: QuickLink[] = [
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
]

const tools: Tool[] = [
  {
    id: 'password',
    name: '密碼生成器',
    icon: KeyIcon,
    component: PasswordGenerator,
  },
  {
    id: 'qrcode',
    name: 'QR碼生成器',
    icon: QrCodeIcon,
    component: QRCodeGenerator,
  },
  {
    id: 'calculator',
    name: '快速計算器',
    icon: CalculatorIcon,
    component: Calculator,
  },
  {
    id: 'timestamp',
    name: '時間戳轉換',
    icon: ClockIcon,
    component: TimestampConverter,
  },
  {
    id: 'color',
    name: '顏色選擇器',
    icon: SwatchIcon,
    component: ColorPicker,
  },
]

export default function FloatingToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [showQuickLinks, setShowQuickLinks] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)

  // 處理 ESC 鍵關閉
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (activeTool) {
          setActiveTool(null)
        } else if (isOpen) {
          setIsOpen(false)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, activeTool])

  // 處理點擊外部區域關閉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        if (activeTool) {
          setActiveTool(null)
        } else if (isOpen) {
          setIsOpen(false)
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, activeTool])

  const handleToolSelect = (toolId: string) => {
    setActiveTool(toolId)
  }

  const handleBackToMenu = () => {
    setActiveTool(null)
  }

  const ActiveToolComponent = activeTool 
    ? tools.find(tool => tool.id === activeTool)?.component 
    : null

  return (
    <>
      {/* 社交媒體風格懸浮按鈕 */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="relative">
          {/* 主按鈕容器 */}
          <motion.div
            className="relative flex flex-wrap w-56 items-center justify-center"
            animate={{
              width: isOpen ? '14rem' : '3.5rem',
              height: isOpen ? '14rem' : '3.5rem',
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            onHoverStart={() => setShowQuickLinks(true)}
            onHoverEnd={() => setShowQuickLinks(false)}
          >
            {/* 背景漸變 */}
            <motion.div
              className="absolute inset-0 rounded-lg"
              style={{
                background: 'linear-gradient(270deg, #3b82f6, #8b5cf6, #ec4899)',
                transform: 'rotate(90deg)',
                filter: 'blur(5px)',
                boxShadow: 'inset 0px 0px 180px 5px rgba(255, 255, 255, 0.1)',
              }}
              animate={{
                opacity: isOpen ? 0 : 1,
              }}
              transition={{ duration: 0.4 }}
            />

            {/* 工具卡片 */}
            <AnimatePresence>
              {isOpen && (
                <>
                  {/* 快捷連結 */}
                  {quickLinks.map((link, index) => {
                    const IconComponent = link.icon
                    return (
                      <motion.a
                        key={link.id}
                        href={link.href}
                        className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 transition-all duration-200 hover:bg-white/30"
                        style={{
                          borderRadius: index === 0 ? '10px 0 0 0' :
                                      index === 1 ? '0' :
                                      index === 2 ? '0 10px 0 0' : '0',
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.2 }}
                        whileHover={{
                          backgroundColor: link.color,
                          scale: 1.05,
                        }}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </motion.a>
                    )
                  })}

                  {/* 工具按鈕 */}
                  {tools.map((tool, index) => {
                    const IconComponent = tool.icon
                    const cardIndex = index + quickLinks.length
                    return (
                      <motion.button
                        key={tool.id}
                        onClick={() => handleToolSelect(tool.id)}
                        className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 transition-all duration-200 hover:bg-white/30"
                        style={{
                          borderRadius: cardIndex === 3 ? '0' :
                                      cardIndex === 4 ? '0' :
                                      cardIndex === 5 ? '0' :
                                      cardIndex === 6 ? '0 0 0 10px' :
                                      cardIndex === 7 ? '0' :
                                      cardIndex === 8 ? '0 0 10px 0' : '0',
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ delay: cardIndex * 0.1, duration: 0.2 }}
                        whileHover={{
                          backgroundColor: '#6366f1',
                          scale: 1.05,
                        }}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </motion.button>
                    )
                  })}
                </>
              )}
            </AnimatePresence>

            {/* 中央文字和主按鈕 */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                opacity: isOpen ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white shadow-lg hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 transition-all duration-200"
                aria-label={isOpen ? '關閉工具欄' : '開啟工具欄'}
              >
                <motion.div
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <WrenchScrewdriverIcon className="h-6 w-6" />
                  )}
                </motion.div>
              </button>
            </motion.div>

            {/* 懸停提示文字 */}
            <AnimatePresence>
              {!isOpen && showQuickLinks && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-white text-xs font-bold text-center leading-tight tracking-wider">
                    點擊<br />開啟<br />工具
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      {/* 工具欄面板 */}
      <AnimatePresence>
        {activeTool && (
          <motion.div
            ref={toolbarRef}
            className="fixed bottom-24 right-6 z-40 w-80 max-w-[calc(100vw-3rem)]"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="rounded-lg bg-white/90 backdrop-blur-sm shadow-xl ring-1 ring-black ring-opacity-5 dark:bg-gray-800/90 dark:ring-white dark:ring-opacity-10">
              {/* 顯示選中的工具 */}
              <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <button
                    onClick={handleBackToMenu}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-150"
                  >
                    ← 返回
                  </button>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {tools.find(tool => tool.id === activeTool)?.name}
                  </h3>
                  <button
                    onClick={() => setActiveTool(null)}
                    className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <XMarkIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                {ActiveToolComponent && <ActiveToolComponent />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
