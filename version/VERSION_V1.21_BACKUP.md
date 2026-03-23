# 项目版本备份文档 - V1.21

**备份日期**: 2026年03月23日
**项目版本**: V1.21
**项目类型**: Hexo 静态博客

---

## 📋 版本信息

- **项目版本**: V1.21
- **Hexo 版本**: 6.3.0
- **Node.js 环境**: v20.19.6
- **npm 版本**: 10.8.2
- **主题**: paper

---

## 🆕 V1.21 更新内容

### Bug 修复

#### needsUpdate 判断逻辑错误

**问题描述：**
`needsUpdate` 函数用 `> ` 符号统计高亮数量，但之前已去掉 `>` 引用符号，导致判断结果始终为 0，新增高亮无法被检测到。

**修复方案：**
改为比较文件内容长度。

```javascript
// 修复前
const existingCount = (existingContent.match(/> /g) || []).length;
const newCount = (newContent.match(/> /g) || []).length;
return newCount > existingCount;

// 修复后
return newContent.length > existingContent.length;
```

### 修改文件

```
scripts/kindle-sync.js               # 修复 needsUpdate 函数
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

---

## 📊 项目统计

- 博客文章: 25+ 篇
- 笔记文章: 39 篇
- 读书笔记: 24 篇
- 页面: Readme、Note、Read