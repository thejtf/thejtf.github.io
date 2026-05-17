#!/bin/bash
# 完全无感开发模式 - 双向自动同步 + 服务器
# 用法: npm start

cd "$(dirname "$0")/.."

SYNC_LOG=".sync.log"

echo "🚀 启动完全无感开发模式..."
echo ""

# 检查是否已有同步进程在运行
if pgrep -f "auto-bidirectional-sync.sh" > /dev/null; then
    echo "✅ 自动同步已在运行"
else
    echo "🔄 启动双向自动同步..."
    nohup ./scripts/auto-bidirectional-sync.sh > "$SYNC_LOG" 2>&1 &
    echo "   日志: tail -f $SYNC_LOG"
    sleep 1
fi

echo ""
echo "💡 使用说明:"
echo "   • 本地修改保存后 → 自动提交并推送"
echo "   • 远程有新内容 → 自动拉取并刷新"
echo "   • 按 Ctrl+C 停止服务器（同步继续后台运行）"
echo ""

# 启动服务器
exec npx hexo server