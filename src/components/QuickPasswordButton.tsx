'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { KeyIcon, XMarkIcon } from '@heroicons/react/24/outline'
import PasswordGenerator from './tools/PasswordGenerator'

export default function QuickPasswordButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 快速密碼生成按鈕 */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <KeyIcon className="w-4 h-4" />
        快速生成密碼
      </motion.button>

      {/* 密碼生成器彈窗 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* 彈窗內容 */}
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-51"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* 標題欄 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <KeyIcon className="w-5 h-5 text-blue-600" />
                  密碼生成器
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              {/* 密碼生成器內容 */}
              <div className="p-4">
                <PasswordGenerator />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
