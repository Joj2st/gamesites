type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

class Logger {
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  private shouldLog(): boolean {
    return this.isDevelopment
  }

  private formatMessage(level: LogLevel, prefix: string, ...args: any[]): void {
    if (!this.shouldLog()) return

    const timestamp = new Date().toISOString()
    const styledPrefix = `%c${prefix}`
    const styles = this.getLevelStyles(level)

    switch (level) {
      case 'log':
        console.log(styledPrefix, styles, `[${timestamp}]`, ...args)
        break
      case 'info':
        console.info(styledPrefix, styles, `[${timestamp}]`, ...args)
        break
      case 'warn':
        console.warn(styledPrefix, styles, `[${timestamp}]`, ...args)
        break
      case 'error':
        console.error(styledPrefix, styles, `[${timestamp}]`, ...args)
        break
      case 'debug':
        console.debug(styledPrefix, styles, `[${timestamp}]`, ...args)
        break
    }
  }

  private getLevelStyles(level: LogLevel): string {
    const baseStyle = 'font-weight: bold; padding: 2px 6px; border-radius: 3px;'
    
    switch (level) {
      case 'log':
        return `${baseStyle} background: #2196F3; color: white;`
      case 'info':
        return `${baseStyle} background: #00BCD4; color: white;`
      case 'warn':
        return `${baseStyle} background: #FF9800; color: white;`
      case 'error':
        return `${baseStyle} background: #F44336; color: white;`
      case 'debug':
        return `${baseStyle} background: #9C27B0; color: white;`
      default:
        return baseStyle
    }
  }

  log(prefix: string, ...args: any[]): void {
    this.formatMessage('log', prefix, ...args)
  }

  info(prefix: string, ...args: any[]): void {
    this.formatMessage('info', prefix, ...args)
  }

  warn(prefix: string, ...args: any[]): void {
    this.formatMessage('warn', prefix, ...args)
  }

  error(prefix: string, ...args: any[]): void {
    this.formatMessage('error', prefix, ...args)
  }

  debug(prefix: string, ...args: any[]): void {
    this.formatMessage('debug', prefix, ...args)
  }

  group(label: string): void {
    if (!this.shouldLog()) return
    console.group(label)
  }

  groupEnd(): void {
    if (!this.shouldLog()) return
    console.groupEnd()
  }

  time(label: string): void {
    if (!this.shouldLog()) return
    console.time(label)
  }

  timeEnd(label: string): void {
    if (!this.shouldLog()) return
    console.timeEnd(label)
  }

  table(data: any): void {
    if (!this.shouldLog()) return
    console.table(data)
  }
}

export const logger = new Logger()

export const LOG_PREFIX = '[GameStation]'
