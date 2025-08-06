/**
 * 圖片管理工具函數
 * 提供統一的圖片路徑處理和管理功能
 */

// 圖片分類定義
export const IMAGE_CATEGORIES = {
  common: 'common',           // 通用圖片（圖標、裝飾等）
  logos: 'logos',            // 品牌標誌
  pages: 'pages',            // 頁面專用圖片
  features: 'features',      // 功能展示圖片
  ui: 'ui',                  // UI 元素圖片
} as const

export type ImageCategory = keyof typeof IMAGE_CATEGORIES

// 頁面分類定義
export const PAGE_CATEGORIES = {
  'product-management': '商品管理',
  'device-management': '設備管理',
  'order-management': '訂單管理',
  'financial-reports': '財務報表',
  'system-settings': '系統設定',
  'getting-started': '系統登入',
  'support': '技術支援',
} as const

export type PageCategory = keyof typeof PAGE_CATEGORIES

/**
 * 構建圖片路徑
 * @param category - 圖片分類
 * @param filename - 檔案名稱
 * @param subcategory - 子分類（可選）
 * @returns 完整的圖片路徑
 */
export function buildImagePath(
  category: ImageCategory,
  filename: string,
  subcategory?: string
): string {
  const basePath = subcategory 
    ? `${category}/${subcategory}/${filename}`
    : `${category}/${filename}`
  
  return basePath
}

/**
 * 構建頁面專用圖片路徑
 * @param page - 頁面名稱
 * @param filename - 檔案名稱
 * @returns 頁面圖片路徑
 */
export function buildPageImagePath(page: PageCategory, filename: string): string {
  return buildImagePath('pages', filename, page)
}

/**
 * 構建通用圖片路徑
 * @param filename - 檔案名稱
 * @returns 通用圖片路徑
 */
export function buildCommonImagePath(filename: string): string {
  return buildImagePath('common', filename)
}

/**
 * 構建標誌圖片路徑
 * @param filename - 檔案名稱
 * @returns 標誌圖片路徑
 */
export function buildLogoImagePath(filename: string): string {
  return buildImagePath('logos', filename)
}

/**
 * 構建功能圖片路徑
 * @param filename - 檔案名稱
 * @param feature - 功能名稱（可選）
 * @returns 功能圖片路徑
 */
export function buildFeatureImagePath(filename: string, feature?: string): string {
  return buildImagePath('features', filename, feature)
}

/**
 * 構建 UI 圖片路徑
 * @param filename - 檔案名稱
 * @returns UI 圖片路徑
 */
export function buildUIImagePath(filename: string): string {
  return buildImagePath('ui', filename)
}

/**
 * 圖片路徑輔助類
 * 提供鏈式調用的方式構建圖片路徑
 */
export class ImagePathBuilder {
  private category: ImageCategory
  private subcategory?: string
  private filename?: string

  constructor(category: ImageCategory) {
    this.category = category
  }

  /**
   * 設定子分類
   */
  sub(subcategory: string): this {
    this.subcategory = subcategory
    return this
  }

  /**
   * 設定檔案名稱並構建路徑
   */
  file(filename: string): string {
    this.filename = filename
    return buildImagePath(this.category, filename, this.subcategory)
  }

  /**
   * 靜態方法：創建頁面圖片路徑構建器
   */
  static page(page: PageCategory): ImagePathBuilder {
    const builder = new ImagePathBuilder('pages')
    builder.subcategory = page
    return builder
  }

  /**
   * 靜態方法：創建通用圖片路徑構建器
   */
  static common(): ImagePathBuilder {
    return new ImagePathBuilder('common')
  }

  /**
   * 靜態方法：創建標誌圖片路徑構建器
   */
  static logo(): ImagePathBuilder {
    return new ImagePathBuilder('logos')
  }

  /**
   * 靜態方法：創建功能圖片路徑構建器
   */
  static feature(feature?: string): ImagePathBuilder {
    const builder = new ImagePathBuilder('features')
    if (feature) {
      builder.subcategory = feature
    }
    return builder
  }

  /**
   * 靜態方法：創建 UI 圖片路徑構建器
   */
  static ui(): ImagePathBuilder {
    return new ImagePathBuilder('ui')
  }
}

/**
 * 圖片資訊介面
 */
export interface ImageInfo {
  src: string
  alt: string
  category: ImageCategory
  subcategory?: string
  filename: string
}

/**
 * 圖片註冊表
 * 用於管理和查找圖片資源
 */
export class ImageRegistry {
  private static images: Map<string, ImageInfo> = new Map()

  /**
   * 註冊圖片
   */
  static register(key: string, info: ImageInfo): void {
    this.images.set(key, info)
  }

  /**
   * 獲取圖片資訊
   */
  static get(key: string): ImageInfo | undefined {
    return this.images.get(key)
  }

  /**
   * 獲取所有圖片
   */
  static getAll(): Map<string, ImageInfo> {
    return new Map(this.images)
  }

  /**
   * 按分類獲取圖片
   */
  static getByCategory(category: ImageCategory): ImageInfo[] {
    return Array.from(this.images.values()).filter(img => img.category === category)
  }
}

// 便捷的圖片路徑構建函數
export const img = {
  page: (page: PageCategory, filename: string) => buildPageImagePath(page, filename),
  common: (filename: string) => buildCommonImagePath(filename),
  logo: (filename: string) => buildLogoImagePath(filename),
  feature: (filename: string, feature?: string) => buildFeatureImagePath(filename, feature),
  ui: (filename: string) => buildUIImagePath(filename),
  build: ImagePathBuilder,
}
