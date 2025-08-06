'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { Image, ImageSize, ImageStyle } from './Image'

interface GalleryImage {
  src: string
  alt: string
  caption?: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
  columns?: 2 | 3 | 4
  size?: ImageSize
  style?: ImageStyle | ImageStyle[]
  className?: string
  showCaptions?: boolean
  clickable?: boolean
}

/**
 * 圖片畫廊組件
 * 用於展示多張圖片的網格佈局
 */
export function ImageGallery({
  images,
  columns = 3,
  size = 'md',
  style = ['rounded', 'shadow'],
  className,
  showCaptions = true,
  clickable = true,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const handleImageClick = (index: number) => {
    if (clickable) {
      setSelectedImage(index)
    }
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  return (
    <>
      <div className={clsx('grid gap-6', gridClasses[columns], className)}>
        {images.map((image, index) => (
          <div key={index} className="space-y-2">
            <Image
              src={image.src}
              alt={image.alt}
              size={size}
              style={style}
              onClick={clickable ? () => handleImageClick(index) : undefined}
            />
            {showCaptions && image.caption && (
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {image.caption}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* 圖片預覽模態框 */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl"
              onClick={handleCloseModal}
            >
              ✕
            </button>
            <Image
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              size="full"
              className="max-w-full max-h-full object-contain"
            />
            {images[selectedImage].caption && (
              <p className="text-white text-center mt-4">
                {images[selectedImage].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

interface ImageComparisonProps {
  beforeImage: {
    src: string
    alt: string
    label?: string
  }
  afterImage: {
    src: string
    alt: string
    label?: string
  }
  size?: ImageSize
  className?: string
}

/**
 * 圖片對比組件
 * 用於展示前後對比效果
 */
export function ImageComparison({
  beforeImage,
  afterImage,
  size = 'lg',
  className,
}: ImageComparisonProps) {
  return (
    <div className={clsx('grid grid-cols-1 md:grid-cols-2 gap-6', className)}>
      <div className="space-y-2">
        <Image
          src={beforeImage.src}
          alt={beforeImage.alt}
          size={size}
          style={['rounded', 'border']}
        />
        {beforeImage.label && (
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
            {beforeImage.label}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Image
          src={afterImage.src}
          alt={afterImage.alt}
          size={size}
          style={['rounded', 'border']}
        />
        {afterImage.label && (
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
            {afterImage.label}
          </p>
        )}
      </div>
    </div>
  )
}

interface ImageWithStepsProps {
  image: {
    src: string
    alt: string
  }
  steps: string[]
  size?: ImageSize
  className?: string
}

/**
 * 帶步驟說明的圖片組件
 * 用於展示操作步驟或流程
 */
export function ImageWithSteps({
  image,
  steps,
  size = 'lg',
  className,
}: ImageWithStepsProps) {
  return (
    <div className={clsx('space-y-6', className)}>
      <Image
        src={image.src}
        alt={image.alt}
        size={size}
        style={['rounded', 'shadow']}
      />
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              {index + 1}
            </div>
            <p className="text-gray-700 dark:text-gray-300">{step}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
