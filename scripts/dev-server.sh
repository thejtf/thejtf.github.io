#!/bin/bash
# 完全无感开发模式 - 启动服务器并后台自动同步
# 用法: npm start 或 ./scripts/dev-server.sh

cd "$(dirname "$0")/.."

echo "🚀 启动无感开发模式..."

# 首次启动时强制同步
echo "📥 首次同步检查..."
./git-pull-latest.sh 2>/dev/null || true

# 启动后台自动同步（每 60 秒检查一次）
(
    while true; do
        sleep 60
        git fetch origin source 2>/dev/null || continue
        LOCAL=$(git rev-parse HEAD 2>/dev/null)
        REMOTE=$(git rev-parse origin/source 2>/dev/null || continue)

        if [ "$LOCAL" != "$REMOTE" ]; then
            echo ""
            echo "⬇️ [$(date '+%H:%M')] 检测到远程更新，正在同步..."
            if git diff-index --quiet HEAD -- 2>/dev/null; then
                git pull origin source --quiet 2>/dev/null && echo "✅ [$(date '+%H:%M')] 同步完成，刷新页面查看" || echo "⚠️ 同步失败"
            fi
        fi
    done
) &

SYNC_PID=$!
echo "🔄 后台自动同步已启动 (PID: $SYNC_PID)"
echo "💡 按 Ctrl+C 停止服务器"
echo ""

# 捕获退出信号，清理后台进程
cleanup() {
    echo ""
    echo "🛑 停止后台同步..."
    kill $SYNC_PID 2>/dev/null
    exit 0
}
trap cleanup INT TERM

# 启动 Hexo 服务器
exec npx hexo server