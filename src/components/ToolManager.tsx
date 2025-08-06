'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'

import PasswordGenerator from './tools/PasswordGenerator'
import QRCodeGenerator from './tools/QRCodeGenerator'
import Calculator from './tools/Calculator'
import TimestampConverter from './tools/TimestampConverter'
import ColorPicker from './tools/ColorPicker'
import SocialFloatingToolbar from './SocialFloatingToolbar'

interface Tool {
  id: string
  name: string
  component: React.ComponentType
}

const tools: Tool[] = [
  {
    id: 'password',
    name: '密碼生成器',
    component: PasswordGenerator,
  },
  {
    id: 'qrcode',
    name: 'QR碼生成器',
    component: QRCodeGenerator,
  },
  {
    id: 'calculator',
    name: '快速計算器',
    component: Calculator,
  },
  {
    id: 'timestamp',
    name: '時間戳轉換',
    component: TimestampConverter,
  },
  {
    id: 'color',
    name: '顏色選擇器',
    component: ColorPicker,
  },
]

export default function ToolManager() {
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  // 處理 ESC 鍵關閉
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeTool) {
        setActiveTool(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeTool])

  // 處理點擊外部區域關閉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setActiveTool(null)
      }
    }

    if (activeTool) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeTool])

  const handleToolSelect = (toolId: string) => {
    setActiveTool(toolId)
  }

  const handleCloseTool = () => {
    setActiveTool(null)
  }

  const ActiveToolComponent = activeTool 
    ? tools.find(tool => tool.id === activeTool)?.component 
    : null

  return (
    <>
      {/* 社交媒體風格懸浮工具欄 */}
      <SocialFloatingToolbar onToolSelect={handleToolSelect} />

      {/* 工具面板 */}
      <AnimatePresence mode="wait">
        {activeTool && (
          <motion.div
            ref={toolbarRef}
            className="fixed bottom-24 right-6 z-40 w-80 max-w-[calc(100vw-3rem)]"
            initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: -15 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              rotateX: 0,
              transition: {
                type: 'spring',
                stiffness: 300,
                damping: 25,
                opacity: { duration: 0.2 }
              }
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 20,
              rotateX: 10,
              transition: {
                duration: 0.2,
                ease: 'easeInOut'
              }
            }}
          >
            <div className="floating-toolbar-panel rounded-xl bg-white/98 backdrop-blur-sm shadow-2xl ring-1 ring-black/5 dark:bg-gray-900/98 dark:ring-white/10 overflow-hidden">
              {/* 工具標題欄 */}
              <motion.div
                className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <motion.h3
                  className="text-lg font-semibold text-gray-900 dark:text-white"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {tools.find(tool => tool.id === activeTool)?.name}
                </motion.h3>
                <motion.button
                  onClick={handleCloseTool}
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-95"
                  aria-label="關閉工具"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </motion.button>
              </motion.div>

              {/* 工具內容 */}
              <motion.div
                className="p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {ActiveToolComponent && <ActiveToolComponent />}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
