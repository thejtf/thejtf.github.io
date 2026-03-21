# 项目版本备份文档 - V1.12

**备份日期**: 2026年01月01日  
**项目版本**: V1.12  
**项目类型**: Hexo 静态博客

---

## 📋 版本信息

- **项目版本**: V1.12
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
- **副标题**: 生活即创造
- **描述**: Life by creating
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
- **日期格式**: `YYYY-MM-DD` (例如: 2026-01-01) - 用于文章列表中的日期显示
- **时间格式**: `HH:mm:ss`
- **更新选项**: mtime
- **注意**: location-bar 中的日期显示使用 JavaScript 动态计算，格式为 `Sunday January 1`（不含年份）

#### RSS Feed 配置
- **类型**: atom
- **路径**: atom.xml
- **文章数量限制**: 20
- **RSS 标题**: Jopus的博客
- **RSS 图标**: https://jopus.cn/favicon.ico
- **自定义模板**: ./source/_atom.xml

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
- **字体**: Noto Serif SC (400, 500, 700), Abril Fatface
- **字体加载**: 已优化到 layout.pug 中，使用预连接和预加载策略

#### 社交链接
- RSS 订阅: https://jopus.cn/atom.xml
- 公开笔记: https://notes.jopus.cn

#### 主题颜色
- **主色调**: default（动态切换，根据日期自动变化）

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
    "deploy:keep-workflow": "./deploy-with-workflow.sh",
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

### V1.12 主要更新（2026年01月01日）

#### 1. 站点信息更新
- ✅ **副标题更新**: 从 "用文字来感受世界" 更新为 "生活即创造"
- ✅ **描述更新**: 从 "Learn by making" 更新为 "Life by creating"

**修改前（V1.11）**：
- 副标题：`用文字来感受世界`
- 描述：`Learn by making`

**修改后（V1.12）**：
- 副标题：`生活即创造`
- 描述：`Life by creating`

**修改文件**：
- `_config.yml` - 更新站点信息（第7-8行）

**技术细节**：
- 副标题：`subtitle: '生活即创造'`
- 描述：`description: 'Life by creating'`

### V1.11 主要更新（2025年12月29日）

#### 1. RSS Feed 配置优化
- ✅ **自定义 RSS 标题**: RSS feed 标题从 "Jopus" 更新为 "Jopus的博客"
- ✅ **添加 RSS 图标**: 在 RSS feed 中添加 favicon 图标（https://jopus.cn/favicon.ico）
- ✅ **自定义模板**: 创建自定义 Atom XML 模板（`source/_atom.xml`），支持使用 `feed.title` 配置项
- ✅ **配置项修正**: 将配置项从 `feed_generator` 修正为 `feed`（正确的配置项名称）

### V1.10 主要更新（2025年12月27日）

#### 1. 侧边栏边框样式统一
- ✅ **修复侧边栏边框颜色**: 将侧边栏左侧边框颜色从主题色（动态颜色）改为与文章列表项（posts-item）下边框一致的浅灰色
- ✅ **移除JavaScript覆盖**: 移除了 `paper.js` 中对侧边栏边框颜色的主题色覆盖，让CSS样式生效
- ✅ **样式统一**: 侧边栏左侧边框现在使用 `1px solid lighten($color-gray, 70%)`，与 `posts-item` 的下边框样式完全一致
- ✅ **视觉效果**: 侧边栏边框不再随日期变化而改变颜色，保持与文章列表一致的视觉风格

### V1.09 主要更新（2025年12月26日）

#### 1. 字体加载优化
- ✅ **API 升级**: 从旧的 Google Fonts API (`/css?`) 升级到新的 CSS2 API (`/css2?`)
- ✅ **字体子集化**: 使用 `subset=chinese-simplified` 参数，只加载简体中文字符，减少字体文件大小
- ✅ **预连接优化**: 添加 `preconnect` 到 `fonts.googleapis.com` 和 `fonts.gstatic.com`，提前建立连接，减少 DNS 查询和连接建立时间（约 50-100ms）
- ✅ **预加载优化**: 添加 `preload` 字体 CSS 文件，高优先级加载，更快开始下载
- ✅ **异步加载策略**: 使用 `media="print" onload="this.media='all'"` 技巧，不阻塞页面渲染，字体在后台加载
- ✅ **回退方案**: 添加 `<noscript>` 标签，确保无 JavaScript 时也能加载字体

