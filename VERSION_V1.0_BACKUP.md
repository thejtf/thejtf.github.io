# 项目版本备份文档 - V1.0

**备份日期**: 2025年1月（当前日期）  
**项目版本**: V1.0  
**项目类型**: Hexo 静态博客

---

## 📋 版本信息

- **项目版本**: V1.0
- **Hexo 版本**: 6.3.0
- **Node.js 环境**: 请根据实际环境记录
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

#### 主题
- **当前主题**: paper

#### 部署配置
- **部署类型**: git
- **仓库分支**: master
- **仓库地址**: https://github.com/thejtf/thejtf.github.io.git

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

## 🔄 恢复步骤

如需恢复到 V1.0 版本，请按以下步骤操作：

### 1. 恢复依赖版本

```bash
# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 使用备份的 package.json 重新安装依赖
npm install
```

### 2. 恢复配置文件

```bash
# 恢复主配置文件
# 将备份的 _config.yml 内容复制到项目根目录

# 恢复主题配置文件
# 将备份的 themes/paper/_config.yml 内容复制到对应位置
```

### 3. 验证配置

```bash
# 清理缓存
npx hexo clean

# 生成静态文件
npx hexo generate

# 启动本地服务器验证
npx hexo server
```

---

## 📝 注意事项

1. **敏感信息**: 配置文件中可能包含敏感信息（如 GitHub Token），恢复时请注意安全
2. **Node.js 版本**: 确保使用的 Node.js 版本与 V1.0 兼容
3. **Git 仓库**: 恢复后检查 Git 远程仓库配置是否正确
4. **主题文件**: 确保 `themes/paper` 主题文件完整

---

## 📌 版本快照说明

此文档记录了项目在 V1.0 版本时的完整配置状态，包括：
- ✅ 所有依赖包的版本号
- ✅ 主要配置文件的参数设置
- ✅ 主题配置信息
- ✅ 部署相关配置

**建议**: 在升级到新版本前，请确保已保存此备份文档，以便需要时能够快速恢复到 V1.0 版本。

---

**文档创建时间**: 2025年1月  
**最后更新**: 2025年1月

