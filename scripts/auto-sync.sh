#!/bin/bash
# 后台自动同步脚本 - 监控远程变化并自动拉取
# 用法: nohup ./scripts/auto-sync.sh &

set -e

cd "$(dirname "$0")/.."
LOG_FILE=".auto-sync.log"

echo "🔄 自动同步服务启动... ($(date))"
echo "日志文件: $LOG_FILE"

while true; do
    # 每 5 分钟检查一次
    sleep 300

    # 检查是否有远程更新
    git fetch origin source 2>/dev/null || continue

    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/source 2>/dev/null || continue)

    if [ "$LOCAL" = "$REMOTE" ]; then
        continue
    fi

    echo "$(date): 检测到远程更新" >> "$LOG_FILE"

    # 检查是否有本地修改
    if git diff-index --quiet HEAD -- 2>/dev/null; then
        # 没有本地修改，安全拉取
        if git pull origin source >> "$LOG_FILE" 2>&1; then
            echo "$(date): ✅ 自动同步成功" >> "$LOG_FILE"

            # 如果服务器在运行，重新生成
            if pgrep -f "hexo server" > /dev/null; then
                echo "$(date): 🔄 检测到服务器运行，重新生成..." >> "$LOG_FILE"
                npx hexo generate >> "$LOG_FILE" 2>&1 || true
            fi
        else
            echo "$(date): ❌ 同步失败" >> "$LOG_FILE"
        fi
    else
        echo "$(date): ⚠️ 有本地修改，跳过自动同步" >> "$LOG_FILE"
    fi
done