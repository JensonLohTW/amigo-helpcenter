'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ClipboardDocumentIcon,
  ArrowPathIcon,
  CheckIcon,
  EyeDropperIcon,
} from '@heroicons/react/24/outline'

interface ColorFormat {
  hex: string
  rgb: string
  hsl: string
  rgba: string
  hsla: string
}

export default function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState('#3B82F6') // AMIGO 藍色
  const [colorFormats, setColorFormats] = useState<ColorFormat>({
    hex: '#3B82F6',
    rgb: 'rgb(59, 130, 246)',
    hsl: 'hsl(217, 91%, 60%)',
    rgba: 'rgba(59, 130, 246, 1)',
    hsla: 'hsla(217, 91%, 60%, 1)',
  })
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)

  // 顏色轉換函數
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max === min) {
      h = s = 0 // achromatic
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  // 更新所有顏色格式
  const updateColorFormats = (hex: string) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

    setColorFormats({
      hex: hex.toUpperCase(),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
      hsla: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`,
    })
  }

  // 當選中顏色改變時更新格式
  useEffect(() => {
    updateColorFormats(selectedColor)
  }, [selectedColor])

  // 複製顏色值
  const copyColor = async (format: keyof ColorFormat) => {
    try {
      await navigator.clipboard.writeText(colorFormats[format])
      setCopiedFormat(format)
      setTimeout(() => setCopiedFormat(null), 2000)
    } catch (err) {
      console.error('複製失敗:', err)
    }
  }

  // 生成隨機顏色
  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    setSelectedColor(randomColor)
  }

  // 預設顏色調色板
  const colorPalette = [
    '#3B82F6', // AMIGO 藍色
    '#EF4444', // 紅色
    '#10B981', // 綠色
    '#F59E0B', // 黃色
    '#8B5CF6', // 紫色
    '#EC4899', // 粉色
    '#06B6D4', // 青色
    '#84CC16', // 萊姆綠
    '#F97316', // 橙色
    '#6B7280', // 灰色
    '#1F2937', // 深灰
    '#FFFFFF', // 白色
  ]

  // AMIGO 品牌色彩
  const brandColors = [
    { name: 'AMIGO 主藍', color: '#3B82F6' },
    { name: 'AMIGO 深藍', color: '#1E40AF' },
    { name: 'AMIGO 淺藍', color: '#60A5FA' },
    { name: '成功綠', color: '#10B981' },
    { name: '警告黃', color: '#F59E0B' },
    { name: '錯誤紅', color: '#EF4444' },
  ]

  return (
    <div className="space-y-4">
      {/* 主要顏色選擇器 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          選擇顏色:
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="h-12 w-12 rounded-lg border border-gray-300 cursor-pointer dark:border-gray-600"
          />
          <div className="flex-1">
            <input
              type="text"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
              placeholder="#000000"
            />
          </div>
          <motion.button
            onClick={generateRandomColor}
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title="隨機顏色"
          >
            <ArrowPathIcon className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* 顏色預覽 */}
      <div className="rounded-lg border border-gray-300 p-4 dark:border-gray-600">
        <div
          className="h-20 w-full rounded-lg shadow-inner"
          style={{ backgroundColor: selectedColor }}
        />
      </div>

      {/* 顏色格式 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          顏色格式:
        </label>
        <div className="space-y-2">
          {Object.entries(colorFormats).map(([format, value]) => (
            <div key={format} className="flex items-center space-x-2">
              <div className="w-12 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {format}
              </div>
              <input
                type="text"
                value={value}
                readOnly
                className="flex-1 rounded border border-gray-300 bg-gray-50 px-2 py-1 text-xs font-mono dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <motion.button
                onClick={() => copyColor(format as keyof ColorFormat)}
                className="flex items-center justify-center rounded border border-gray-300 bg-white px-2 py-1 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {copiedFormat === format ? (
                  <CheckIcon className="h-3 w-3 text-green-500" />
                ) : (
                  <ClipboardDocumentIcon className="h-3 w-3" />
                )}
              </motion.button>
            </div>
          ))}
        </div>
      </div>

      {/* AMIGO 品牌色彩 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          AMIGO 品牌色彩:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {brandColors.map((brand, index) => (
            <button
              key={index}
              onClick={() => setSelectedColor(brand.color)}
              className="flex flex-col items-center rounded-lg border border-gray-300 p-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors duration-200"
              title={brand.name}
            >
              <div
                className="h-6 w-full rounded"
                style={{ backgroundColor: brand.color }}
              />
              <span className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                {brand.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 常用顏色調色板 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          常用顏色:
        </label>
        <div className="grid grid-cols-6 gap-2">
          {colorPalette.map((color, index) => (
            <button
              key={index}
              onClick={() => setSelectedColor(color)}
              className="h-8 w-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 transition-transform duration-200 hover:scale-110"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
