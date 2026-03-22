# 项目版本备份文档 - V1.20

**备份日期**: 2026年03月23日
**项目版本**: V1.20
**项目类型**: Hexo 静态博客

---

## 📋 版本信息

- **项目版本**: V1.20
- **Hexo 版本**: 6.3.0
- **Node.js 环境**: v20.19.6
- **npm 版本**: 10.8.2
- **主题**: paper

---

## 🆕 V1.20 更新内容

### 新增功能

#### 1. AI 自动分类

集成 DeepSeek API，新书同步时自动判断分类和标签：

```
新书同步 → 检查映射表 → 有? → 使用映射表
                      → 无? → 调用 DeepSeek AI → 存入缓存
```

#### 2. 分类缓存系统

- 缓存文件：`.kindle-category-cache.json`
- AI 判断结果自动保存，避免重复调用
- 已添加到 `.gitignore`

#### 3. 优先级机制

| 优先级 | 来源 |
|--------|------|
| 最高 | `BOOK_CATEGORIES` / `BOOK_TAGS` 映射表 |
| 次之 | 缓存文件 |
| 最低 | DeepSeek AI 判断 |

### 分类和标签标准

**分类（5类）：**
| 分类 | 包含类型 |
|------|----------|
| 文学 | 小说、诗歌、散文、戏剧、童话、古典文学 |
| 社科 | 历史、哲学、政治、经济、法律、社会学、心理学 |
| 科技 | 数理化、生物、医学、计算机、工程、科普 |
| 艺术 | 绘画、音乐、摄影、设计、建筑、影视 |
| 实用 | 生活、健身、烹饪、育儿、理财、旅行、工具书 |

**标签（4类）：**
| 标签 | 说明 |
|------|------|
| 经典 | 值得反复读的传世之作 |
| 必读 | 对自己很重要的书 |
| 泛读 | 随便翻翻即可（默认） |
| 参考 | 工具书、资料类，按需查阅 |

### 配置信息

- DeepSeek API Key：已配置在 `scripts/kindle-sync.js`
- 模型：`deepseek-chat`
- Endpoint：`https://api.deepseek.com/chat/completions`

### 修改文件

```
scripts/kindle-sync.js               # 添加 AI 分类功能
.gitignore                           # 忽略缓存文件
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

3. **测试同步**
```bash
npx hexo kindle-sync
```

### 手动调整分类

如果 AI 分类不准确，有两种方式调整：

**方式1：修改缓存文件**
编辑 `.kindle-category-cache.json`

**方式2：添加到映射表**（永久生效）
编辑 `scripts/kindle-sync.js`：
```javascript
const BOOK_CATEGORIES = {
  '书名': '正确的分类',
};

const BOOK_TAGS = {
  '书名': '正确的标签',
};
```

---

## 📊 项目统计

- 博客文章: 25+ 篇
- 笔记文章: 39 篇
- 读书笔记: 24 篇
- 页面: Readme、Note、Read