### V1.08 主要更新（2025年12月26日）

#### 1. 侧边栏按钮UI修复
- ✅ **修复CSS语法错误**: 修复 `themes/paper/source/css/includes/_sidebar.styl` 第55行的语法错误，将 `height 3rem` 改为 `height: 3rem`（缺少冒号导致高度样式未生效）
- ✅ **修复背景图片消失问题**: 修复动态样式覆盖问题，将 `paper.js` 中的 `.sidebar__button` 样式从 `background: ${colorMain} !important;` 改为 `background-color: ${colorMain} !important;`，避免覆盖 `background-image` 属性

### V1.07 主要更新（2025年12月26日）

#### 1. Favicon 更新
- ✅ **更新 favicon.ico**: 从 Mac 桌面传输新的 favicon.ico 文件到主题目录
- ✅ **文件位置**: `themes/paper/source/favicon.ico`
- ✅ **自动生成**: Hexo 生成时会自动将 favicon.ico 复制到 `public/` 目录

### V1.06 主要更新（2025年12月26日）

#### 1. 动态主题色系统
- ✅ **根据日期自动切换主题色**: 实现基于星期几和纪念日的动态主题色切换
- ✅ **CSS 变量系统**: 所有主题色相关样式使用 CSS 变量 `var(--color-main)`，支持动态切换
- ✅ **早期样式注入**: 使用内联脚本在 HTML 解析时立即注入主题色样式，减少闪烁

---

## 🔄 恢复步骤

如需恢复到 V1.12 版本，请按以下步骤操作：

### 方法1: 使用压缩包恢复（推荐，最完整）

```bash
# 1. 解压备份压缩包（从 /home/jopus/Backup 目录）
cd /home/jopus/Blog
tar -xzf /home/jopus/Backup/Blog_V1.12_Backup_20260101.tar.gz

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

# 切换到V1.12标签
git checkout v1.12

# 或者创建新分支基于V1.12
git checkout -b restore-v1.12 v1.12

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
# 特别注意：确保包含 feed 配置项（第112-119行）
# 确保副标题为 "生活即创造"，描述为 "Life by creating"

# 3. 恢复自定义 RSS 模板
# 确保 source/_atom.xml 文件存在

# 4. 验证配置
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
5. **RSS Feed 配置**: 
   - 确保 `_config.yml` 中包含 `feed` 配置项（不是 `feed_generator`）
   - 确保 `source/_atom.xml` 自定义模板文件存在
   - RSS 标题：`Jopus的博客`
   - RSS 图标：`https://jopus.cn/favicon.ico`
6. **站点信息**:
   - 副标题：`生活即创造`
   - 描述：`Life by creating`
7. **日期格式**: 
   - location-bar（首页日期）: `Sunday January 1` - JavaScript 动态计算，不含年份
   - post__date（文章日期）: `2026-01-01` - 使用 `YYYY-MM-DD` 格式
8. **Favicon 文件**: 确保 `themes/paper/source/favicon.ico` 文件存在且为最新版本
9. **字体加载**: 字体加载已从 `_config.yml` 移动到 `layout.pug`，使用优化的预连接和预加载策略
10. **侧边栏边框**: 侧边栏左侧边框使用浅灰色（`lighten($color-gray, 70%)`），与文章列表项下边框样式一致

---

## 📌 版本快照说明

此文档记录了项目在 V1.12 版本时的完整配置状态，包括：
- ✅ 所有依赖包的版本号
- ✅ 主要配置文件的参数设置
- ✅ 主题配置信息
- ✅ 部署相关配置
- ✅ Node.js和npm版本信息
- ✅ RSS Feed 配置（标题、图标、自定义模板）
- ✅ 日期格式配置（post__date 使用 YYYY-MM-DD，location-bar 使用 JavaScript 显示 Sunday January 1）
- ✅ Favicon 文件更新
- ✅ 侧边栏按钮UI修复
- ✅ 字体加载优化（预连接、预加载、异步加载）
- ✅ 侧边栏边框样式统一（与文章列表项下边框一致）
- ✅ 站点信息更新（副标题：生活即创造，描述：Life by creating）
- ✅ 压缩包备份（包含所有源文件和配置文件）

