'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  PlusIcon,
  MinusIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import { Image } from '@/components/Image'

interface EnhancedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  caption?: string
  enableZoom?: boolean
  enableDownload?: boolean
  enableFullscreen?: boolean
}

export default function EnhancedImage({
  src,
  alt,
  width = 800,
  height = 450,
  className = '',
  caption,
  enableZoom = true,
  enableDownload = true,
  enableFullscreen = true,
}: EnhancedImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // 鍵盤事件處理
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isModalOpen) return

      switch (event.key) {
        case 'Escape':
          handleCloseModal()
          break
        case '+':
        case '=':
          event.preventDefault()
          handleZoomIn()
          break
        case '-':
          event.preventDefault()
          handleZoomOut()
          break
        case 'f':
        case 'F':
          event.preventDefault()
          handleToggleFullscreen()
          break
        case 'd':
        case 'D':
          event.preventDefault()
          handleDownload()
          break
      }
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('fullscreenchange', handleFullscreenChange)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen, scale])

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setScale(1)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setScale(1)
    if (isFullscreen && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {
        // 忽略全屏退出錯誤
      })
      setIsFullscreen(false)
    }
  }

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.25))
  }

  const handleResetZoom = () => {
    setScale(1)
  }

  const handleToggleFullscreen = async () => {
    if (!modalRef.current) return

    try {
      if (!isFullscreen && !document.fullscreenElement) {
        await modalRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else if (document.fullscreenElement) {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (error) {
      console.warn('Fullscreen not supported:', error)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = src.startsWith('/') ? src : `/images/${src}`
    link.download = alt.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleCloseModal()
    }
  }

  return (
    <>
      {/* 主圖片 */}
      <div className="relative group">
        <motion.div
          className={`relative cursor-pointer ${className}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleOpenModal}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          role="button"
          tabIndex={0}
          aria-label={`點擊查看 ${alt} 的放大版本`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleOpenModal()
            }
          }}
        >
          <Image
            src={src}
            alt={alt}
            size={{ width, height }}
            className="w-full h-auto"
          />
          
          {/* 懸停覆蓋層 */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="bg-white/90 dark:bg-gray-800/90 rounded-full p-3 shadow-lg"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                >
                  <MagnifyingGlassIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 圖片說明 */}
        {caption && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
            {caption}
          </p>
        )}
      </div>

      {/* 模態彈窗 */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            ref={modalRef}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="image-modal-title"
          >
            {/* 工具欄 */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              {enableZoom && (
                <>
                  <motion.button
                    className={`p-2 rounded-full shadow-lg transition-colors ${
                      scale <= 0.25
                        ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                        : 'bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800'
                    }`}
                    onClick={handleZoomOut}
                    disabled={scale <= 0.25}
                    whileHover={scale > 0.25 ? { scale: 1.1 } : {}}
                    whileTap={scale > 0.25 ? { scale: 0.9 } : {}}
                    aria-label="縮小圖片"
                  >
                    <MinusIcon className={`w-5 h-5 ${
                      scale <= 0.25
                        ? 'text-gray-500 dark:text-gray-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`} />
                  </motion.button>

                  <motion.button
                    className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg transition-colors"
                    onClick={handleResetZoom}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="重置縮放"
                    title="雙擊圖片也可重置縮放"
                  >
                    <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                      1:1
                    </span>
                  </motion.button>

                  <motion.button
                    className={`p-2 rounded-full shadow-lg transition-colors ${
                      scale >= 3
                        ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                        : 'bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800'
                    }`}
                    onClick={handleZoomIn}
                    disabled={scale >= 3}
                    whileHover={scale < 3 ? { scale: 1.1 } : {}}
                    whileTap={scale < 3 ? { scale: 0.9 } : {}}
                    aria-label="放大圖片"
                  >
                    <PlusIcon className={`w-5 h-5 ${
                      scale >= 3
                        ? 'text-gray-500 dark:text-gray-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`} />
                  </motion.button>
                </>
              )}

              {enableFullscreen && (
                <motion.button
                  className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg transition-colors"
                  onClick={handleToggleFullscreen}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={isFullscreen ? "退出全屏" : "進入全屏"}
                >
                  {isFullscreen ? (
                    <ArrowsPointingInIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <ArrowsPointingOutIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  )}
                </motion.button>
              )}

              {enableDownload && (
                <motion.button
                  className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg transition-colors"
                  onClick={handleDownload}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="下載圖片"
                >
                  <ArrowDownTrayIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </motion.button>
              )}

              <motion.button
                className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg transition-colors"
                onClick={handleCloseModal}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="關閉圖片查看器"
              >
                <XMarkIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </motion.button>
            </div>

            {/* 放大的圖片 */}
            <motion.div
              className="flex items-center justify-center w-full h-full p-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="relative overflow-auto max-w-full max-h-full"
                style={{
                  maxWidth: '100vw',
                  maxHeight: '100vh',
                }}
              >
                <motion.img
                  ref={imageRef}
                  src={src.startsWith('/') ? src : `/images/${src}`}
                  alt={alt}
                  className="block cursor-pointer"
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'center',
                    transition: 'transform 0.3s ease',
                    maxWidth: scale <= 1 ? '100%' : 'none',
                    maxHeight: scale <= 1 ? '100%' : 'none',
                    width: scale <= 1 ? 'auto' : `${width}px`,
                    height: scale <= 1 ? 'auto' : `${height}px`,
                  }}
                  draggable={false}
                  onDoubleClick={handleResetZoom}
                  title="雙擊重置縮放"
                />
              </div>
            </motion.div>

            {/* 縮放指示器 */}
            {enableZoom && (
              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full shadow-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {Math.round(scale * 100)}%
                </span>
              </div>
            )}

            {/* 鍵盤快捷鍵提示 */}
            <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-lg text-xs text-gray-600 dark:text-gray-400">
              <div>ESC: 關閉</div>
              {enableZoom && (
                <>
                  <div>+/-: 縮放</div>
                  <div>雙擊: 重置</div>
                </>
              )}
              {enableFullscreen && <div>F: 全屏</div>}
              {enableDownload && <div>D: 下載</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
