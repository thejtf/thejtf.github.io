# 项目版本备份文档 - V1.23

**备份日期**: 2026年03月27日
**项目版本**: V1.23
**项目类型**: Hexo 静态博客

---

## 📋 版本信息

- **项目版本**: V1.23
- **Hexo 版本**: 6.3.0
- **Node.js 环境**: v20.19.6
- **npm 版本**: 10.8.2
- **主题**: paper

---

## 🆕 V1.23 更新内容

### 新增功能

#### 1. 思考马克系统 (Think)

新增独立的"思考马克"内容系统，与"公开笔记"和"读书笔记"并列：

- **访问路径**: `/think/`
- **源文件目录**: `source/_thinks/`
- **创建命令**: `npx hexo think "文章标题"`

**功能特点：**
- 独立的侧边栏（Archives、Categories、Tags 只显示思考马克相关内容）
- 支持分页
- 独立的分类和标签系统

#### 2. 智能思考记录命令 (hexo mark)

新增 `hexo mark` 命令，实现智能追加思考记录：

```bash
npx hexo mark "你的思考内容"
```

**功能特点：**
- 根据当前月份自动判断追加到哪篇思考马克文章
- 新月份自动创建新文章（编号递增，如思考马克·三十八）
- 同一天多条记录追加到当天记录末尾
- 自动生成日期条目格式

**示例：**
```
# 3月记录（追加到思考马克·三十七）
npx hexo mark "今天学到了一个新概念"

# 4月会自动创建思考马克·三十八
npx hexo mark "四月的第一条思考"
```

### 修改文件

```
新增文件:
  scripts/think-command.js       # hexo think 命令
  scripts/thinks-generator.js    # 思考马克文章生成器
  scripts/think-pagination.js    # 分页支持
  scripts/mark-command.js        # hexo mark 智能记录命令
  source/think/index.md          # 思考马克页面

修改文件:
  themes/paper/_config.yml       # 添加思考马克链接
  themes/paper/layout/page.pug   # 添加 think 页面渲染
  themes/paper/layout/includes/sidebar.pug  # think 页面独立侧边栏

移动文件:
  source/_notes/思考马克*.md → source/_thinks/  (39篇文章)
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
```

3. **创建思考马克文章**
```bash
npx hexo think "新文章标题"
```

4. **记录思考**
```bash
npx hexo mark "今天的一条思考"
```

---

## 📊 项目统计

- 博客文章: 25+ 篇
- 思考马克: 39 篇
- 公开笔记: 0 篇
- 读书笔记: 26 篇
- 页面: Readme、Note、Think、Read