**建议**: 在升级到新版本前，请确保已保存此备份文档、Git标签和压缩包备份，以便需要时能够快速恢复到 V1.12 版本。

### 压缩包内容说明

压缩包 `/home/jopus/Backup/Blog_V1.12_Backup_20260101.tar.gz` 包含以下内容：
- ✅ `source/` - 所有源文件（文章、页面等，包含 `_atom.xml` 自定义模板）
- ✅ `themes/` - 完整主题文件（包含动态主题色功能、更新的 favicon.ico、侧边栏按钮修复、字体加载优化和侧边栏边框样式统一）
- ✅ `scaffolds/` - 模板文件
- ✅ `_config.yml` - 主配置文件（包含 RSS Feed 配置和更新的站点信息）
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

- **备份文档**: `VERSION_V1.12_BACKUP.md`（本文件）
- **Git标签**: `v1.12`（待创建）
- **压缩包备份**: `/home/jopus/Backup/Blog_V1.12_Backup_20260101.tar.gz`（待创建）

---

## 🔍 V1.12 关键变更详情

### 站点信息更新

#### 修改前（V1.11）
- 副标题：`用文字来感受世界`
- 描述：`Learn by making`

#### 修改后（V1.12）
- 副标题：`生活即创造`
- 描述：`Life by creating`

#### 技术细节
- **配置文件**: `_config.yml`
- **副标题位置**: 第7行 `subtitle: '生活即创造'`
- **描述位置**: 第8行 `description: 'Life by creating'`

#### 修改原因
- 更新站点副标题和描述，更好地反映博客主题和理念

---

## 🎯 V1.12 核心功能

### 站点信息更新（V1.12 新增）

1. **副标题更新**：
   - 从 "用文字来感受世界" 更新为 "生活即创造"
   - 更好地体现博客的创作理念

2. **描述更新**：
   - 从 "Learn by making" 更新为 "Life by creating"
   - 与副标题形成呼应，强调创造与生活的关系

### RSS Feed 配置优化（继承自 V1.11）

1. **自定义 RSS 标题**：
   - RSS feed 标题独立于网站标题
   - 标题：`Jopus的博客`

2. **RSS 图标支持**：
   - 在 RSS feed 中添加 favicon 图标
   - 图标 URL：`https://jopus.cn/favicon.ico`

3. **自定义模板**：
   - 创建自定义 Atom XML 模板
   - 支持 `feed.title` 和 `feed.icon` 配置项

### 侧边栏边框样式统一（继承自 V1.10）

1. **样式统一**：
   - 侧边栏左侧边框与文章列表项下边框使用相同的浅灰色
   - 保持整体视觉一致性

2. **移除动态覆盖**：
   - JavaScript 不再动态覆盖侧边栏边框颜色
   - 边框颜色保持稳定，不受主题色变化影响

### 字体加载优化（继承自 V1.09）

1. **预连接优化**：
   - 提前建立与 Google Fonts 的连接
   - 减少 DNS 查询和连接建立时间（约 50-100ms）

2. **预加载优化**：
   - 提前下载字体 CSS 文件
   - 高优先级加载，更快开始下载

3. **异步加载策略**：
   - 不阻塞页面渲染
   - 字体在后台加载

4. **字体子集化**：
   - 只加载简体中文字符
   - 减少字体文件大小

5. **回退方案**：
   - 无 JavaScript 时也能加载字体

### 动态主题色系统（继承自 V1.06）

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

**注意**：侧边栏边框不再受主题色影响，保持浅灰色。

### 自动化部署（继承自 V1.06）

1. **GitHub Actions**：每天 UTC 16:10（北京时间 0:10）自动重建并部署
2. **本地 Cron 任务**：每天 0:10 自动重建（可选）

### 样式修复（继承自 V1.06）

1. **分页器修复**：页码不再显示主题色背景，只有前一页/下一页按钮有背景色

### Favicon 更新（继承自 V1.07）

1. **新的网站图标**：更新 favicon.ico 文件，提升品牌识别度

### 侧边栏按钮修复（继承自 V1.08）

1. **CSS语法修复**：修复高度属性语法错误
2. **背景图片修复**：修复动态样式覆盖问题，确保背景图片正常显示

---

**文档创建时间**: 2026年01月01日  
**最后更新**: 2026年01月01日  
**版本**: V1.12

