# 项目版本备份文档 - V1.18

**备份日期**: 2026年03月23日
**项目版本**: V1.18
**项目类型**: Hexo 静态博客

---

## 📋 版本信息

- **项目版本**: V1.18
- **Hexo 版本**: 6.3.0
- **Node.js 环境**: v20.19.6
- **npm 版本**: 10.8.2
- **主题**: paper

---

## 🆕 V1.18 更新内容

### 新增功能

#### 1. Read 读书笔记系统

创建独立的读书笔记页面 `/read/`，与 Note 系统并行：

- **目录结构**: `source/_reads/` 存放读书笔记文章
- **页面入口**: `/read/` 列表页，独立侧边栏、分类、标签、归档
- **文章格式**: 自动包含书籍简介 + 书摘内容

#### 2. Kindle 高亮同步脚本

`scripts/kindle-sync.js` - 自动同步 Kindle 高亮：

- 解析 `My Clippings.txt` 文件
- 按书籍分组生成 markdown 文章
- 自动抓取书籍简介：
  - 中文书籍：豆瓣 API
  - 英文书籍：Google Books API
- Hexo 命令：`npx hexo kindle-sync`

#### 3. Read 系统生成器

`scripts/reads-generator.js` - 类似 notes-generator：

- `template_locals` filter：注入 reads 数据
- `reads` generator：生成文章页面
- 分页支持

#### 4. Kindle 自动同步服务

全自动同步 + 部署流程：

- `kindle/kindle-watch.sh` - 监控脚本，每 30 秒检测 Kindle 连接
- `kindle/kindle-watch.service` - systemd 用户服务
- **功能**: 插入 Kindle → 自动同步 → 自动提交源码 → 自动部署上线

#### 5. 导航菜单更新

- 顶部导航菜单：Home / Readme / Note / Read
- 侧边栏 Links：公开笔记 → Readme → RSS 订阅

### 新增文件

```
source/_reads/                        # 读书笔记目录
source/read/index.md                  # Read 页面配置
scripts/kindle-sync.js               # Kindle 同步脚本
scripts/reads-generator.js           # Read 系统生成器
kindle/kindle-watch.sh               # Kindle 监控脚本
kindle/kindle-watch.service          # systemd 服务文件
kindle/kindle-sync-service.sh        # 同步服务脚本
kindle/kindle-sync.service           # systemd 服务文件
```

### 修改文件

```
themes/paper/layout/page.pug         # 支持 read 页面类型
themes/paper/layout/includes/sidebar.pug  # 支持 read 侧边栏
themes/paper/layout/archive.pug      # 支持 read 归档
themes/paper/layout/category.pug     # 支持 read 分类
themes/paper/layout/tag.pug          # 支持 read 标签
themes/paper/_config.yml             # 导航菜单添加 Read
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
- 访问 http://localhost:4000/read/ 查看 Read 页面
- 执行 `npx hexo kindle-sync` 测试同步功能
- 检查顶部导航菜单显示 Read

4. **安装 Kindle 自动同步服务**（可选）
```bash
mkdir -p ~/.config/systemd/user
cp ~/Blog/kindle/kindle-watch.service ~/.config/systemd/user/
systemctl --user enable kindle-watch
systemctl --user start kindle-watch
```

5. **部署**
```bash
npm run deploy
```

### 关键文件说明

| 文件 | 用途 |
|------|------|
| `source/_reads/` | 读书笔记文章目录 |
| `source/read/index.md` | Read 页面配置 |
| `scripts/kindle-sync.js` | Kindle 高亮同步脚本 |
| `scripts/reads-generator.js` | Read 系统核心生成器 |
| `kindle/kindle-watch.sh` | Kindle 自动监控脚本 |
| `themes/paper/_config.yml` | 主题配置（菜单） |

### Kindle 自动同步服务管理

```bash
# 查看服务状态
systemctl --user status kindle-watch

# 停止服务
systemctl --user stop kindle-watch

# 重启服务
systemctl --user restart kindle-watch

# 查看同步日志
tail -f ~/Blog/kindle-sync.log
```

---

## 📊 项目统计

- 博客文章: 25+ 篇
- 笔记文章: 39 篇
- 读书笔记: 22 篇
- 页面: Readme、Note、Read