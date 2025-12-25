# Hexo 博客每日自动重建 Cron 任务设置指南

## 概述

这个定时任务会在每天自动重新生成 Hexo 静态文件，确保主题色与当前日期一致，避免颜色切换的闪烁问题。

## 文件说明

- `daily-rebuild.sh` - 仅重新生成静态文件（不部署）
- `daily-rebuild-and-deploy.sh` - 重新生成并自动部署到 GitHub Pages
- `crontab-config.txt` - Cron 任务配置说明

## 快速设置

### 方法 1：仅重新生成（推荐，更安全）

每天凌晨 2:00 自动重新生成静态文件：

```bash
(crontab -l 2>/dev/null; echo "0 2 * * * /home/jopus/Blog/daily-rebuild.sh") | crontab -
```

### 方法 2：重新生成并自动部署

每天凌晨 2:00 自动重新生成并部署到 GitHub Pages：

```bash
(crontab -l 2>/dev/null; echo "0 2 * * * /home/jopus/Blog/daily-rebuild-and-deploy.sh") | crontab -
```

## 验证设置

查看已设置的 cron 任务：

```bash
crontab -l
```

应该看到类似这样的输出：

```
0 2 * * * /home/jopus/Blog/daily-rebuild.sh
```

## 自定义执行时间

Cron 时间格式：`分钟 小时 日 月 星期`

### 常用时间示例

```bash
# 每天凌晨 2:00
0 2 * * * /home/jopus/Blog/daily-rebuild.sh

# 每天中午 12:00
0 12 * * * /home/jopus/Blog/daily-rebuild.sh

# 每天凌晨 0:00（午夜）
0 0 * * * /home/jopus/Blog/daily-rebuild.sh

# 每天上午 9:00
0 9 * * * /home/jopus/Blog/daily-rebuild.sh

# 每天多次执行（例如：凌晨 2:00 和下午 6:00）
0 2 * * * /home/jopus/Blog/daily-rebuild.sh
0 18 * * * /home/jopus/Blog/daily-rebuild.sh
```

### 编辑 Cron 任务

```bash
crontab -e
```

在编辑器中修改或添加任务，保存后自动生效。

## 查看日志

### 仅重新生成的日志

```bash
tail -f /home/jopus/Blog/daily-rebuild.log
```

### 重新生成并部署的日志

```bash
tail -f /home/jopus/Blog/daily-rebuild-deploy.log
```

## 手动测试

在设置 cron 任务之前，可以手动测试脚本：

```bash
# 测试仅重新生成
/home/jopus/Blog/daily-rebuild.sh

# 测试重新生成并部署
/home/jopus/Blog/daily-rebuild-and-deploy.sh
```

## 删除 Cron 任务

如果需要删除定时任务：

```bash
# 编辑 cron 任务
crontab -e

# 或者直接删除所有任务（谨慎使用）
crontab -r
```

## 注意事项

1. **路径问题**：确保脚本中的路径正确，特别是 `BLOG_DIR` 和 `LOG_FILE`
2. **权限问题**：确保脚本有执行权限（已自动设置）
3. **环境变量**：Cron 任务可能没有完整的 shell 环境，脚本中使用了 `npx` 来确保能找到 hexo 命令
4. **Git 配置**：如果使用自动部署，确保 Git SSH 密钥已配置，且 cron 任务能访问到密钥
5. **时区**：Cron 任务使用系统时区，确保系统时区设置正确

## 故障排查

### 任务没有执行

1. 检查 cron 服务是否运行：
   ```bash
   sudo systemctl status cron
   ```

2. 查看 cron 日志：
   ```bash
   grep CRON /var/log/syslog
   ```

3. 检查脚本权限：
   ```bash
   ls -l /home/jopus/Blog/daily-rebuild.sh
   ```

### 脚本执行失败

1. 查看日志文件：
   ```bash
   cat /home/jopus/Blog/daily-rebuild.log
   ```

2. 手动运行脚本查看错误：
   ```bash
   /home/jopus/Blog/daily-rebuild.sh
   ```

3. 检查 hexo 命令是否可用：
   ```bash
   cd /home/jopus/Blog && npx hexo version
   ```

## 推荐配置

对于你的使用场景，推荐使用**方法 1（仅重新生成）**：

- 更安全：不会意外覆盖未提交的更改
- 更灵活：可以手动控制何时部署
- 更可控：生成后可以预览再决定是否部署

设置命令：

```bash
(crontab -l 2>/dev/null; echo "0 2 * * * /home/jopus/Blog/daily-rebuild.sh") | crontab -
```

这样每天凌晨 2:00 会自动重新生成，然后你可以：
- 手动预览：`npx hexo server` 查看效果
- 手动部署：`npx hexo deploy` 部署到 GitHub Pages

