# Changelog

## 2026-06-11 — 清理主题色调试代码

**变更内容**

删除了 `themes/paper/source/js/paper.js` 中两处遗留的调试遥测代码（`fetch` 请求），这些代码在每次页面加载时会向 `http://localhost:7245` 发送数据，不应出现在生产环境中。

**涉及文件**

- `themes/paper/source/js/paper.js` — 删除两处 `#region agent log` 代码块

**版本恢复说明**

如需回滚到本次改动之前的状态：

```bash
# 查看备份标签
git log backup/pre-debug-cleanup-2026-06-11 --oneline -1

# 方式一：创建临时分支查看备份状态
git checkout -b rollback-preview backup/pre-debug-cleanup-2026-06-11

# 方式二：仅恢复 paper.js 这一个文件
git checkout backup/pre-debug-cleanup-2026-06-11 -- themes/paper/source/js/paper.js

# 恢复后重新部署
npm run deploy
```

**本地备份标签**

`backup/pre-debug-cleanup-2026-06-11` — 指向本次改动前的最后一个提交（`51857c3a`）
