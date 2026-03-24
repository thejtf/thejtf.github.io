# 项目版本备份文档 - V1.22

**备份日期**: 2026年03月24日
**项目版本**: V1.22
**项目类型**: Hexo 静态博客

---

## 📋 版本信息

- **项目版本**: V1.22
- **Hexo 版本**: 6.3.0
- **Node.js 环境**: v20.19.6
- **npm 版本**: 10.8.2
- **主题**: paper

---

## 🆕 V1.22 更新内容

### 新增功能

#### Kindle 同步后自动部署

Kindle 同步完成后，检测到新内容会自动触发部署流程：

```
Kindle 插入 → 同步高亮 → 检测新内容？ → clean → generate → deploy
```

**流程说明：**
1. `npx hexo kindle-sync` 执行同步
2. 如果 `created > 0` 或 `updated > 0`，自动执行部署
3. 无新内容时跳过部署

### 代码修改

```javascript
// 修改 syncKindle 返回值
return { success: true, created, updated };

// Hexo 命令注册中添加自动部署逻辑
if (result.created > 0 || result.updated > 0) {
  hexo.log.info('检测到新内容，开始自动部署...');
  await hexo.call('clean');
  await hexo.call('generate');
  await hexo.call('deploy');
  hexo.log.info('自动部署完成！');
}
```

### 修改文件

```
scripts/kindle-sync.js               # 添加自动部署逻辑
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
# 有新内容时会自动部署
```

---

## 📊 项目统计

- 博客文章: 25+ 篇
- 笔记文章: 39 篇
- 读书笔记: 26 篇
- 页面: Readme、Note、Read