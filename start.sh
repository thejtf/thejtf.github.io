#!/bin/bash
# 完全无感开发模式 - 启动自动同步 + 服务器
# 放在项目根目录，Hexo 不会加载

cd "$(dirname "$0")"

echo "🚀 启动完全无感开发模式..."
echo ""

# 启动自动同步（auto-push.sh 统一管理）
./auto-push.sh start

echo ""
echo "💡 使用说明:"
echo "   • 本地修改保存后 → 30秒内自动推送（有内容才推送）"
echo "   • 远程有新内容 → 自动拉取并合并"
echo "   • 按 Ctrl+C 停止服务器（同步继续后台运行）"
echo "   • 查看同步状态: ./auto-push.sh status"
echo "   • 查看日志: ./auto-push.sh log 或 tail -f .sync.log"
echo ""
echo "📍 本地预览: http://localhost:4000"
echo ""

# 启动服务器
exec npx hexo server