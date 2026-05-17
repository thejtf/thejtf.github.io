#!/bin/bash
# 开发前自动拉取最新代码脚本
# 用法: ./git-pull-latest.sh && npm run server

echo "检查远程更新..."
git fetch origin

LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})
BASE=$(git merge-base @ @{u})

if [ $LOCAL = $REMOTE ]; then
    echo "✅ 本地已是最新"
elif [ $LOCAL = $BASE ]; then
    echo "⬇️ 需要拉取更新..."
    git pull origin source
    echo "✅ 已更新到最新"
else
    echo "⚠️ 本地有未推送的修改，请处理后再拉取"
    git status
    exit 1
fi