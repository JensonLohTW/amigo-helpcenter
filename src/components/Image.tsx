'use client'

import NextImage from 'next/image'
import { useState } from 'react'
import clsx from 'clsx'

// 圖片尺寸預設
export const IMAGE_SIZES = {
  xs: { width: 120, height: 80 },
  sm: { width: 240, height: 160 },
  md: { width: 480, height: 320 },
  lg: { width: 720, height: 480 },
  xl: { width: 960, height: 640 },
  full: { width: 1200, height: 800 },
} as const

export type ImageSize = keyof typeof IMAGE_SIZES

// 圖片樣式預設
export const IMAGE_STYLES = {
  default: '',
  rounded: 'rounded-lg',
  'rounded-full': 'rounded-full',
  shadow: 'shadow-lg',
  'shadow-soft': 'shadow-md',
  border: 'border border-gray-200 dark:border-gray-700',
} as const

export type ImageStyle = keyof typeof IMAGE_STYLES

interface ImageProps {
  src: string
  alt: string
  size?: ImageSize | { width: number; height: number }
  style?: ImageStyle | ImageStyle[]
  className?: string
  caption?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onClick?: () => void
}

/**
 * 統一的圖片組件，支援 GitHub Pages 靜態部署
 * 
 * @param src - 圖片路徑（相對於 src/images）
 * @param alt - 圖片替代文字
 * @param size - 圖片尺寸預設或自定義尺寸
 * @param style - 圖片樣式預設
 * @param className - 額外的 CSS 類名
 * @param caption - 圖片說明文字
 * @param priority - 是否優先載入
 * @param quality - 圖片品質 (1-100)
 * @param placeholder - 佔位符類型
 * @param blurDataURL - 模糊佔位符數據 URL
 * @param onClick - 點擊事件處理器
 */
export function Image({
  src,
  alt,
  size = 'md',
  style = 'default',
  className,
  caption,
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  onClick,
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // 處理圖片尺寸
  const dimensions = typeof size === 'string' ? IMAGE_SIZES[size] : size

  // 處理圖片樣式
  const styleClasses = Array.isArray(style)
    ? style.map(s => IMAGE_STYLES[s]).join(' ')
    : IMAGE_STYLES[style]

  // 處理圖片路徑 - 確保與 GitHub Pages 兼容
  const imageSrc = src.startsWith('/') ? src : `/images/${src}`

  // 組合 CSS 類名
  const imageClasses = clsx(
    'transition-opacity duration-300',
    styleClasses,
    {
      'opacity-0': isLoading,
      'opacity-100': !isLoading,
      'cursor-pointer': onClick,
      'hover:opacity-90': onClick,
    },
    className
  )

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <div
        className={clsx(
          'flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
          styleClasses,
          className
        )}
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <div className="text-center">
          <div className="text-2xl mb-2">📷</div>
          <div className="text-sm">圖片載入失敗</div>
        </div>
      </div>
    )
  }

  return (
    <figure className={caption ? 'my-6' : undefined}>
      <div className="relative">
        {isLoading && (
          <div
            className={clsx(
              'absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse',
              styleClasses
            )}
            style={{ width: dimensions.width, height: dimensions.height }}
          />
        )}
        <NextImage
          src={imageSrc}
          alt={alt}
          width={dimensions.width}
          height={dimensions.height}
          className={imageClasses}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          onLoad={handleLoad}
          onError={handleError}
          onClick={onClick}
          unoptimized={process.env.NODE_ENV === 'production'} // GitHub Pages 需要
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// 預設導出
export default Image
