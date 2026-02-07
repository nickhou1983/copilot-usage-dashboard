# GitHub Copilot 用量统计网站

一个现代化的 Web 应用，用于可视化展示 GitHub Copilot 的使用统计数据。

## ✨ 功能特性

- 📊 实时显示代码建议数、接受数和接受率
- 📈 趋势分析图表（每日统计）
- 🌐 编程语言和编辑器分布统计
- 🏢 支持组织（Organization）和企业（Enterprise）账户
- 📅 可选的日期范围筛选
- 🔒 安全的本地存储（Token 使用 Base64 编码）
- ⚡ 快速响应和自动缓存

## 🛠️ 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 组件**: shadcn/ui
- **图表**: Recharts
- **数据获取**: SWR
- **API**: GitHub Copilot Usage API
- **测试**: Vitest + React Testing Library

## 📦 安装

```bash
# 克隆仓库
git clone <repository-url>
cd copilot-usage-dashboard

# 安装依赖
npm install

# 初始化 shadcn/ui（如果还没有）
npx shadcn@latest init
```

## 🚀 快速开始

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **配置设置**
   - 访问 http://localhost:3000
   - 输入你的 GitHub Personal Access Token
   - 选择账户类型（组织或企业）
   - 输入组织/企业名称

3. **查看统计**
   - 自动跳转到仪表板
   - 查看实时用量统计

## 🔑 GitHub Token 配置

需要创建一个 GitHub Personal Access Token，具备以下权限：

- `copilot` - 访问 Copilot 用量数据
- `read:org` - 读取组织信息

[创建 Token](https://github.com/settings/tokens/new)

## 📂 项目结构

```
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   └── copilot/usage/    # Copilot 用量 API
│   ├── dashboard/            # 仪表板页面
│   ├── settings/             # 设置页面
│   └── layout.tsx            # 根布局
├── components/               # React 组件
│   ├── charts/               # 图表组件
│   ├── metrics/              # 指标组件
│   └── ui/                   # shadcn/ui 组件
├── hooks/                    # 自定义 React Hooks
│   └── useSettings.ts        # 设置管理 Hook
├── lib/                      # 工具函数
│   ├── github-api.ts         # GitHub API 客户端
│   ├── storage.ts            # 本地存储管理
│   └── data-transformer.ts   # 数据转换逻辑
├── types/                    # TypeScript 类型定义
│   ├── copilot.ts            # Copilot 相关类型
│   └── settings.ts           # 设置类型
└── __tests__/                # 测试文件
```

## 🧪 测试

```bash
# 运行所有测试
npm test

# 运行特定测试
npm test -- __tests__/lib/github-api.test.ts

# 生成覆盖率报告
npm test -- --coverage
```

当前测试状态：✅ **11 个测试文件，86 个测试全部通过**

## 🏗️ 构建

```bash
# 生产构建
npm run build

# 预览生产构建
npm run start
```

## 🚢 部署

### Vercel（推荐）

1. 访问 [vercel.com](https://vercel.com)
2. 导入你的 GitHub 仓库
3. 自动部署（零配置）

### 其他平台

支持任何 Node.js 托管平台：
- Netlify
- Railway
- Render
- 自托管（Docker）

## 📊 API 端点

### POST /api/copilot/usage

获取 Copilot 用量数据。

**请求体：**
```json
{
  "token": "ghp_xxxxx",
  "orgName": "my-org",
  "orgType": "organization",
  "startDate": "2026-01-01",
  "endDate": "2026-02-07"
}
```

**响应：**
```json
{
  "metrics": {
    "totalSuggestions": 10000,
    "totalAcceptances": 8000,
    "acceptanceRate": 80
  },
  "dailyStats": [...],
  "languageBreakdown": [...],
  "editorBreakdown": [...]
}
```

## 🔐 安全性

- Token 使用 Base64 编码存储在浏览器 localStorage
- 不经过服务器传输或存储
- API Routes 不记录或持久化 Token
- 建议使用有限权限的 Token

## 🛣️ 开发路线图

### ✅ 已完成（Phase 1-5）
- 项目配置和测试环境
- 类型定义和常量
- 本地存储管理
- GitHub API 客户端
- API Routes 和数据转换

### 🚧 待完成
- UI 组件开发（参考 `UI_DEVELOPMENT_GUIDE.md`）
- 图表组件（Recharts）
- 日期范围筛选
- 优化和部署准备

## 📝 开发指南

详见 [UI_DEVELOPMENT_GUIDE.md](UI_DEVELOPMENT_GUIDE.md) 获取完整的 UI 开发指南。

## 🤝 贡献

欢迎提交 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)
- [GitHub API](https://docs.github.com/en/rest)
