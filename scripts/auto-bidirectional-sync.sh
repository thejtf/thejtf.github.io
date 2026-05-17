#!/bin/bash
# 双向自动同步守护进程 - 完全无感开发
# 本地修改自动推送，远程修改自动拉取
# 用法: nohup ./scripts/auto-bidirectional-sync.sh > .sync.log 2>&1 &

cd "$(dirname "$0")/.."

# 配置
check_interval=30  # 检查间隔（秒）
last_local_commit=""

echo "🔄 双向自动同步已启动 ($(date))"
echo "日志: tail -f .sync.log"

while true; do
    sleep $check_interval

    # 1. 检查远程是否有更新 → 自动拉取
    git fetch origin source 2>/dev/null || continue
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/source 2>/dev/null || continue)

    if [ "$LOCAL" != "$REMOTE" ]; then
        echo "[$(date '+%m-%d %H:%M')] ⬇️ 远程有更新，自动拉取..."

        # 检查是否有本地未提交的修改
        if ! git diff-index --quiet HEAD -- 2>/dev/null; then
            echo "[$(date '+%m-%d %H:%M')] 💾 先提交本地修改..."
            git add -A
            git commit -m "Auto: local changes before pull ($(date '+%H:%M'))" 2>/dev/null || true
        fi

        # 拉取并合并
        if git pull origin source --quiet 2>/dev/null; then
            echo "[$(date '+%m-%d %H:%M')] ✅ 已同步远程更新"

            # 如果 Hexo 在运行，触发重新生成
            if pgrep -f "hexo server" > /dev/null; then
                npx hexo generate 2>/dev/null && echo "[$(date '+%m-%d %H:%M')] 🔄 已重新生成" &
            fi
        else
            echo "[$(date '+%m-%d %H:%M')] ⚠️ 拉取失败，可能存在冲突"
        fi
    fi

    # 2. 检查本地是否有未提交的修改 → 自动提交推送
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        echo "[$(date '+%m-%d %H:%M')] ⬆️ 检测到本地修改，自动提交..."
        git add -A

        # 获取修改的文件列表作为提交信息
        changed_files=$(git diff --name-only --cached | head -3 | tr '\n' ', ')
        commit_msg="Auto sync: ${changed_files:-updates} ($(date '+%H:%M'))"

        if git commit -m "$commit_msg" 2>/dev/null; then
            if git push origin source --quiet 2>/dev/null; then
                echo "[$(date '+%m-%d %H:%M')] ✅ 已自动推送"
            else
                echo "[$(date '+%m-%d %H:%M')] ❌ 推送失败"
            fi
        fi
    fi
done