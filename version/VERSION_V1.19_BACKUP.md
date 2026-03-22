# 项目版本备份文档 - V1.19

**备份日期**: 2026年03月23日
**项目版本**: V1.19
**项目类型**: Hexo 静态博客

---

## 📋 版本信息

- **项目版本**: V1.19
- **Hexo 版本**: 6.3.0
- **Node.js 环境**: v20.19.6
- **npm 版本**: 10.8.2
- **主题**: paper

---

## 🆕 V1.19 更新内容

### 新增功能

#### 1. 书籍分类系统

将读书笔记分类从"每本书一个分类"改为5大标准分类：

| 分类 | 包含类型 |
|------|----------|
| **文学** | 小说、诗歌、散文、戏剧、童话、古典文学 |
| **社科** | 历史、哲学、政治、经济、法律、社会学、心理学 |
| **科技** | 数理化、生物、医学、计算机、工程、科普 |
| **艺术** | 绘画、音乐、摄影、设计、建筑、影视 |
| **实用** | 生活、健身、烹饪、育儿、理财、旅行、工具书 |

#### 2. 分类映射表

在 `scripts/kindle-sync.js` 中添加 `BOOK_CATEGORIES` 映射表：

```javascript
const BOOK_CATEGORIES = {
  // 文学
  '百年孤独': '文学',
  '包法利夫人': '文学',
  // 社科
  '中国历代政治得失': '社科',
  'Chip War': '社科',
  // 实用
  'Mindset': '实用',
  // ...
};
```

#### 3. 标签优化

- 分类：使用标准分类（文学/社科/科技/艺术/实用）
- 标签：保留书名作为标签，方便按书籍查找

### 修改文件

```
scripts/kindle-sync.js               # 添加分类映射逻辑
source/_reads/*.md                   # 更新所有文章的分类和标签
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

3. **验证分类**
- 访问 http://localhost:4000/read/
- 侧边栏应显示：文学、社科、实用

4. **部署**
```bash
npm run deploy
```

### 关键文件说明

| 文件 | 用途 |
|------|------|
| `scripts/kindle-sync.js` | 包含分类映射表 `BOOK_CATEGORIES` |
| `source/_reads/*.md` | 读书笔记文章（分类已更新） |

### 添加新书分类

编辑 `scripts/kindle-sync.js` 中的 `BOOK_CATEGORIES` 对象：

```javascript
const BOOK_CATEGORIES = {
  // 文学
  '新书名': '文学',
  // 社科
  '新书名': '社科',
  // ...
};
```

---

## 📊 项目统计

- 博客文章: 25+ 篇
- 笔记文章: 39 篇
- 读书笔记: 23 篇
  - 文学: 7 篇
  - 社科: 13 篇
  - 实用: 3 篇
- 页面: Readme、Note、Read