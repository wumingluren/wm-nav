# WM-Nav 网站导航系统

## 项目简介

WM-Nav 是一个基于 Nuxt3 Vue3 构建的现代化网站导航系统，旨在提供简单高效的网站书签管理和快速访问体验。该系统使用飞书多维表格作为后端数据存储，支持书签的搜索、分类和推荐功能。

### 主要特性

- 🔍 智能搜索 ：快速查找已保存的网站书签
- 🏷️ 标签分类 ：通过标签对书签进行分类管理
- 🔄 智能推荐 ：基于标签自动推荐相关网站
- 💾 飞书集成 ：使用飞书多维表格作为数据存储
- 📱 响应式设计 ：完美适配各种设备屏幕

## 技术栈

- 前端框架 ： Nuxt.js 3 - Vue3 的通用应用框架
- UI 框架 ： Tailwind CSS - 实用优先的 CSS 框架
- 组件库 ： Floating Vue - 提供悬浮提示组件
- API 集成 ：飞书多维表格 API - 用于数据存储和检索

## 快速开始

### 环境要求

- Node.js 16.x 或更高版本
- npm、yarn 或 pnpm 包管理器

### 安装依赖

```bash
# npm
npm install

# yarn
yarn install

# pnpm
pnpm install
```

### 配置环境变量

在项目根目录创建 .env 文件，并配置以下飞书相关参数：

```bash
FEISHU_APP_ID=your_app_id
FEISHU_APP_SECRET=your_app_secret
FEISHU_BASE_ID=your_base_id
FEISHU_TABLE_ID=your_table_id
```

### 启动开发服务器

```bash
# npm
npm run dev

# yarn
yarn dev

# pnpm
pnpm dev
```

开发服务器将在 http://localhost:3000 启动。

## 项目结构

```
wm-nav/
├── assets/            # 静态资源文件
│   └── css/           # CSS 样式文件
├── components/        # Vue 组件
│   └── SiteCard.vue   # 网站卡片组件
├── pages/             # 页面组件
│   ├── index.vue      # 首页
│   └── search.vue     # 搜索页面
├── plugins/           # Nuxt 插件
│   └── floating-vue.ts # 悬浮提示插件配置
├── public/            # 公共静态文件
├── server/            # 服务器端代码
│   ├── api/           # API 端点
│   │   └── bookmarks/ # 书签相关 API
│   └── services/      # 服务层
│       └── feishu.ts  # 飞书服务
├── .env               # 环境变量
├── nuxt.config.ts     # Nuxt 配置
├── tailwind.config.js # Tailwind CSS 配置
└── tsconfig.json      # TypeScript 配置
```

## 功能说明

### 书签搜索

系统提供强大的搜索功能，可以通过标题、URL 或标签快速查找已保存的书签。

### 书签推荐

首页会自动推荐书签，推荐算法基于：

- 随机选择的标签匹配
- 最新添加的书签
- 智能混合推荐

### 飞书多维表格集成

系统使用飞书多维表格作为数据存储，主要字段包括：

- 标题：书签的名称
- 网址：书签的 URL 地址
- 标签：分类标签，用于归类和搜索
- 简介：书签的简短描述

## 部署指南

### 构建生产版本

```bash
# npm
npm run build

# yarn
yarn build

# pnpm
pnpm build
```

### 本地预览生产版本

```bash
# npm
npm run preview

# yarn
yarn preview

# pnpm
pnpm preview
```

### 部署到服务器

构建完成后，将 .output 目录下的内容部署到您的 Web 服务器。
使用 Node.js 服务器

```bash
node .output/server/index.mjs
```

使用 PM2 管理进程（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start .output/server/index.mjs --name wm-nav

# 设置开机自启
pm2 startup
pm2 save
```

### 使用 Docker 部署
创建 Dockerfile：

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY .output ./.output
COPY package.json ./

ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
```

构建并运行 Docker 容器：

```bash
docker build -t wm-nav .
docker run -p 3000:3000 -e FEISHU_APP_ID=xxx -e FEISHU_APP_SECRET=xxx -e FEISHU_BASE_ID=xxx -e FEISHU_TABLE_ID=xxx wm-nav
```

## 注意事项

- 确保部署环境中正确设置了所有环境变量
- 如果使用 CDN，需要配置正确的缓存策略
- 对于生产环境，建议启用 HTTPS

## 许可证
MIT License
