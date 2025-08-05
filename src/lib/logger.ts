/**
 * AMIGO 幫助中心 - 日誌記錄器
 * 統一的日誌記錄功能，支援不同級別和輸出格式
 * 作者：AMIGO 開發團隊
 * 版本：v1.0.0
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
  source?: string
}

class Logger {
  private logLevel: LogLevel = LogLevel.INFO
  private isDevelopment: boolean = process.env.NODE_ENV === 'development'

  constructor() {
    // 在開發環境中顯示更多日誌
    if (this.isDevelopment) {
      this.logLevel = LogLevel.DEBUG
    }
  }

  /**
   * 設置日誌級別
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level
  }

  /**
   * 格式化時間戳
   */
  private formatTimestamp(): string {
    return new Date().toISOString()
  }

  /**
   * 格式化日誌級別
   */
  private formatLevel(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return 'DEBUG'
      case LogLevel.INFO:
        return 'INFO'
      case LogLevel.WARN:
        return 'WARN'
      case LogLevel.ERROR:
        return 'ERROR'
      default:
        return 'UNKNOWN'
    }
  }

  /**
   * 獲取日誌顏色 (用於控制台輸出)
   */
  private getLogColor(level: LogLevel): string {
    if (typeof window !== 'undefined') {
      // 瀏覽器環境不使用顏色
      return ''
    }

    switch (level) {
      case LogLevel.DEBUG:
        return '\x1b[36m' // 青色
      case LogLevel.INFO:
        return '\x1b[32m' // 綠色
      case LogLevel.WARN:
        return '\x1b[33m' // 黃色
      case LogLevel.ERROR:
        return '\x1b[31m' // 紅色
      default:
        return '\x1b[0m' // 重置
    }
  }

  /**
   * 重置顏色
   */
  private resetColor(): string {
    return typeof window !== 'undefined' ? '' : '\x1b[0m'
  }

  /**
   * 創建日誌條目
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: any,
    source?: string
  ): LogEntry {
    return {
      timestamp: this.formatTimestamp(),
      level,
      message,
      data,
      source,
    }
  }

  /**
   * 輸出日誌到控制台
   */
  private outputToConsole(entry: LogEntry): void {
    if (entry.level < this.logLevel) {
      return
    }

    const color = this.getLogColor(entry.level)
    const reset = this.resetColor()
    const levelStr = this.formatLevel(entry.level)
    const sourceStr = entry.source ? ` [${entry.source}]` : ''

    const logMessage = `${color}[${entry.timestamp}] ${levelStr}${sourceStr}: ${entry.message}${reset}`

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, entry.data || '')
        break
      case LogLevel.INFO:
        console.info(logMessage, entry.data || '')
        break
      case LogLevel.WARN:
        console.warn(logMessage, entry.data || '')
        break
      case LogLevel.ERROR:
        console.error(logMessage, entry.data || '')
        break
    }
  }

  /**
   * 輸出日誌到文件 (僅在 Node.js 環境)
   */
  private async outputToFile(entry: LogEntry): Promise<void> {
    // 僅在服務器端執行
    if (typeof window !== 'undefined') {
      return
    }

    try {
      const fs = await import('fs')
      const path = await import('path')

      // 確保 logs 目錄存在
      const logsDir = path.join(process.cwd(), 'logs')
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true })
      }

      // 生成日誌文件名 (按日期分割)
      const date = new Date().toISOString().split('T')[0]
      const logFile = path.join(logsDir, `${date}.log`)

      // 格式化日誌條目
      const logLine = JSON.stringify(entry) + '\n'

      // 追加到日誌文件
      fs.appendFileSync(logFile, logLine, 'utf8')
    } catch (error) {
      console.error('Failed to write log to file:', error)
    }
  }

  /**
   * 記錄日誌
   */
  private async log(
    level: LogLevel,
    message: string,
    data?: any,
    source?: string
  ): Promise<void> {
    const entry = this.createLogEntry(level, message, data, source)

    // 輸出到控制台
    this.outputToConsole(entry)

    // 輸出到文件 (僅在服務器端)
    await this.outputToFile(entry)
  }

  /**
   * DEBUG 級別日誌
   */
  debug(message: string, data?: any, source?: string): void {
    this.log(LogLevel.DEBUG, message, data, source)
  }

  /**
   * INFO 級別日誌
   */
  info(message: string, data?: any, source?: string): void {
    this.log(LogLevel.INFO, message, data, source)
  }

  /**
   * WARN 級別日誌
   */
  warn(message: string, data?: any, source?: string): void {
    this.log(LogLevel.WARN, message, data, source)
  }

  /**
   * ERROR 級別日誌
   */
  error(message: string, data?: any, source?: string): void {
    this.log(LogLevel.ERROR, message, data, source)
  }

  /**
   * 記錄用戶操作
   */
  userAction(action: string, data?: any): void {
    this.info(`用戶操作: ${action}`, data, 'USER_ACTION')
  }

  /**
   * 記錄系統事件
   */
  systemEvent(event: string, data?: any): void {
    this.info(`系統事件: ${event}`, data, 'SYSTEM_EVENT')
  }

  /**
   * 記錄性能指標
   */
  performance(metric: string, value: number, unit: string = 'ms'): void {
    this.info(`性能指標: ${metric} = ${value}${unit}`, { metric, value, unit }, 'PERFORMANCE')
  }
}

// 創建全局日誌實例
export const logger = new Logger()

// 導出日誌級別枚舉
export { LogLevel as Level }

// 默認導出
export default logger
