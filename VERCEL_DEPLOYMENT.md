# 🚀 Vercel 部署指南

## 📋 部署前准备

### 1. 环境要求
- Node.js 18.17 或更高版本
- pnpm 8.0 或更高版本
- Git 版本控制
- GitHub 账号
- Vercel 账号

### 2. 项目检查清单

在部署前，请确保：

- [x] 项目可以正常构建 (`pnpm build`)
- [x] TypeScript 类型检查通过 (`pnpm tsc --noEmit`)
- [x] 代码已提交到 Git 仓库
- [x] 没有 console.error 或调试代码
- [x] 环境变量已准备好（如果有）

## 📦 第一步：准备代码仓库

### 1.1 初始化 Git 仓库（如果还没有）

```bash
# 进入项目目录
cd c:\Users\lenovo\Desktop\game-pages

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: Geometry Dash Online game website"
```

### 1.2 推送到 GitHub

```bash
# 在 GitHub 上创建新仓库：geometry-dash-online
# 然后添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/geometry-dash-online.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

**重要提示**：
- 将 `YOUR_USERNAME` 替换为你的 GitHub 用户名
- 确保仓库是公开的（Public），Vercel 免费版只支持公开仓库

## 🌐 第二步：Vercel 部署

### 方式一：通过 Vercel 网站（推荐新手）

#### 2.1 访问 Vercel
1. 打开 [https://vercel.com](https://vercel.com)
2. 点击 "Sign Up" 或 "Log In"
3. 选择 "Continue with GitHub" 使用 GitHub 账号登录

#### 2.2 导入项目
1. 登录后，点击 "Add New..." → "Project"
2. 在 "Import Git Repository" 部分，找到你的 `geometry-dash-online` 仓库
3. 点击 "Import" 按钮

#### 2.3 配置项目
在项目配置页面：

**Framework Preset**:
- 自动检测为 `Next.js`

**Root Directory**:
- 保持默认 `./`

**Build Command**:
- 自动设置为 `next build`

**Output Directory**:
- 自动设置为 `.next`

**Install Command**:
- 修改为 `pnpm install`（重要！）

#### 2.4 环境变量（如果有）
如果项目需要环境变量：
1. 展开 "Environment Variables" 部分
2. 添加变量名和值
3. 选择环境：Production, Preview, Development

#### 2.5 部署
1. 点击 "Deploy" 按钮
2. 等待构建完成（通常 1-3 分钟）
3. 看到庆祝动画表示部署成功！

#### 2.6 查看部署结果
- 部署成功后，Vercel 会提供一个预览 URL
- 格式：`https://geometry-dash-online-xxx.vercel.app`
- 点击 "Visit" 查看网站

### 方式二：通过 Vercel CLI（推荐开发者）

#### 2.1 安装 Vercel CLI

```bash
# 全局安装 Vercel CLI
pnpm add -g vercel

# 或使用 npm
npm install -g vercel
```

#### 2.2 登录 Vercel

```bash
# 登录 Vercel
vercel login

# 选择登录方式（GitHub, GitLab, Bitbucket, Email）
# 推荐选择 GitHub
```

#### 2.3 部署项目

```bash
# 进入项目目录
cd c:\Users\lenovo\Desktop\game-pages

# 部署到 Vercel
vercel

# 首次部署会询问一系列问题：
# ? Set up and deploy "~/Desktop/game-pages"? [Y/n] y
# ? Which scope do you want to deploy to? [选择你的账号]
# ? Link to existing project? [y/N] n
# ? What's your project's name? geometry-dash-online
# ? In which directory is your code located? ./
# ? Want to modify these settings? [y/N] n
```

#### 2.4 部署到生产环境

```bash
# 部署到生产环境
vercel --prod

# 或者简写
vercel -p
```

#### 2.5 查看部署状态

```bash
# 查看项目列表
vercel list

# 查看部署详情
vercel inspect [deployment-url]

# 查看实时日志
vercel logs [deployment-url]
```

## ⚙️ 第三步：配置自定义域名（可选）

### 3.1 添加域名

1. 在 Vercel 项目页面，点击 "Settings"
2. 选择 "Domains"
3. 输入你的域名，如：`geometrydashgame.online`
4. 点击 "Add"

### 3.2 配置 DNS

根据你的域名提供商，添加 DNS 记录：

**方式一：A 记录（推荐）**
```
类型: A
名称: @
值: 76.76.21.21
```

**方式二：CNAME 记录**
```
类型: CNAME
名称: www
值: cname.vercel-dns.com
```

### 3.3 等待 DNS 生效
- DNS 更改通常需要几分钟到几小时
- Vercel 会自动配置 SSL 证书
- 完成后可以通过自定义域名访问

## 🔧 第四步：环境变量配置

### 4.1 在 Vercel 网站配置

1. 进入项目 → Settings → Environment Variables
2. 添加变量：
   - Name: 变量名
   - Value: 变量值
   - Environment: 选择环境

### 4.2 在代码中使用

```typescript
// 服务端使用
const apiKey = process.env.API_KEY

// 客户端使用（需要 NEXT_PUBLIC_ 前缀）
const publicVar = process.env.NEXT_PUBLIC_API_URL
```

### 4.3 本地开发环境变量

创建 `.env.local` 文件：
```bash
# .env.local
API_KEY=your_api_key_here
NEXT_PUBLIC_API_URL=https://api.example.com
```

**重要**：
- `.env.local` 文件不要提交到 Git
- 已在 `.gitignore` 中排除

## 📊 第五步：监控和优化

### 5.1 查看部署日志

**网站查看**：
1. 进入项目页面
2. 点击 "Deployments" 标签
3. 点击具体部署查看日志

