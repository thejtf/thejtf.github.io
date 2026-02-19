# 项目版本备份文档 - V1.13

**备份日期**: 2026年02月19日  
**项目版本**: V1.13  
**项目类型**: Hexo 静态博客

---

## 📋 版本信息

- **项目版本**: V1.13
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
- **日期格式**: `YYYY-MM-DD` (例如: 2026-02-19) - 用于文章列表中的日期显示
- **时间格式**: `HH:mm:ss`
- **更新选项**: mtime
- **注意**: location-bar 中的日期显示使用 JavaScript 动态计算，格式为 `Wednesday February 19`（不含年份）

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

### V1.13 主要更新（2026年02月19日）

#### 1. 新博文自动提交功能
- ✅ **问题修复**: 修复了新博文第二天自动消失的问题
- ✅ **根本原因**: 新博文未提交到 source 分支，GitHub Actions 每天从 source 分支拉取代码时找不到新文章
- ✅ **解决方案**: 在部署前自动检测并提交新博文到 source 分支

#### 2. 新增文件
- ✅ **scripts/auto-commit-posts.js**: Hexo 脚本，在 `hexo deploy` 前自动检测并提交新博文到 source 分支

#### 3. 更新文件
- ✅ **deploy-with-workflow.sh**: 添加部署前自动提交新博文的功能
- ✅ **daily-rebuild-and-deploy.sh**: 添加每日重建前自动提交新博文的功能

**修改前（V1.12）**：
- 新博文创建后只存在于本地磁盘
- 执行 `hexo d` 只部署到 master 分支
- source 分支没有新博文
- GitHub Actions 第二天重建时找不到新博文

**修改后（V1.13）**：
- 部署前自动检测 `source/_posts/` 目录下的新文件
- 自动执行 `git add`、`git commit`、`git push origin source`
- 新博文提交到 source 分支
- GitHub Actions 第二天重建时能正确找到所有博文

**技术细节**：
- 使用 `git status --porcelain "source/_posts/"` 检测未跟踪文件
- 使用 Hexo 事件钩子 `hexo.on('deployBefore')` 在部署前执行
- 支持三种部署方式：`./deploy-with-workflow.sh`、`hexo d`、`./daily-rebuild-and-deploy.sh`

### V1.12 主要更新（2026年01月01日）

#### 1. 站点信息更新
- ✅ **副标题更新**: 从 "用文字来感受世界" 更新为 "生活即创造"
- ✅ **描述更新**: 从 "Learn by making" 更新为 "Life by creating"

### V1.11 主要更新（2025年12月29日）

#### 1. RSS Feed 配置优化
- ✅ **自定义 RSS 标题**: RSS feed 标题从 "Jopus" 更新为 "Jopus的博客"
- ✅ **添加 RSS 图标**: 在 RSS feed 中添加 favicon 图标（https://jopus.cn/favicon.ico）
- ✅ **自定义模板**: 创建自定义 Atom XML 模板（`source/_atom.xml`），支持使用 `feed.title` 配置项

### V1.10 主要更新（2025年12月27日）

#### 1. 侧边栏边框样式统一
- ✅ **修复侧边栏边框颜色**: 将侧边栏左侧边框颜色从主题色（动态颜色）改为与文章列表项（posts-item）下边框一致的浅灰色

### V1.09 主要更新（2025年12月26日）

#### 1. 字体加载优化
- ✅ **API 升级**: 从旧的 Google Fonts API 升级到新的 CSS2 API
- ✅ **预连接优化**: 添加 `preconnect` 到 Google Fonts 服务器
- ✅ **预加载优化**: 添加 `preload` 字体 CSS 文件
- ✅ **异步加载策略**: 不阻塞页面渲染

### V1.08 主要更新（2025年12月26日）

#### 1. 侧边栏按钮UI修复
- ✅ **修复CSS语法错误**: 修复高度属性语法错误
- ✅ **修复背景图片消失问题**: 修复动态样式覆盖问题

### V1.07 主要更新（2025年12月26日）

#### 1. Favicon 更新
- ✅ **更新 favicon.ico**: 新的网站图标

### V1.06 主要更新（2025年12月26日）

#### 1. 动态主题色系统
- ✅ **根据日期自动切换主题色**: 实现基于星期几和纪念日的动态主题色切换
- ✅ **CSS 变量系统**: 所有主题色相关样式使用 CSS 变量 `var(--color-main)`

