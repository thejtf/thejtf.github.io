# 项目版本备份文档 - V1.06

**备份日期**: 2025年12月26日  
**项目版本**: V1.06  
**项目类型**: Hexo 静态博客

---

## 📋 版本信息

- **项目版本**: V1.06
- **Hexo 版本**: 6.3.0
- **Node.js 环境**: v20.19.6
- **npm 版本**: 10.8.2
- **主题**: paper

---

## 🔧 核心依赖版本

### Hexo 核心及插件

```json
{
  "hexo": "^6.3.0",
  "hexo-deployer-git": "^4.0.0",
  "hexo-generator-archive": "^2.0.0",
  "hexo-generator-category": "^2.0.0",
  "hexo-generator-feed": "^3.0.0",
  "hexo-generator-index-pin-top": "^0.2.2",
  "hexo-generator-tag": "^2.0.0",
  "hexo-renderer-ejs": "^2.0.0",
  "hexo-renderer-jade": "^0.5.0",
  "hexo-renderer-marked": "^6.0.0",
  "hexo-renderer-stylus": "^2.1.0",
  "hexo-server": "^3.0.0",
  "hexo-theme-landscape": "^0.0.3"
}
```

---

## ⚙️ 主要配置文件参数

### `_config.yml` 关键配置

#### 站点信息
- **标题**: Jopus
- **副标题**: 用文字来感受世界
- **描述**: Learn by making
- **作者**: Jopus
- **语言**: zh-CN
- **时区**: Asia/Shanghai

#### URL 配置
- **站点 URL**: http://thejtf.github.io
- **永久链接格式**: `:year/:month/:day/:title/`
- **尾部索引**: true
- **尾部 HTML**: true

#### 目录配置
- **源文件目录**: source
- **公共目录**: public
- **标签目录**: tags
- **归档目录**: archives
- **分类目录**: categories

#### 写作配置
- **新文章文件名**: `:title.md`
- **默认布局**: post
- **外部链接**: 在新标签页打开
- **代码高亮**: 启用 hljs
- **行号显示**: 关闭

#### 首页设置
- **每页文章数**: 10
- **排序方式**: 按日期降序

#### 分页设置
- **每页显示**: 10
- **分页目录**: page

#### 日期/时间格式
- **日期格式**: `YYYY-MM-DD` (例如: 2025-12-26) - 用于文章列表中的日期显示
- **时间格式**: `HH:mm:ss`
- **更新选项**: mtime
- **注意**: location-bar 中的日期显示使用 JavaScript 动态计算，格式为 `Friday December 26`（不含年份）

#### 主题
- **当前主题**: paper

#### 部署配置
- **部署类型**: git
- **仓库分支**: master
- **仓库地址**: git@github.com:thejtf/thejtf.github.io.git

### `themes/paper/_config.yml` 关键配置

#### 语言设置
- **HTML 语言**: zh

#### 菜单导航
- Home: /
- About: /about

#### 样式表
- Highlight.js: 9.6.0 (GitHub 样式)
- 字体: Noto Serif SC, Abril Fatface

#### 社交链接
- RSS 订阅: https://jopus.cn/atom.xml
- 公开笔记: https://notes.jopus.cn

#### 主题颜色
- **主色调**: default

#### Google Analytics
- **ID**: G-Y6V8LR8RMR

#### 评论模块
- **启用状态**: false
- **类型**: utterances
- **仓库**: thejtf/thejtf.github.io
- **主题**: boxy-light

---

## 📦 package.json 完整内容

```json
{
  "name": "hexo-site",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "build": "hexo generate",
    "clean": "hexo clean",
    "deploy": "hexo deploy",
    "server": "hexo server"
  },
  "hexo": {
    "version": "6.3.0"
  },
  "dependencies": {
    "hexo": "^6.3.0",
    "hexo-deployer-git": "^4.0.0",
    "hexo-generator-archive": "^2.0.0",
    "hexo-generator-category": "^2.0.0",
    "hexo-generator-feed": "^3.0.0",
    "hexo-generator-index-pin-top": "^0.2.2",
    "hexo-generator-tag": "^2.0.0",
    "hexo-renderer-ejs": "^2.0.0",
    "hexo-renderer-jade": "^0.5.0",
    "hexo-renderer-marked": "^6.0.0",
    "hexo-renderer-stylus": "^2.1.0",
    "hexo-server": "^3.0.0",
    "hexo-theme-landscape": "^0.0.3"
  }
}
```

