# 项目版本备份文档 - V1.05

**备份日期**: 2025年12月26日  
**项目版本**: V1.05  
**项目类型**: Hexo 静态博客

---

## 📋 版本信息

- **项目版本**: V1.05
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
- **日期格式**: `dddd MMMM D` (例如: Friday December 26)
- **时间格式**: `HH:mm:ss`
- **更新选项**: mtime

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

### V1.05 主要更新
- ✅ **日期格式简化**: 去掉年份显示，日期格式从 `Friday December 26 2025` 改为 `Friday December 26`
- ✅ **JavaScript 日期格式化**: 更新 `location-bar.pug` 中的日期显示逻辑，移除年份变量和显示
- ✅ **Hexo 日期格式配置**: 更新 `_config.yml` 中的 `date_format` 为 `dddd MMMM D`，使文章列表中的日期也不显示年份

**修改文件**：
- `themes/paper/layout/includes/location-bar.pug` - JavaScript 日期格式化函数（移除年份）
- `_config.yml` - 日期格式配置（从 `dddd MMMM D YYYY` 改为 `dddd MMMM D`）

**日期格式对比**：
- **V1.04**: `Friday December 26 2025`
- **V1.05**: `Friday December 26` ⬆️ 更简洁的日期格式（不含年份）

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

如需恢复到 V1.05 版本，请按以下步骤操作：

### 方法1: 使用压缩包恢复（推荐，最完整）

```bash
# 1. 解压备份压缩包（从 /home/jopus 目录）
cd /home/jopus/Blog
tar -xzf /home/jopus/Blog_V1.05_Backup_20251226.tar.gz

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

# 切换到V1.05标签
git checkout v1.05

# 或者创建新分支基于V1.05
git checkout -b restore-v1.05 v1.05

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
# 特别注意：date_format 应设置为 dddd MMMM D

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
5. **日期格式**: V1.05版本使用 `dddd MMMM D` 格式（例如: Friday December 26），不显示年份
6. **JavaScript 日期显示**: location-bar 中的日期显示已更新为不含年份的英文格式

---

## 📌 版本快照说明

此文档记录了项目在 V1.05 版本时的完整配置状态，包括：
- ✅ 所有依赖包的版本号
- ✅ 主要配置文件的参数设置
- ✅ 主题配置信息
- ✅ 部署相关配置
- ✅ Node.js和npm版本信息
- ✅ 日期格式配置（dddd MMMM D，不含年份）
- ✅ 压缩包备份（包含所有源文件和配置文件）

**建议**: 在升级到新版本前，请确保已保存此备份文档、Git标签和压缩包备份，以便需要时能够快速恢复到 V1.05 版本。

### 压缩包内容说明

压缩包 `/home/jopus/Blog_V1.05_Backup_20251226.tar.gz` 包含以下内容：
- ✅ `source/` - 所有源文件（文章、页面等）
- ✅ `themes/` - 完整主题文件
- ✅ `scaffolds/` - 模板文件
- ✅ `_config.yml` - 主配置文件
- ✅ `package.json` - 依赖配置
- ✅ 所有版本备份文档

**排除内容**（可通过命令重新生成）：
- ❌ `node_modules/` - 可通过 `npm install` 重新安装
- ❌ `public/` - 可通过 `hexo generate` 重新生成
- ❌ `.git/` - 版本控制信息（建议使用Git标签恢复）
- ❌ `db.json` - Hexo缓存文件

---

## 🗂️ 备份文件位置

- **备份文档**: `VERSION_V1.05_BACKUP.md`（本文件）
- **Git标签**: `v1.05`（已创建）
- **压缩包备份**: `/home/jopus/Blog_V1.05_Backup_20251226.tar.gz`（已创建，159KB，包含115个文件/目录）

---

## 🔍 V1.05 关键变更详情

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

**变更后（V1.05）**：
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

**变更后（V1.05）**：
```yaml
date_format: dddd MMMM D
```

**说明**: 使用 Moment.js 格式，`dddd` 表示完整星期名称，`MMMM` 表示完整月份名称，`D` 表示日期（不带前导零）。移除了 `YYYY`（年份）部分。

---

**文档创建时间**: 2025年12月26日  
**最后更新**: 2025年12月26日