---

## 🔄 恢复步骤

如需恢复到 V1.13 版本，请按以下步骤操作：

### 方法1: 使用压缩包恢复（推荐，最完整）

```bash
# 1. 解压备份压缩包（从 /home/jopus/Backup 目录）
cd /home/jopus/Blog
tar -xzf /home/jopus/Backup/Blog_V1.13_Backup_20260219.tar.gz

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

# 切换到V1.13标签
git checkout v1.13

# 或者创建新分支基于V1.13
git checkout -b restore-v1.13 v1.13

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

# 3. 恢复自动提交脚本
# 确保 scripts/auto-commit-posts.js 文件存在

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
5. **新博文自动提交**: 
   - 确保 `scripts/auto-commit-posts.js` 文件存在
   - 确保 `deploy-with-workflow.sh` 包含自动提交逻辑
   - 确保 `daily-rebuild-and-deploy.sh` 包含自动提交逻辑
6. **部署流程**: 
   - 使用 `hexo clean && hexo g && hexo d` 时会自动提交新博文
   - 使用 `./deploy-with-workflow.sh` 时会自动提交新博文
   - 使用 `./daily-rebuild-and-deploy.sh` 时会自动提交新博文
7. **RSS Feed 配置**: 
   - 确保 `_config.yml` 中包含 `feed` 配置项
   - 确保 `source/_atom.xml` 自定义模板文件存在
8. **站点信息**:
   - 副标题：`生活即创造`
   - 描述：`Life by creating`

---

## 📌 版本快照说明

此文档记录了项目在 V1.13 版本时的完整配置状态，包括：
- ✅ 所有依赖包的版本号
- ✅ 主要配置文件的参数设置
- ✅ 主题配置信息
- ✅ 部署相关配置
- ✅ Node.js和npm版本信息
- ✅ 新博文自动提交功能
- ✅ RSS Feed 配置
- ✅ 动态主题色系统
- ✅ 压缩包备份（包含所有源文件和配置文件）

**建议**: 在升级到新版本前，请确保已保存此备份文档、Git标签和压缩包备份，以便需要时能够快速恢复到 V1.13 版本。

### 压缩包内容说明

压缩包 `/home/jopus/Backup/Blog_V1.13_Backup_20260219.tar.gz` 包含以下内容：
- ✅ `source/` - 所有源文件（文章、页面等）
- ✅ `themes/` - 完整主题文件
- ✅ `scaffolds/` - 模板文件
- ✅ `scripts/` - Hexo 脚本（包含 auto-commit-posts.js）
- ✅ `_config.yml` - 主配置文件
- ✅ `package.json` - 依赖配置
- ✅ `.github/workflows/` - GitHub Actions workflow 配置
- ✅ `deploy-with-workflow.sh` - 部署脚本（包含自动提交功能）
- ✅ `daily-rebuild.sh` - 本地自动重建脚本
- ✅ `daily-rebuild-and-deploy.sh` - 本地自动部署脚本（包含自动提交功能）
- ✅ 所有版本备份文档和设置文档

**排除内容**（可通过命令重新生成）：
- ❌ `node_modules/` - 可通过 `npm install` 重新安装
- ❌ `public/` - 可通过 `hexo generate` 重新生成
- ❌ `.git/` - 版本控制信息（建议使用Git标签恢复）
- ❌ `db.json` - Hexo缓存文件

---

## 🗂️ 备份文件位置

- **备份文档**: `VERSION_V1.13_BACKUP.md`（本文件）
- **Git标签**: `v1.13`（待创建）
- **压缩包备份**: `/home/jopus/Backup/Blog_V1.13_Backup_20260219.tar.gz`（待创建）

---

## 🔍 V1.13 关键变更详情

### 新博文自动提交功能

#### 问题描述
- 新博文创建后执行 `hexo d` 部署
- 第二天 GitHub Actions 自动重建后，新博文消失
- 老文章仍然存在

#### 根本原因
- GitHub Actions 从 `source` 分支拉取源代码
- 新博文只存在于本地磁盘，未提交到 `source` 分支
- 第二天重建时找不到新博文

#### 解决方案

**1. 新增 Hexo 脚本 `scripts/auto-commit-posts.js`**：
```javascript
const { execSync } = require('child_process');
const path = require('path');

