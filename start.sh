#!/bin/bash
# 完全无感开发模式 - 双向自动同步 + 服务器
# 放在项目根目录，避免被 Hexo 加载

cd "$(dirname "$0")"

SYNC_LOG=".sync.log"

echo "🚀 启动完全无感开发模式..."
echo ""

# 检查是否已有同步进程在运行
if pgrep -f "auto-sync-daemon" > /dev/null; then
    echo "✅ 自动同步已在运行"
else
    echo "🔄 启动双向自动同步..."
    nohup bash -c '
        cd "'"$(pwd)"'"
        while true; do
            sleep 30
            git fetch origin source 2>/dev/null || continue
            LOCAL=$(git rev-parse HEAD)
            REMOTE=$(git rev-parse origin/source 2>/dev/null || continue)
            if [ "$LOCAL" != "$REMOTE" ]; then
                echo "[$(date "+%m-%d %H:%M")] ⬇️ 远程有更新，自动拉取..." >> .sync.log
                if ! git diff-index --quiet HEAD -- 2>/dev/null; then
                    git add -A && git commit -m "Auto: local changes before pull" 2>/dev/null
                fi
                git pull origin source --quiet 2>/dev/null && echo "[$(date "+%m-%d %H:%M")] ✅ 已同步" >> .sync.log
            fi
            if ! git diff-index --quiet HEAD -- 2>/dev/null; then
                git add -A 2>/dev/null
                changed=$(git diff --cached --name-only | head -3 | tr "\\n" ", ")
                git commit -m "Auto sync: ${changed:-updates}" 2>/dev/null && \
                git push origin source --quiet 2>/dev/null && \
                echo "[$(date "+%m-%d %H:%M")] ⬆️ 已推送" >> .sync.log
            fi
        done
    ' > /dev/null 2>&1 &
    echo "   日志: tail -f $SYNC_LOG"
    sleep 1
fi

echo ""
echo "💡 使用说明:"
echo "   • 本地修改保存后 → 自动提交并推送 (30秒延迟)"
echo "   • 远程有新内容 → 自动拉取并刷新"
echo "   • 按 Ctrl+C 停止服务器（同步在后台继续）"
echo "   • 日志: tail -f .sync.log"
echo ""

# 启动服务器
exec npx hexo server