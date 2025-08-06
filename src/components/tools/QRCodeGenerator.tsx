'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowDownTrayIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'

export default function QRCodeGenerator() {
  const [text, setText] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 生成QR碼
  const generateQRCode = async (inputText: string) => {
    if (!inputText.trim()) {
      setQrCodeUrl('')
      return
    }

    try {
      // 使用免費的QR碼API服務
      const size = 200
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(inputText)}`
      setQrCodeUrl(url)
    } catch (error) {
      console.error('生成QR碼失敗:', error)
    }
  }

  // 當文字改變時生成QR碼
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateQRCode(text)
    }, 500) // 防抖動，500ms後生成

    return () => clearTimeout(timeoutId)
  }, [text])

  // 下載QR碼
  const downloadQRCode = async () => {
    if (!qrCodeUrl) return

    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `qrcode-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('下載失敗:', error)
    }
  }

  // 複製QR碼圖片
  const copyQRCode = async () => {
    if (!qrCodeUrl) return

    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])
      
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('複製失敗:', error)
      // 如果複製圖片失敗，嘗試複製文字
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (textError) {
        console.error('複製文字也失敗:', textError)
      }
    }
  }

  // 預設模板
  const templates = [
    { name: 'WiFi設定', value: 'WIFI:T:WPA;S:AMIGO-DEVICE;P:password123;H:false;;' },
    { name: '設備配置', value: 'https://amigo.config/device?id=VM001' },
    { name: '聯絡資訊', value: 'BEGIN:VCARD\nVERSION:3.0\nFN:AMIGO技術支援\nTEL:+886-2-1234-5678\nEMAIL:support@amigo.com\nEND:VCARD' },
    { name: '網站連結', value: 'https://amigo-helpcenter.github.io' },
  ]

  const useTemplate = (template: string) => {
    setText(template)
  }

  return (
    <div className="space-y-4">
      {/* 輸入區域 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          輸入要生成QR碼的內容:
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="輸入文字、網址、WiFi設定等..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
          rows={3}
        />
      </div>

      {/* 快速模板 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          快速模板:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {templates.map((template, index) => (
            <button
              key={index}
              onClick={() => useTemplate(template.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* QR碼顯示 */}
      {qrCodeUrl && (
        <div className="text-center">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            生成的QR碼:
          </label>
          <div className="inline-block rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-700">
            <img
              src={qrCodeUrl}
              alt="Generated QR Code"
              className="mx-auto h-48 w-48"
            />
          </div>
        </div>
      )}

      {/* 操作按鈕 */}
      {qrCodeUrl && (
        <div className="flex space-x-2">
          <motion.button
            onClick={copyQRCode}
            className="flex-1 flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {copied ? (
              <>
                <CheckIcon className="mr-2 h-4 w-4" />
                已複製
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="mr-2 h-4 w-4" />
                複製
              </>
            )}
          </motion.button>

          <motion.button
            onClick={downloadQRCode}
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
            下載
          </motion.button>
        </div>
      )}

      {!text.trim() && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          輸入內容後將自動生成QR碼
        </div>
      )}
    </div>
  )
}