hexo.on('deployBefore', function() {
  const baseDir = hexo.base_dir;
  
  try {
    process.chdir(baseDir);
    
    const status = execSync('git status --porcelain "source/_posts/"', { encoding: 'utf-8' });
    const newPosts = status.split('\n').filter(line => line.startsWith('??'));
    
    if (newPosts.length > 0) {
      hexo.log.info(`📝 发现 ${newPosts.length} 篇新博文，正在提交到 source 分支...`);
      
      execSync('git add "source/_posts/"', { stdio: 'inherit' });
      
      const date = new Date().toISOString().slice(0, 16).replace('T', ' ');
      execSync(`git commit -m "Add new posts: ${date}"`, { stdio: 'inherit' });
      
      execSync('git push origin source', { stdio: 'inherit' });
      
      hexo.log.info('✅ 新博文已提交到 source 分支');
    }
  } catch (error) {
    hexo.log.warn('⚠️  检查新博文时出错:', error.message);
  }
});
```

**2. 更新 `deploy-with-workflow.sh`**：
```bash
# 检查是否有新博文需要提交到 source 分支
echo "检查是否有新博文需要提交..."
NEW_POSTS=$(git status --porcelain "source/_posts/" 2>/dev/null | grep "^??")

if [ -n "$NEW_POSTS" ]; then
    echo "发现新博文，正在提交到 source 分支..."
    git add "source/_posts/"
    git commit -m "Add new posts: $(date '+%Y-%m-%d %H:%M')"
    git push origin source
    echo "✅ 新博文已提交到 source 分支"
fi
```

**3. 更新 `daily-rebuild-and-deploy.sh`**：
```bash
# 检查是否有新博文需要提交到 source 分支
echo "检查新博文..." >> "$LOG_FILE"
NEW_POSTS=$(git status --porcelain "source/_posts/" 2>/dev/null | grep "^??")

if [ -n "$NEW_POSTS" ]; then
    echo "发现新博文，正在提交到 source 分支..." >> "$LOG_FILE"
    git add "source/_posts/" >> "$LOG_FILE" 2>&1
    git commit -m "Add new posts: $(date '+%Y-%m-%d %H:%M')" >> "$LOG_FILE" 2>&1
    git push origin source >> "$LOG_FILE" 2>&1
    echo "✅ 新博文已提交到 source 分支" >> "$LOG_FILE"
fi
```

#### 支持的部署方式

| 部署方式 | 自动提交新博文 |
|---------|--------------|
| `hexo clean && hexo g && hexo d` | ✅ 支持（通过 auto-commit-posts.js） |
| `./deploy-with-workflow.sh` | ✅ 支持（通过脚本逻辑） |
| `./daily-rebuild-and-deploy.sh` | ✅ 支持（通过脚本逻辑） |

---

## 🎯 V1.13 核心功能

### 新博文自动提交（V1.13 新增）

1. **自动检测**：
   - 检测 `source/_posts/` 目录下的未跟踪文件
   - 在部署前自动提交到 source 分支

2. **多方式支持**：
   - `hexo d` 命令自动触发
   - 部署脚本自动触发
   - 每日重建脚本自动触发

3. **问题解决**：
   - 新博文不再会在第二天消失
   - GitHub Actions 能正确找到所有博文

### 站点信息（继承自 V1.12）

- 副标题：`生活即创造`
- 描述：`Life by creating`

### RSS Feed 配置（继承自 V1.11）

- RSS 标题：`Jopus的博客`
- RSS 图标：`https://jopus.cn/favicon.ico`

### 动态主题色系统（继承自 V1.06）

- 周一：金黄色 (#ebc65a)
- 周二：草绿色 (#9dab86)
- 周三：森林绿 (#6ba8a9)
- 周四：天空蓝 (#9be3de)
- 周五：海洋蓝 (#46b3e6)
- 周六：红色 (#FF585B)
- 周日：太阳橙 (#ffa259)
- 纪念日：灰色 (#cccccc)

### 自动化部署（继承自 V1.06）

- GitHub Actions：每天 UTC 16:10（北京时间 0:10）自动重建并部署

---

**文档创建时间**: 2026年02月19日  
**最后更新**: 2026年02月19日  
**版本**: V1.13