---

## 📝 版本历史

### V1.06 主要更新（2025年12月26日）

#### 1. 动态主题色系统
- ✅ **根据日期自动切换主题色**: 实现基于星期几和纪念日的动态主题色切换
  - 周一：金黄色 (Default - #ebc65a)
  - 周二：草绿色 (Grass - #9dab86)
  - 周三：森林绿 (Forest - #6ba8a9)
  - 周四：天空蓝 (Sky - #9be3de)
  - 周五：海洋蓝 (Sea - #46b3e6)
  - 周六：红色 (Red - #FF585B)
  - 周日：太阳橙 (Sun - #ffa259)
  - 纪念日（4月4日、4月5日、9月18日、12月13日）：灰色 (Gray - #cccccc)
- ✅ **默认主题色改为灰色**: 将 CSS 默认主题色从金黄色改为灰色（#cccccc），减少颜色切换时的视觉冲击
- ✅ **CSS 变量系统**: 所有主题色相关样式使用 CSS 变量 `var(--color-main)`，支持动态切换
- ✅ **早期样式注入**: 使用 `document.write` 在 HTML 解析时立即注入主题色样式，减少闪烁

**修改文件**：
- `themes/paper/source/css/var.styl` - 添加 CSS 变量默认值（灰色）
- `themes/paper/source/css/index.styl` - 使用 CSS 变量
- `themes/paper/source/css/post.styl` - 使用 CSS 变量
- `themes/paper/source/css/includes/_posts.styl` - 使用 CSS 变量
- `themes/paper/source/css/includes/_toc.styl` - 使用 CSS 变量
- `themes/paper/source/css/includes/_sidebar.styl` - 使用 CSS 变量
- `themes/paper/source/css/includes/_paginator.styl` - 使用 CSS 变量
- `themes/paper/source/css/includes/_footer.styl` - 使用 CSS 变量
- `themes/paper/source/js/paper.js` - 添加动态主题色切换逻辑
- `themes/paper/layout/includes/layout.pug` - 添加早期样式注入脚本

#### 2. 分页器样式修复
- ✅ **修复页码背景色问题**: 页码链接不再显示主题色背景，只有前一页/下一页按钮有背景色

**修改文件**：
- `themes/paper/source/js/paper.js` - 将 `.paginator a` 改为 `.paginator .extend`

#### 3. 自动化部署配置
- ✅ **GitHub Actions Workflow**: 创建每日自动重建和部署的 GitHub Actions workflow
- ✅ **本地 Cron 任务**: 创建每日自动重建的本地 cron 任务脚本

**新增文件**：
- `.github/workflows/deploy.yml` - GitHub Actions workflow 配置
- `daily-rebuild.sh` - 本地自动重建脚本
- `daily-rebuild-and-deploy.sh` - 本地自动重建并部署脚本
- `CRON_SETUP.md` - Cron 任务设置文档
- `GITHUB_ACTIONS_SETUP.md` - GitHub Actions 设置文档

#### 4. 日期格式优化（保留之前版本的功能）
- ✅ **location-bar 日期格式简化**: 去掉年份显示，日期格式从 `Friday December 26 2025` 改为 `Friday December 26`
- ✅ **post__date 格式恢复**: 保持文章列表中的日期格式为原来的 `YYYY-MM-DD` 格式

**日期格式说明**：
- **location-bar（首页日期显示）**: `Friday December 26` - 使用 JavaScript 动态计算，不含年份
- **post__date（文章列表日期）**: `2025-12-26` - 使用 Hexo 的 `date_format` 配置，保持原来的 `YYYY-MM-DD` 格式

### V1.05 主要更新
- ✅ **日期格式优化**: 将首页日期格式从 `Friday December 26 2025` 改为 `Friday December 26`（移除年份）
- ✅ **日期格式分离**: 首页日期显示（location-bar）和文章列表日期（post__date）使用不同的格式
- ✅ **恢复文章日期格式**: 将 `_config.yml` 中的 `date_format` 恢复为 `YYYY-MM-DD`，用于文章列表日期显示

### V1.04 主要更新
- ✅ **日期显示格式优化**: 将日期格式从 `YYYY-MM-DD HH:mm:ss` 改为 `Friday December 26 2025` 格式
- ✅ **JavaScript 日期格式化**: 更新 `location-bar.pug` 中的日期显示逻辑，使用英文星期和月份名称
- ✅ **Hexo 日期格式配置**: 更新 `_config.yml` 中的 `date_format` 为 `dddd MMMM D YYYY`，使文章列表中的日期也使用新格式

### V1.03 主要更新
- 字体大小统一优化（从1.4rem调整为1.6rem）
- 浏览器标签页标题优化（显示"Jopus的博客"）

### V1.02 主要更新
- 字体大小统一优化（从1.4rem调整为1.6rem）
- 浏览器标签页标题优化（显示"Jopus的博客"）

### V1.01 主要更新
- 移动端分页优化

### V1.0 初始版本
- 基础Hexo博客配置
- Paper主题配置

---

## 🔄 恢复步骤

如需恢复到 V1.06 版本，请按以下步骤操作：

### 方法1: 使用压缩包恢复（推荐，最完整）

```bash
# 1. 解压备份压缩包（从 /home/jopus/Backup 目录）
cd /home/jopus/Blog
tar -xzf /home/jopus/Backup/Blog_V1.06_Backup_20251226.tar.gz

# 2. 安装依赖
npm install

# 3. 清理并重新生成
npx hexo clean
npx hexo generate

# 4. 启动服务器验证
npx hexo server
```

### 方法2: 使用Git标签恢复

```bash
# 查看所有标签
git tag

# 切换到V1.06标签
git checkout v1.06

# 或者创建新分支基于V1.06
git checkout -b restore-v1.06 v1.06

# 安装依赖
npm install

# 清理并重新生成
npx hexo clean
npx hexo generate
```

### 方法3: 手动恢复配置文件

```bash
# 1. 恢复依赖版本
rm -rf node_modules package-lock.json
npm install

# 2. 恢复主配置文件
# 将备份的 _config.yml 内容复制到项目根目录
# 特别注意：date_format 应设置为 YYYY-MM-DD（用于文章日期显示）

# 3. 恢复主题配置文件
# 将备份的 themes/paper/_config.yml 内容复制到对应位置

# 4. 恢复 location-bar.pug
# 将备份的 themes/paper/layout/includes/location-bar.pug 内容复制到对应位置

# 5. 验证配置
npx hexo clean
npx hexo generate
npx hexo server
```

---

## 📝 注意事项

1. **敏感信息**: 配置文件中可能包含敏感信息（如 GitHub SSH密钥），恢复时请注意安全
2. **Node.js 版本**: 确保使用的 Node.js 版本为 v20.19.6 或兼容版本
3. **Git 仓库**: 恢复后检查 Git 远程仓库配置是否正确
4. **主题文件**: 确保 `themes/paper` 主题文件完整
5. **日期格式**: 
   - location-bar（首页日期）: `Friday December 26` - JavaScript 动态计算，不含年份
   - post__date（文章日期）: `2025-12-26` - 使用 `YYYY-MM-DD` 格式（与 V1.03 及之前版本一致）
6. **JavaScript 日期显示**: location-bar 中的日期显示已更新为不含年份的英文格式

---

## 📌 版本快照说明

此文档记录了项目在 V1.06 版本时的完整配置状态，包括：
- ✅ 所有依赖包的版本号
- ✅ 主要配置文件的参数设置
- ✅ 主题配置信息
- ✅ 部署相关配置
- ✅ Node.js和npm版本信息
- ✅ 日期格式配置（post__date 使用 YYYY-MM-DD，location-bar 使用 JavaScript 显示 Friday December 26）
- ✅ 压缩包备份（包含所有源文件和配置文件）

**建议**: 在升级到新版本前，请确保已保存此备份文档、Git标签和压缩包备份，以便需要时能够快速恢复到 V1.06 版本。

### 压缩包内容说明

压缩包 `/home/jopus/Backup/Blog_V1.06_Backup_20251226.tar.gz` 包含以下内容：
- ✅ `source/` - 所有源文件（文章、页面等）
- ✅ `themes/` - 完整主题文件（包含动态主题色功能）
- ✅ `scaffolds/` - 模板文件
- ✅ `_config.yml` - 主配置文件
- ✅ `package.json` - 依赖配置
- ✅ `.github/workflows/` - GitHub Actions workflow 配置
- ✅ `daily-rebuild.sh` - 本地自动重建脚本
- ✅ `daily-rebuild-and-deploy.sh` - 本地自动部署脚本
- ✅ 所有版本备份文档和设置文档

**排除内容**（可通过命令重新生成）：
- ❌ `node_modules/` - 可通过 `npm install` 重新安装
- ❌ `public/` - 可通过 `hexo generate` 重新生成
- ❌ `.git/` - 版本控制信息（建议使用Git标签恢复）
- ❌ `db.json` - Hexo缓存文件
- ❌ `.cursor/` - Cursor IDE 配置和日志

---

## 🗂️ 备份文件位置

- **备份文档**: `VERSION_V1.06_BACKUP.md`（本文件）
- **Git标签**: `v1.06`（待创建）
- **压缩包备份**: `/home/jopus/Backup/Blog_V1.06_Backup_20251226.tar.gz`（已创建，2.5MB，包含376个文件/目录）

---

## 🔍 V1.06 关键变更详情

### 日期格式变更（去掉年份）

#### 1. JavaScript 日期显示（location-bar.pug）

**变更前（V1.04）**：
```javascript
var now = new Date();
var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var weekday = weekdays[now.getDay()];
var month = months[now.getMonth()];
var day = now.getDate();
var year = now.getFullYear();
var timeString = weekday + ' ' + month + ' ' + day + ' ' + year;
// 输出: Friday December 26 2025
```

**变更后（V1.06）**：
```javascript
var now = new Date();
var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var weekday = weekdays[now.getDay()];
var month = months[now.getMonth()];
var day = now.getDate();
var timeString = weekday + ' ' + month + ' ' + day;
// 输出: Friday December 26
```

**主要变化**：
- ❌ 移除了 `var year = now.getFullYear();` 变量
- ❌ 移除了 `timeString` 中的年份部分

#### 2. Hexo 日期格式配置（_config.yml）

**变更前（V1.04）**：
```yaml
date_format: dddd MMMM D YYYY
```

**变更后（V1.06）**：
```yaml
date_format: YYYY-MM-DD
```

**说明**: 
- V1.05 将 `date_format` 恢复为 `YYYY-MM-DD` 格式，用于文章列表中的日期显示（`post__date`）
- V1.06 在此基础上添加了动态主题色系统和自动化部署功能
- location-bar 中的日期显示使用独立的 JavaScript 代码，格式为 `Friday December 26`（不含年份）
- 这样实现了两种不同的日期显示格式：文章日期使用传统的 `YYYY-MM-DD`，首页日期使用友好的英文格式

---

---

## 🎯 V1.06 核心功能

### 动态主题色系统

1. **根据日期自动切换**：
   - 周一：金黄色 (#ebc65a)
   - 周二：草绿色 (#9dab86)
   - 周三：森林绿 (#6ba8a9)
   - 周四：天空蓝 (#9be3de)
   - 周五：海洋蓝 (#46b3e6)
   - 周六：红色 (#FF585B)
   - 周日：太阳橙 (#ffa259)
   - 纪念日（4月4日、4月5日、9月18日、12月13日）：灰色 (#cccccc)

2. **默认主题色**：灰色 (#cccccc)，减少颜色切换时的视觉冲击

3. **技术实现**：
   - CSS 变量系统 (`--color-main`)
   - JavaScript 动态计算和注入
   - 早期样式注入防止闪烁

### 自动化部署

1. **GitHub Actions**：每天 UTC 16:10（北京时间 0:10）自动重建并部署
2. **本地 Cron 任务**：每天 0:10 自动重建（可选）

### 样式修复

1. **分页器修复**：页码不再显示主题色背景，只有前一页/下一页按钮有背景色

---

**文档创建时间**: 2025年12月26日  
**最后更新**: 2025年12月26日  
**版本**: V1.06

