#!/bin/bash
# 本地定时同步脚本 - 在 Pi 服务器上运行
# 每30分钟自动同步所有内容并部署

set -e

BLOG_DIR="/home/jopus/Blog"
LOG_FILE="/home/jopus/Blog/.sync-cron.log"
ENV_FILE="/home/jopus/Blog/.env"

# 加载环境变量
if [ -f "$ENV_FILE" ]; then
    source "$ENV_FILE"
fi

cd "$BLOG_DIR"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 开始同步..." >> "$LOG_FILE"

# 1. 拉取远程最新（可能有 workflow 推送的更新）
git fetch origin source 2>/dev/null || {
    echo "[$(date '+%H:%M')] ❌ 无法连接远程" >> "$LOG_FILE"
    exit 0
}

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/source)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "[$(date '+%H:%M')] ⬇️ 拉取远程更新..." >> "$LOG_FILE"
    git pull origin source --quiet 2>/dev/null
fi

# 2. 运行微信读书同步（需要环境变量）
if [ -n "$WEREAD_API_KEY" ] && [ -n "$DEEPSEEK_API_KEY" ]; then
    echo "[$(date '+%H:%M')] 📚 同步微信读书..." >> "$LOG_FILE"
    npx hexo weread-sync >> "$LOG_FILE" 2>&1 || true
else
    echo "[$(date '+%H:%M')] ⚠️ 未设置 API Key，跳过同步" >> "$LOG_FILE"
fi

# 3. 检查是否有新内容需要推送（提交全部 source/ 目录）
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo "[$(date '+%H:%M')] ⬆️ 推送更新..." >> "$LOG_FILE"
    git add source/ 2>/dev/null || true
    git commit -m "Local sync: $(date '+%Y-%m-%d %H:%M')" 2>/dev/null || true
    git push origin source --quiet 2>/dev/null
    echo "[$(date '+%H:%M')] ✅ 已推送" >> "$LOG_FILE"
fi

# 4. 部署到 GitHub Pages（每次同步后自动部署）
echo "[$(date '+%H:%M')] 🚀 部署到线上..." >> "$LOG_FILE"
npx hexo generate --quiet >> "$LOG_FILE" 2>&1
npx hexo deploy --quiet >> "$LOG_FILE" 2>&1
echo "[$(date '+%H:%M')] ✅ 已部署到线上" >> "$LOG_FILE"

echo "[$(date '+%H:%M:%S')] 同步完成" >> "$LOG_FILE"