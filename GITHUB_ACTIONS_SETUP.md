# GitHub Actions 自动部署设置指南

## 📋 概述

GitHub Actions workflow 会在每天自动重新生成静态文件并部署到 GitHub Pages，确保主题色与当前日期一致。

## 📁 已创建的文件

- `.github/workflows/deploy.yml` - GitHub Actions workflow 配置文件

## 🚀 设置步骤

### 1. 提交 workflow 文件到 GitHub

```bash
cd /home/jopus/Blog
git checkout source  # 确保在 source 分支
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions workflow for daily rebuild and deploy"
git push origin source
```

### 2. 配置 GitHub 仓库权限

1. 进入 GitHub 仓库：`https://github.com/thejtf/thejtf.github.io`
2. 点击 **Settings** → **Actions** → **General**
3. 找到 **Workflow permissions** 部分
4. 选择 **Read and write permissions**（允许 workflow 写入仓库）
5. 点击 **Save**

### 3. 验证设置

1. 在 GitHub 仓库页面，点击 **Actions** 标签
2. 应该能看到 "Daily Rebuild and Deploy" workflow
3. 可以点击 **Run workflow** 手动触发一次测试

## ⏰ 执行时间

- **定时触发**：每天 UTC 时间 16:10（北京时间 0:10）
- **手动触发**：可以在 GitHub Actions 页面手动运行

## 🔄 工作流程

1. **拉取源代码**：从 `source` 分支拉取最新代码
2. **安装依赖**：执行 `npm ci` 安装所有依赖
3. **生成静态文件**：执行 `hexo clean && hexo generate`
4. **部署到 GitHub Pages**：将生成的 `public/` 目录推送到 `master` 分支
5. **自动更新网站**：GitHub Pages 自动从 `master` 分支更新网站

## 📝 注意事项

### 1. 时区说明

- GitHub Actions 使用 UTC 时间
- 北京时间 0:10 = UTC 16:10（前一天）
- 如果需要修改时间，编辑 `.github/workflows/deploy.yml` 中的 cron 表达式

### 2. 权限要求

- 确保 workflow 有写入权限（Settings → Actions → General → Workflow permissions）
- `GITHUB_TOKEN` 是自动提供的，无需额外配置

### 3. 本地 Cron 任务

如果使用 GitHub Actions，可以删除本地的 cron 任务：

```bash
crontab -e
# 删除或注释掉这一行：
# 10 0 * * * /home/jopus/Blog/daily-rebuild.sh
```

或者保留作为备份方案。

### 4. 默认主题色

- 已设置为灰色（`#cccccc`）
- 在 GitHub Actions 执行前，用户访问时会看到灰色
- JavaScript 执行后会切换到当日主题色
- 这样即使有颜色切换，影响也最小

## 🐛 故障排查

### Workflow 没有执行

1. 检查 workflow 文件是否已推送到 `source` 分支
2. 检查 GitHub 仓库的 Actions 是否启用
3. 查看 Actions 标签页是否有错误信息

### 部署失败

1. 查看 Actions 执行日志
2. 检查权限设置是否正确
3. 确认 `master` 分支存在且可写

### 手动测试

可以在 GitHub Actions 页面点击 "Run workflow" 手动触发一次，查看是否正常工作。

## 📊 优势

- ✅ **完全自动化**：无需本地操作
- ✅ **不依赖本地机器**：即使本地机器关机也能执行
- ✅ **云端执行**：不占用本地资源
- ✅ **可查看历史**：所有执行记录和日志都在 GitHub 上
- ✅ **手动触发**：可以随时手动触发部署

## 🔗 相关文件

- `daily-rebuild.sh` - 本地 cron 任务脚本（可选，作为备份）
- `daily-rebuild-and-deploy.sh` - 本地自动部署脚本（可选）
- `CRON_SETUP.md` - 本地 cron 任务设置文档

