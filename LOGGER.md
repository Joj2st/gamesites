# 📝 日志系统文档

## 概述

本项目实现了一个智能日志系统，根据环境自动控制日志输出：
- **开发环境**: 输出详细的彩色日志，方便调试
- **生产环境**: 自动关闭所有日志输出，提升性能和安全性

## 文件位置

- **日志工具**: [src/lib/logger.ts](file:///c:/Users/lenovo/Desktop/game-pages/src/lib/logger.ts)
- **使用示例**: [src/app/page.tsx](file:///c:/Users/lenovo/Desktop/game-pages/src/app/page.tsx)

## 使用方法

### 1. 导入日志工具

```typescript
import { logger, LOG_PREFIX } from "@/lib/logger"
```

### 2. 基本用法

```typescript
// 普通日志
logger.log(LOG_PREFIX, "页面已加载")

// 信息日志
logger.info(LOG_PREFIX, "当前环境:", process.env.NODE_ENV)

// 警告日志
logger.warn(LOG_PREFIX, "检测到潜在问题")

// 错误日志
logger.error(LOG_PREFIX, "发生错误:", error)

// 调试日志
logger.debug(LOG_PREFIX, "调试信息:", data)
```

### 3. 高级用法

```typescript
// 分组日志
logger.group("用户操作")
logger.log(LOG_PREFIX, "点击按钮")
logger.log(LOG_PREFIX, "提交表单")
logger.groupEnd()

// 计时
logger.time("API请求")
await fetchData()
logger.timeEnd("API请求")

// 表格输出
logger.table([
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 }
])
```

## 日志级别

| 方法 | 颜色 | 用途 | 示例 |
|------|------|------|------|
| `logger.log()` | 🔵 蓝色 | 普通信息 | 页面加载、用户操作 |
| `logger.info()` | 🔵 青色 | 重要信息 | 环境配置、状态变更 |
| `logger.warn()` | 🟠 橙色 | 警告信息 | 潜在问题、兼容性警告 |
| `logger.error()` | 🔴 红色 | 错误信息 | 异常、失败操作 |
| `logger.debug()` | 🟣 紫色 | 调试信息 | 详细调试数据 |

## 环境行为

### 开发环境 (NODE_ENV=development)

```bash
# 控制台输出示例
[GameStation] [2024-01-15T10:30:45.123Z] 页面已加载
[GameStation] [2024-01-15T10:30:45.124Z] 当前环境: development
[GameStation] [2024-01-15T10:30:45.125Z] 移动设备检测: false
```

**特点**:
- ✅ 输出所有日志
- ✅ 彩色标识
- ✅ 带时间戳
- ✅ 详细调试信息

### 生产环境 (NODE_ENV=production)

```bash
# 控制台输出
(无任何输出)
```

**特点**:
- ✅ 完全关闭日志输出
- ✅ 提升性能
- ✅ 保护敏感信息
- ✅ 减少控制台噪音

## 实现原理

### 环境检测

```typescript
class Logger {
  private isDevelopment: boolean

  constructor() {
    // 检测当前环境
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  private shouldLog(): boolean {
    // 只在开发环境输出
    return this.isDevelopment
  }
}
```

### 日志格式化

```typescript
private formatMessage(level: LogLevel, prefix: string, ...args: any[]): void {
  if (!this.shouldLog()) return

  const timestamp = new Date().toISOString()
  const styledPrefix = `%c${prefix}`
  const styles = this.getLevelStyles(level)

  // 根据级别调用对应的console方法
  console[level](styledPrefix, styles, `[${timestamp}]`, ...args)
}
```

## 最佳实践

### 1. 使用统一前缀

```typescript
// ✅ 推荐
logger.log(LOG_PREFIX, "用户登录成功")

// ❌ 不推荐
logger.log("用户登录成功")
```

### 2. 合理使用日志级别

```typescript
// 页面生命周期
logger.log(LOG_PREFIX, "页面已加载")

// 重要状态变更
logger.info(LOG_PREFIX, "用户状态更新:", newUser)

// 潜在问题
logger.warn(LOG_PREFIX, "API响应缓慢:", responseTime)

// 错误处理
logger.error(LOG_PREFIX, "请求失败:", error)

// 详细调试
logger.debug(LOG_PREFIX, "详细数据:", complexObject)
```

### 3. 避免敏感信息

```typescript
// ❌ 危险：可能泄露敏感信息
logger.log(LOG_PREFIX, "用户密码:", password)
logger.log(LOG_PREFIX, "API密钥:", apiKey)

// ✅ 安全：只记录必要信息
logger.log(LOG_PREFIX, "用户登录成功")
logger.log(LOG_PREFIX, "API请求已发送")
```

### 4. 结构化日志

```typescript
// ✅ 推荐：结构化数据
logger.log(LOG_PREFIX, "用户操作:", {
  action: "click",
  target: "play-button",
  timestamp: Date.now()
})

// ❌ 不推荐：混乱的日志
logger.log(LOG_PREFIX, "用户点击了播放按钮在", Date.now())
```

## 性能影响

### 开发环境
- 日志输出对性能影响极小
- 有助于快速定位问题
- 提升开发效率

### 生产环境
- 完全零性能开销
- 所有日志代码在编译时被优化
- 不影响用户体验

## 迁移指南

### 从 console.log 迁移

```typescript
// 旧代码
console.log("[GameStation] 页面已加载")
console.error("[GameStation] 发生错误:", error)

// 新代码
import { logger, LOG_PREFIX } from "@/lib/logger"

logger.log(LOG_PREFIX, "页面已加载")
logger.error(LOG_PREFIX, "发生错误:", error)
```

### 批量替换

```bash
# 使用编辑器批量替换
查找: console\.log\("\[GameStation\] (.*)"\)
替换: logger.log(LOG_PREFIX, "$1")

查找: console\.error\("\[GameStation\] (.*)"\)
替换: logger.error(LOG_PREFIX, "$1")
```

## 常见问题

### Q: 为什么生产环境没有日志？

A: 这是设计行为。生产环境自动关闭日志输出，以：
- 提升性能
- 保护敏感信息
- 减少控制台噪音
- 防止信息泄露

### Q: 如何在生产环境调试？

A: 使用以下方法：
1. 使用 Vercel 的实时日志功能
2. 使用错误监控服务（如 Sentry）
3. 在代码中添加错误上报
4. 使用 React DevTools

### Q: 日志会影响性能吗？

A: 不会。生产环境下：
- 所有日志调用在编译时被优化
- `shouldLog()` 返回 false，立即退出
- 零性能开销

### Q: 如何临时开启生产日志？

A: 不建议这样做。如果确实需要：
1. 使用环境变量控制
2. 添加特定的调试模式
3. 使用错误监控服务

## 扩展功能

### 自定义日志级别

```typescript
// 在 logger.ts 中添加
logger.verbose = (prefix: string, ...args: any[]) => {
  if (!this.shouldLog()) return
  console.log(`%c${prefix}`, 'color: gray', ...args)
}
```

### 日志上报

```typescript
// 扩展 logger 支持错误上报
class Logger {
  error(prefix: string, ...args: any[]): void {
    // 开发环境输出日志
    this.formatMessage('error', prefix, ...args)
    
    // 生产环境上报错误
    if (!this.isDevelopment) {
      this.reportToService(prefix, args)
    }
  }

  private reportToService(prefix: string, args: any[]) {
    // 发送到错误监控服务
    fetch('/api/log', {
      method: 'POST',
      body: JSON.stringify({ prefix, args })
    })
  }
}
```

## 总结

智能日志系统提供了：
- ✅ 开发环境详细日志
- ✅ 生产环境零输出
- ✅ 统一的日志格式
- ✅ 彩色视觉标识
- ✅ 零性能开销
- ✅ 易于使用和维护

使用日志系统可以：
- 提升开发效率
- 快速定位问题
- 保护生产环境
- 优化用户体验
