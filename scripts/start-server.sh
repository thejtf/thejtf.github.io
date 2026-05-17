#!/bin/bash
# Hexo 服务器启动脚本（自动同步版）
# 放在 scripts/start-server.sh

set -e

cd "$(dirname "$0")/.."

echo "🔄 检查远程更新..."
git fetch origin source 2>/dev/null || {
    echo "⚠️ 无法连接远程，使用本地版本"
    exec npx hexo server
}

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/source 2>/dev/null || echo "$LOCAL")

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "⬇️ 检测到远程更新，自动拉取..."

    # 检查是否有本地修改
    if git diff-index --quiet HEAD --; then
        # 没有本地修改，直接拉取
        git pull origin source
        echo "✅ 已同步到最新版本"
    else
        # 有本地修改，先暂存再拉取
        echo "📦 暂存本地修改..."
        git stash push -m "auto-stash-$(date +%s)"
        git pull origin source

        # 尝试恢复暂存
        if git stash pop 2>/dev/null; then
            echo "✅ 已同步并恢复本地修改"
        else
            echo "⚠️ 合并冲突，请手动处理: git stash pop"
            exit 1
        fi
    fi
else
    echo "✅ 本地已是最新"
fi

echo "🚀 启动 Hexo 服务器..."
exec npx hexo server