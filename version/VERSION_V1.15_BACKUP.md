# 项目版本备份文档 - V1.15

**备份日期**: 2026年03月22日
**项目版本**: V1.15
**项目类型**: Hexo 静态博客

---

## 📋 版本信息

- **项目版本**: V1.15
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
  "hexo-theme-landscape": "^0.3"
}
```

---

## 🆕 V1.15 更新内容

### 新增功能

#### 1. 独立的 Note 文章系统

新增 `hexo note` 命令，实现博客文章与笔记文章分离：

| 命令 | 作用 | 显示位置 |
|------|------|----------|
| `npx hexo new "标题"` | 创建博客文章 | 主页 |
| `npx hexo note "标题"` | 创建笔记文章 | note 页面 |

- 博客文章存放在 `source/_posts/` 目录
- 笔记文章存放在 `source/_notes/` 目录（新建）
- 笔记文章不会出现在主页，只在 `/note/` 页面展示

#### 2. Note 页面分页功能

- 每页显示 10 篇笔记文章
- 支持分页导航（上一页、下一页、页码）
- 自动生成分页页面 `/note/page/2/`、`/note/page/3/` 等

#### 3. 思考马克系列文章导入

- 导入 39 篇"思考马克"系列笔记文章
- 按时间线倒序排列（三十七 → 三十六 → ... → 二 → 2019记录节选）

### 修复与优化

1. **修复 note 页面侧边栏布局**：侧边栏正确显示在右侧
2. **移除 note 页面的 Toc**：与主页保持一致，显示 Links、Archives、Categories、Tags
3. **调整 Links 顺序**：公开笔记在上，RSS 订阅在下

---

## 📁 新增/修改的文件

### 新增文件

```
source/_notes/                          # 笔记文章目录（新建）
  ├── 思考马克·三十七.md
  ├── 思考马克·三十六.md
  └── ... (共39篇)

scripts/
  ├── note-command.js                   # hexo note 命令脚本
  ├── notes-generator.js                # 笔记文章生成器 + 分页
  └── note-pagination.js                # 分页页面生成器

source/note/index.md                    # note 页面配置（需保留）
```

### 修改文件

```
themes/paper/layout/page.pug            # note 页面布局 + 分页导航
themes/paper/layout/includes/sidebar.pug # 移除 note 页面的 Toc
themes/paper/_config.yml                # Links 顺序调整
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

2. **验证功能**
```bash
# 启动本地服务器
npm run server

# 访问 http://localhost:4000/note/ 查看笔记页面
```

3. **创建新笔记**
```bash
npx hexo note "笔记标题"
```

4. **部署**
```bash
npm run deploy
```

### 关键文件说明

| 文件/目录 | 用途 | 必须 |
|-----------|------|------|
| `source/_notes/` | 笔记文章存放目录 | ✅ |
| `source/note/index.md` | note 页面配置，定义 `type: "note"` | ✅ |
| `scripts/note-command.js` | `hexo note` 命令实现 | ✅ |
| `scripts/notes-generator.js` | 笔记渲染 + 分页逻辑 | ✅ |
| `scripts/note-pagination.js` | 生成分页页面 | ✅ |

### 注意事项

- **不要删除** `source/note/index.md`，否则 `/note/` 页面将无法访问
- 笔记文章只需放在 `source/_notes/` 目录，会自动被系统识别
- 分页数量可在 `scripts/notes-generator.js` 中修改 `perPage` 参数

---

## 📊 项目统计

- 博客文章: 25+ 篇
- 笔记文章: 39 篇
- 分页: note 页面共 4 页