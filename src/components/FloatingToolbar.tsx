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
      {/* 懸浮按鈕 */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
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

      {/* 工具欄面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={toolbarRef}
            className="fixed bottom-24 right-6 z-40 w-80 max-w-[calc(100vw-3rem)]"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-white dark:ring-opacity-10">
              {activeTool ? (
                // 顯示選中的工具
                <div className="p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <button
                      onClick={handleBackToMenu}
                      className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      ← 返回工具列表
                    </button>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {tools.find(tool => tool.id === activeTool)?.name}
                    </h3>
                  </div>
                  {ActiveToolComponent && <ActiveToolComponent />}
                </div>
              ) : (
                // 顯示工具列表
                <div className="p-4">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    實用工具
                  </h3>
                  <div className="space-y-2">
                    {tools.map((tool) => {
                      const IconComponent = tool.icon
                      return (
                        <button
                          key={tool.id}
                          onClick={() => handleToolSelect(tool.id)}
                          className="flex w-full items-center rounded-lg p-3 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-700 transition-colors duration-150"
                        >
                          <IconComponent className="mr-3 h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {tool.name}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
