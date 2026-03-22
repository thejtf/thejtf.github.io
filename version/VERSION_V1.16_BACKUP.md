# 项目版本备份文档 - V1.16

**备份日期**: 2026年03月22日
**项目版本**: V1.16
**项目类型**: Hexo 静态博客

---

## 📋 版本信息

- **项目版本**: V1.16
- **Hexo 版本**: 6.3.0
- **Node.js 环境**: v20.19.6
- **npm 版本**: 10.8.2
- **主题**: paper

---

## 🆕 V1.16 更新内容

### 新增功能

#### 1. 侧边栏内容分离

主页与 note 页面的侧边栏内容完全独立：

| 页面 | Archives | Categories | Tags |
|------|----------|------------|------|
| 主页 | `_posts` 文章归档 | `_posts` 文章分类 | `_posts` 文章标签 |
| note 页面 | `_notes` 文章归档 | `_notes` 文章分类 | `_notes` 文章标签 |

#### 2. 独立的分类/标签/归档页面

note 相关页面使用独立路径，不再与主页混用：

| 功能 | 主页路径 | note 页面路径 |
|------|----------|---------------|
| 归档 | `/archives/2026/` | `/notes/archives/2026/` |
| 分类 | `/categories/xxx/` | `/notes/categories/思考马克/` |
| 标签 | `/tags/xxx/` | `/notes/tags/思考/` |

#### 3. Note 文章上一篇/下一篇推荐

在 note 文章详情页底部，新增同一系列文章的导航：
- 按日期排序显示上一篇/下一篇
- 只推荐 `_notes` 目录下的文章

#### 4. 思考马克文章日期修正

根据文章内容修正所有思考马克文章的发布日期：

| 文章 | 原日期 | 修正后日期 |
|------|--------|------------|
| 思考马克·2019记录节选 | 2020-01-11 | 2019-12-15 |
| 思考马克·二（2021年记录） | 2020-01-21 | 2021-12-15 |
| 思考马克·三（2022年思考） | 2020-01-31 | 2022-12-15 |
| 思考马克·四~十四 | 2020年各日期 | 2023年对应月份 |
| 思考马克·十五~二十五 | 2020年各日期 | 2024年对应月份 |
| 思考马克·二十六~三十七 | 2020年各日期 | 2025-2026年对应月份 |

### 修复问题

1. **分类/标签页面侧边栏布局**：修复侧边栏显示在底部的问题
2. **归档页面布局**：支持 note 归档页面的正确渲染

---

## 📁 修改的文件

```
scripts/notes-generator.js          # 添加 prev/next、独立路径、归档生成器
themes/paper/layout/includes/sidebar.pug  # 侧边栏内容分离逻辑
themes/paper/layout/archive.pug     # 支持 note 归档页面
themes/paper/layout/category.pug    # 修复侧边栏布局
themes/paper/layout/tag.pug         # 修复侧边栏布局
source/_notes/思考马克*.md          # 修正发布日期
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
- 主页侧边栏：只显示博客文章的分类/标签/归档
- `/note/` 页面侧边栏：只显示笔记文章的分类/标签/归档
- 点击 note 页面的分类/标签链接，跳转到独立页面

4. **部署**
```bash
npm run deploy
```

### 关键文件说明

| 文件 | 用途 |
|------|------|
| `scripts/notes-generator.js` | 笔记渲染、分页、分类/标签/归档生成、prev/next |
| `themes/paper/layout/includes/sidebar.pug` | 侧边栏内容分离逻辑 |
| `themes/paper/layout/archive.pug` | 归档页面模板 |

### 注意事项

- note 页面的分类/标签/归档页面路径为 `/notes/categories/`、`/notes/tags/`、`/notes/archives/`
- 主页的分类/标签/归档页面路径保持原有 `/categories/`、`/tags/`、`/archives/`
- 两套系统完全独立，互不干扰

---

## 📊 项目统计

- 博客文章: 25+ 篇
- 笔记文章: 39 篇
- note 分类: 1 个（思考马克）
- note 标签: 2 个（思考、Mark）