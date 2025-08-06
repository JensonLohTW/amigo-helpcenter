'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ClipboardDocumentIcon,
  ArrowPathIcon,
  CheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('')
  const [datetime, setDatetime] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [copiedTimestamp, setCopiedTimestamp] = useState(false)
  const [copiedDatetime, setCopiedDatetime] = useState(false)

  // 更新當前時間
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 時間戳轉日期時間
  const timestampToDatetime = (ts: string) => {
    if (!ts.trim()) {
      setDatetime('')
      return
    }

    try {
      const timestamp = parseInt(ts)
      if (isNaN(timestamp)) {
        setDatetime('無效的時間戳')
        return
      }

      // 判斷是秒還是毫秒時間戳
      const date = timestamp.toString().length === 10 
        ? new Date(timestamp * 1000) 
        : new Date(timestamp)

      if (isNaN(date.getTime())) {
        setDatetime('無效的時間戳')
        return
      }

      // 格式化為本地時間
      const formatted = date.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      })

      setDatetime(formatted)
    } catch (error) {
      setDatetime('轉換失敗')
    }
  }

  // 日期時間轉時間戳
  const datetimeToTimestamp = (dt: string) => {
    if (!dt.trim()) {
      setTimestamp('')
      return
    }

    try {
      const date = new Date(dt)
      if (isNaN(date.getTime())) {
        setTimestamp('無效的日期時間')
        return
      }

      const timestamp = Math.floor(date.getTime() / 1000)
      setTimestamp(timestamp.toString())
    } catch (error) {
      setTimestamp('轉換失敗')
    }
  }

  // 使用當前時間
  const useCurrentTime = () => {
    const now = new Date()
    const timestamp = Math.floor(now.getTime() / 1000)
    const datetime = now.toISOString().slice(0, 16) // YYYY-MM-DDTHH:mm格式

    setTimestamp(timestamp.toString())
    setDatetime(datetime)
  }

  // 複製時間戳
  const copyTimestamp = async () => {
    if (!timestamp || timestamp === '無效的日期時間' || timestamp === '轉換失敗') return

    try {
      await navigator.clipboard.writeText(timestamp)
      setCopiedTimestamp(true)
      setTimeout(() => setCopiedTimestamp(false), 2000)
    } catch (err) {
      console.error('複製失敗:', err)
    }
  }

  // 複製日期時間
  const copyDatetime = async () => {
    if (!datetime || datetime === '無效的時間戳' || datetime === '轉換失敗') return

    try {
      await navigator.clipboard.writeText(datetime)
      setCopiedDatetime(true)
      setTimeout(() => setCopiedDatetime(false), 2000)
    } catch (err) {
      console.error('複製失敗:', err)
    }
  }

  // 常用時間戳模板
  const timeTemplates = [
    { name: '現在', getValue: () => Math.floor(Date.now() / 1000) },
    { name: '今天開始', getValue: () => Math.floor(new Date().setHours(0, 0, 0, 0) / 1000) },
    { name: '今天結束', getValue: () => Math.floor(new Date().setHours(23, 59, 59, 999) / 1000) },
    { name: '一週前', getValue: () => Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000) },
    { name: '一個月前', getValue: () => Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000) },
  ]

  return (
    <div className="space-y-4">
      {/* 當前時間顯示 */}
      <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
        <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
          <ClockIcon className="mr-2 h-4 w-4" />
          當前時間
        </div>
        <div className="mt-1 font-mono text-sm text-blue-900 dark:text-blue-100">
          {currentTime.toLocaleString('zh-TW')}
        </div>
        <div className="font-mono text-xs text-blue-600 dark:text-blue-400">
          時間戳: {Math.floor(currentTime.getTime() / 1000)}
        </div>
      </div>

      {/* 時間戳輸入 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          時間戳 (Unix Timestamp):
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={timestamp}
            onChange={(e) => {
              setTimestamp(e.target.value)
              timestampToDatetime(e.target.value)
            }}
            placeholder="輸入時間戳 (秒或毫秒)"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
          />
          <motion.button
            onClick={copyTimestamp}
            disabled={!timestamp || timestamp === '無效的日期時間' || timestamp === '轉換失敗'}
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {copiedTimestamp ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ClipboardDocumentIcon className="h-4 w-4" />
            )}
          </motion.button>
        </div>
      </div>

      {/* 日期時間輸入 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          日期時間:
        </label>
        <div className="flex space-x-2">
          <input
            type="datetime-local"
            value={datetime.includes('T') ? datetime : ''}
            onChange={(e) => {
              setDatetime(e.target.value)
              datetimeToTimestamp(e.target.value)
            }}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
          />
          <motion.button
            onClick={copyDatetime}
            disabled={!datetime || datetime === '無效的時間戳' || datetime === '轉換失敗'}
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {copiedDatetime ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ClipboardDocumentIcon className="h-4 w-4" />
            )}
          </motion.button>
        </div>
      </div>

      {/* 轉換結果顯示 */}
      {datetime && !datetime.includes('T') && (
        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            轉換結果:
          </label>
          <div className="font-mono text-sm text-gray-900 dark:text-white">
            {datetime}
          </div>
        </div>
      )}

      {/* 快速模板 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          快速選擇:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {timeTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => {
                const ts = template.getValue().toString()
                setTimestamp(ts)
                timestampToDatetime(ts)
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* 使用當前時間按鈕 */}
      <motion.button
        onClick={useCurrentTime}
        className="w-full flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <ArrowPathIcon className="mr-2 h-4 w-4" />
        使用當前時間
      </motion.button>
    </div>
  )
}
