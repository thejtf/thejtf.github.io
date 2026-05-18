#!/bin/bash
# 定时同步脚本 - 在 Pi 服务器上运行
# 职责：微信读书同步 + 部署到线上
# git push 由 auto-push.sh 负责

set -e

BLOG_DIR="/home/jopus/Blog"
LOG_FILE="/home/jopus/Blog/.sync-cron.log"
ENV_FILE="/home/jopus/Blog/.env"

# 加载环境变量
if [ -f "$ENV_FILE" ]; then
    source "$ENV_FILE"
fi

cd "$BLOG_DIR"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 开始定时同步..." >> "$LOG_FILE"

# 1. 拉取远程最新（auto-push.sh 也会拉，这里双重保障）
git fetch origin source 2>/dev/null || {
    echo "[$(date '+%H:%M')] ❌ 无法连接远程" >> "$LOG_FILE"
    exit 0
}

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/source 2>/dev/null || echo "$LOCAL")

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "[$(date '+%H:%M')] ⬇️ 拉取远程更新..." >> "$LOG_FILE"
    git pull origin source --quiet 2>/dev/null || true
fi

# 2. 运行微信读书同步（需要环境变量）
if [ -n "$WEREAD_API_KEY" ] && [ -n "$DEEPSEEK_API_KEY" ]; then
    echo "[$(date '+%H:%M')] 📚 同步微信读书..." >> "$LOG_FILE"
    npx hexo weread-sync >> "$LOG_FILE" 2>&1 || true

    # 微信读书同步产生新内容后，auto-push.sh 会自动推送
    # 这里只做本地确认（如果 auto-push.sh 未运行）
    if ! pgrep -f "auto-sync-loop" > /dev/null; then
        if ! git diff-index --quiet HEAD -- 2>/dev/null; then
            echo "[$(date '+%H:%M')] ⬆️ auto-push 未运行，手动推送..." >> "$LOG_FILE"
            git add source/ 2>/dev/null || true
            git commit -m "WeRead sync: $(date '+%Y-%m-%d %H:%M')" 2>/dev/null || true
            git push origin source --quiet 2>/dev/null || true
        fi
    fi
else
    echo "[$(date '+%H:%M')] ⚠️ 未设置 API Key，跳过同步" >> "$LOG_FILE"
fi

# 3. 部署到 GitHub Pages（只在有新内容时部署）
# 检查是否需要重新生成
NEED_DEPLOY=false

# 检查上次部署时间和当前时间
LAST_DEPLOY_FILE="$BLOG_DIR/.last-deploy"
if [ -f "$LAST_DEPLOY_FILE" ]; then
    LAST_DEPLOY=$(cat "$LAST_DEPLOY_FILE")
    NOW=$(date +%s)
    # 超过1小时就重新部署
    if [ "$((NOW - LAST_DEPLOY))" -gt 3600 ]; then
        NEED_DEPLOY=true
    fi
else
    NEED_DEPLOY=true
fi

# 或者 source 有改动就部署
if ! git diff-index --quiet HEAD -- source/ 2>/dev/null; then
    NEED_DEPLOY=true
fi

if [ "$NEED_DEPLOY" = true ]; then
    echo "[$(date '+%H:%M')] 🚀 部署到线上..." >> "$LOG_FILE"
    npx hexo generate --quiet >> "$LOG_FILE" 2>&1
    npx hexo deploy --quiet >> "$LOG_FILE" 2>&1
    date +%s > "$LAST_DEPLOY_FILE"
    echo "[$(date '+%H:%M')] ✅ 已部署到线上" >> "$LOG_FILE"
else
    echo "[$(date '+%H:%M')] ⏸️ 无需部署" >> "$LOG_FILE"
fi

echo "[$(date '+%H:%M:%S')] 定时同步完成" >> "$LOG_FILE"