**CLI 查看**：
```bash
vercel logs [deployment-url]
```

### 5.2 性能监控

Vercel 提供：
- Real User Monitoring (RUM)
- Analytics（分析）
- Speed Insights（速度洞察）

在项目设置中启用：
1. Settings → Analytics
2. 点击 "Enable Analytics"

### 5.3 构建缓存优化

项目已配置：
- 图片优化：Next.js 自动优化
- 代码分割：自动进行
- 静态资源缓存：自动配置

## 🔄 第六步：持续部署

### 6.1 自动部署

Vercel 会自动部署：
- 推送到 `main` 分支 → 生产环境部署
- 推送到其他分支 → 预览环境部署
- Pull Request → 生成预览链接

### 6.2 部署流程

```bash
# 1. 修改代码
# 2. 本地测试
pnpm dev

# 3. 构建测试
pnpm build

# 4. 提交代码
git add .
git commit -m "Update: 描述你的修改"
git push origin main

# 5. Vercel 自动部署
# 访问 Vercel Dashboard 查看部署进度
```

### 6.3 回滚部署

如果新版本有问题：
1. 进入 Vercel Dashboard
2. 点击 "Deployments"
3. 找到之前的稳定版本
4. 点击 "..." → "Promote to Production"

## 🚨 常见问题排查

### 问题1：构建失败

**错误信息**：
```
Error: Command "pnpm install" failed
```

**解决方案**：
```bash
# 检查 package.json 是否正确
cat package.json

# 本地测试构建
pnpm install
pnpm build

# 确保 pnpm-lock.yaml 存在
git add pnpm-lock.yaml
git commit -m "Add pnpm lock file"
git push
```

### 问题2：TypeScript 错误

**错误信息**：
```
Type error: Cannot find module '@/components/...'
```

**解决方案**：
```bash
# 检查 tsconfig.json 配置
cat tsconfig.json

# 确保 paths 配置正确
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

# 本地测试类型检查
pnpm tsc --noEmit
```

### 问题3：环境变量未生效

**解决方案**：
1. 确认变量名正确（区分大小写）
2. 客户端变量需要 `NEXT_PUBLIC_` 前缀
3. 修改环境变量后需要重新部署

```bash
# 触发重新部署
vercel --prod
```

### 问题4：域名解析失败

**解决方案**：
```bash
# 检查 DNS 记录
nslookup yourdomain.com

# 等待 DNS 传播（最多 48 小时）
# 使用在线工具检查：https://dnschecker.org
```

### 问题5：构建超时

**解决方案**：
1. 优化构建配置
2. 减少依赖包大小
3. 使用增量构建

```javascript
// next.config.js
module.exports = {
  // 启用增量构建
  experimental: {
    incrementalCacheHandlerPath: './cache-handler.js',
  },
}
```

## 📈 性能优化建议

### 1. 图片优化

```typescript
import Image from 'next/image'

// 使用 Next.js Image 组件
<Image
  src="/game-screenshot.png"
  alt="Game Screenshot"
  width={800}
  height={450}
  priority // 首屏图片优先加载
/>
```

### 2. 代码分割

```typescript
// 动态导入大型组件
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  { loading: () => <p>Loading...</p> }
)
```

### 3. 缓存策略

```typescript
// 在 API 路由中设置缓存头
export async function GET() {
  return new Response(JSON.stringify(data), {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
```

## 🔐 安全最佳实践

### 1. 环境变量安全

```bash
# ✅ 正确：敏感信息存储在环境变量
API_SECRET=your_secret_here

# ❌ 错误：不要在代码中硬编码
const apiKey = "sk_live_xxxxx" // 危险！
```

### 2. 安全头部配置

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

### 3. 内容安全策略

```javascript
// next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self';
  frame-src 'self' https://geometrydash.io;
  connect-src 'self' https://geometrydash.io;
`

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\n/g, ''),
          },
        ],
      },
    ]
  },
}
```

## 📝 部署检查清单

部署前最后检查：

- [ ] 代码已推送到 GitHub
- [ ] 本地构建成功 (`pnpm build`)
- [ ] TypeScript 无错误 (`pnpm tsc --noEmit`)
- [ ] 环境变量已配置
- [ ] 敏感信息已移除
- [ ] README 已更新
- [ ] .gitignore 配置正确
- [ ] package.json 依赖版本正确

部署后检查：

- [ ] 网站可以正常访问
- [ ] 所有页面加载正常
- [ ] 游戏可以正常运行
- [ ] 移动端适配正常
- [ ] 性能指标良好
- [ ] SEO 标签正确
- [ ] 自定义域名解析成功（如果有）

## 🎉 部署成功！

恭喜！你的 Geometry Dash Online 游戏网站已成功部署到 Vercel！

**下一步**：
1. 分享你的网站链接
2. 监控网站性能
3. 收集用户反馈
4. 持续优化改进

## 📚 相关资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Vercel CLI 文档](https://vercel.com/docs/cli)
- [Vercel GitHub 集成](https://vercel.com/docs/integrations/git)

## 💡 提示

1. **预览部署**：每次推送代码，Vercel 都会创建一个预览链接，方便测试
2. **自动 HTTPS**：Vercel 自动提供 SSL 证书，无需手动配置
3. **全球 CDN**：Vercel 自动将网站部署到全球边缘节点
4. **分析工具**：启用 Vercel Analytics 了解用户行为
5. **团队协作**：可以邀请团队成员共同管理项目

---

**部署遇到问题？**
- 查看 [Vercel 状态页面](https://www.vercel-status.com/)
- 访问 [Vercel 社区](https://github.com/vercel/vercel/discussions)
- 查看项目构建日志获取详细错误信息

祝部署顺利！🚀
