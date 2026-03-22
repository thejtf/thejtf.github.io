# 项目版本备份文档 - V1.17

**备份日期**: 2026年03月22日
**项目版本**: V1.17
**项目类型**: Hexo 静态博客

---

## 📋 版本信息

- **项目版本**: V1.17
- **Hexo 版本**: 6.3.0
- **Node.js 环境**: v20.19.6
- **npm 版本**: 10.8.2
- **主题**: paper

---

## 🆕 V1.17 更新内容

### 新增功能

#### 1. 新增 Readme 页面

创建个人介绍页面 `/readme/`，包含以下内容：
- 关于我：个人简介（INFP、产品运营）
- 我是谁：个人成长历程
- 我在想什么：关于社会、技术、存在主义的思考
- 我喜欢什么：音乐、电影、阅读、记录
- 我在做什么：产品运营、自媒体、博客
- 我想说什么：个人价值观与选择

#### 2. 导航菜单更新

- 顶部导航菜单：Home / Readme / Note
- 侧边栏 Links 顺序：公开笔记 → Readme → RSS 订阅

### 修改文件

```
source/readme/index.md           # 新增 Readme 页面
themes/paper/_config.yml         # 更新菜单和 Links 配置
```

---

## 🔄 备份恢复方式

### 恢复步骤

1. **克隆项目**
```bash
git clone -b source git@github.com:thejtf/thejtf.github.io.git
cd thejtf.github.io
npm install
```

2. **启动本地预览**
```bash
npm run server
# 访问 http://localhost:4000/
```

3. **验证功能**
- 访问 http://localhost:4000/readme/ 查看 Readme 页面
- 检查顶部导航菜单显示 Readme
- 检查侧边栏 Links 显示 Readme 链接

4. **部署**
```bash
npm run deploy
```

### 关键文件说明

| 文件 | 用途 |
|------|------|
| `source/readme/index.md` | Readme 页面内容 |
| `themes/paper/_config.yml` | 主题配置（菜单、Links） |

---

## 📊 项目统计

- 博客文章: 25+ 篇
- 笔记文章: 39 篇
- 页面: Readme、Note