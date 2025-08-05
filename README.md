# AMIGO 幫助中心

AMIGO 自動販賣機後台系統操作手冊展示平台，基於 Next.js 15 + React 19 + TypeScript + Tailwind CSS v4 構建。

## 🎯 項目簡介

本項目為 AMIGO 自動販賣機後台系統的操作手冊展示平台，旨在為加盟主和操作人員提供清晰、易用的系統使用指南。

### 主要功能

- 📚 **完整的操作手冊** - 涵蓋系統登入、設備管理、商品管理、財務報表等核心功能
- 🔍 **全文搜索** - 支援中文搜索，快速定位所需內容 (⌘K 快捷鍵)
- 🌓 **主題切換** - 支援明暗主題，適應不同使用環境
- 📱 **響應式設計** - 完美適配桌面端、平板和手機
- 🚀 **靜態部署** - 支援 GitHub Pages 部署，訪問速度快

## 🛠️ 技術架構

- **框架**: Next.js 15 (App Router)
- **前端**: React 19 + TypeScript 5.8.3
- **樣式**: Tailwind CSS v4 + Typography 插件
- **內容**: MDX (Markdown + React 組件)
- **搜索**: FlexSearch 全文索引
- **動畫**: Framer Motion
- **UI 組件**: Headless UI
- **部署**: GitHub Pages + GitHub Actions

## 🚀 快速開始

### 環境要求

- Node.js 18+
- npm 或 yarn

### 安裝依賴

```bash
npm install
```

### 開發環境

```bash
# 使用 npm 腳本
npm run dev

# 或使用標準化腳本 (推薦)
./scripts/dev.sh
```

開發服務器將在 [http://localhost:3000](http://localhost:3000) 啟動。

### 生產構建

```bash
# 使用 npm 腳本
npm run build

# 或使用標準化腳本 (推薦)
./scripts/build.sh
```

### 本地預覽

```bash
# 啟動生產服務器
./scripts/start.sh

# 或預覽靜態文件
npm run preview
```

## 📁 項目結構

```
amigo-helpcenter/
├── src/
│   ├── app/                 # Next.js 頁面 (App Router)
│   ├── components/          # React 組件
│   ├── lib/                 # 工具函數和配置
│   ├── mdx/                 # MDX 處理邏輯
│   └── styles/              # 樣式文件
├── docs/                    # 文檔目錄
│   └── usermanual/          # 操作手冊
├── scripts/                 # 執行腳本
├── logs/                    # 日誌文件
└── .github/workflows/       # GitHub Actions
```

## 🔧 可用腳本

### 開發腳本
- `npm run dev` - 啟動開發服務器
- `npm run build` - 構建生產版本
- `npm run start` - 啟動生產服務器
- `npm run lint` - 代碼檢查
- `npm run type-check` - TypeScript 類型檢查

### 標準化腳本 (推薦)
- `./scripts/dev.sh` - 開發環境啟動 (包含環境檢查)
- `./scripts/build.sh` - 生產構建 (包含代碼檢查)
- `./scripts/start.sh` - 生產服務器啟動
- `./scripts/deploy.sh` - GitHub Pages 部署

### 工具腳本
- `npm run clean` - 清理構建文件和日誌
- `npm run preview` - 本地預覽靜態文件

## 🚀 部署

### GitHub Pages 自動部署

1. 推送代碼到 `main` 分支
2. GitHub Actions 自動觸發構建和部署
3. 網站將部署到 `https://username.github.io/amigo-helpcenter`

### 手動部署

```bash
./scripts/deploy.sh
```

## 📖 內容管理

### 添加新頁面

1. 在 `src/app/` 目錄下創建新的 `.mdx` 文件
2. 添加頁面元數據和章節信息
3. 更新導航配置 (如需要)

### 編輯操作手冊

操作手冊位於 `docs/usermanual/` 目錄，使用 Markdown 格式編寫。

## 🔍 搜索功能

- 支援全文搜索，自動索引所有 MDX 內容
- 使用 `⌘K` (Mac) 或 `Ctrl+K` (Windows) 快捷鍵
- 支援中文搜索和結果高亮

## 🎨 主題和樣式

- 使用 Tailwind CSS v4 最新語法
- 支援明暗主題自動切換
- 響應式設計，適配各種螢幕尺寸
- 優雅的字體排版和代碼高亮

## 📊 日誌和監控

- 統一的日誌記錄系統
- 日誌文件位於 `logs/` 目錄
- 支援不同級別的日誌輸出
- 自動按日期分割日誌文件

## 🤝 貢獻指南

1. Fork 本倉庫
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 📄 授權條款

本項目採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE.md) 文件。

## 📞 技術支援

如有問題或建議，請：

1. 查看 [操作手冊](docs/usermanual/)
2. 搜索 [Issues](https://github.com/AMIGO/amigo-helpcenter/issues)
3. 創建新的 Issue
4. 聯繫 AMIGO 技術支援團隊

---

**AMIGO 開發團隊** © 2025
