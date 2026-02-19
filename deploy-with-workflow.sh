#!/bin/bash

# Hexo 部署脚本（保留 GitHub Actions workflow）
# 这个脚本确保在部署后 workflow 文件仍然存在
# 同时会自动提交新博文到 source 分支

BLOG_DIR="/home/jopus/Blog"
cd "$BLOG_DIR" || exit 1

# 0. 检查是否有新博文需要提交到 source 分支
echo "检查是否有新博文需要提交..."
NEW_POSTS=$(git status --porcelain "source/_posts/" 2>/dev/null | grep "^??")

if [ -n "$NEW_POSTS" ]; then
    echo "发现新博文，正在提交到 source 分支..."
    git add "source/_posts/"
    git commit -m "Add new posts: $(date '+%Y-%m-%d %H:%M')"
    git push origin source
    echo "✅ 新博文已提交到 source 分支"
else
    echo "没有发现新博文需要提交"
fi

# 1. 清理并生成静态文件
echo "清理并生成静态文件..."
npx hexo clean
npx hexo generate

# 2. 将 workflow 文件复制到 public 目录（这样部署时会包含它）
echo "复制 workflow 文件到 public 目录..."
mkdir -p public/.github/workflows
cp .github/workflows/deploy.yml public/.github/workflows/deploy.yml

# 3. 部署到 GitHub Pages
echo "部署到 GitHub Pages..."
npx hexo deploy

echo "✅ 部署完成！Workflow 文件已包含在部署中。"

