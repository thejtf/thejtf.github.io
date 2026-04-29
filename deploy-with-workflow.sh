#!/bin/bash

# Hexo 部署脚本（保留 GitHub Actions workflow）
# 这个脚本确保在部署后 workflow 文件仍然存在
# 同时会自动提交新博文到 source 分支

BLOG_DIR="/home/jopus/Blog"
cd "$BLOG_DIR" || exit 1

# 0. 检查是否有新内容需要提交到 source 分支
echo "检查是否有新内容需要提交..."

# 检查 _posts/
NEW_POSTS=$(git status --porcelain "source/_posts/" 2>/dev/null | grep "^??")
if [ -n "$NEW_POSTS" ]; then
  echo "发现新博文，正在提交..."
  git add "source/_posts/"
  git commit -m "Add new posts: $(date '+%Y-%m-%d %H:%M')"
  echo "✅ 新博文已提交"
fi

# 检查 _notes/
NEW_NOTES=$(git status --porcelain "source/_notes/" 2>/dev/null)
if [ -n "$NEW_NOTES" ]; then
  echo "发现笔记变更，正在提交..."
  git add "source/_notes/"
  git commit -m "Update notes: $(date '+%Y-%m-%d %H:%M')"
  echo "✅ 笔记已提交"
fi

# 检查 _thinks/
NEW_THINKS=$(git status --porcelain "source/_thinks/" 2>/dev/null)
if [ -n "$NEW_THINKS" ]; then
  echo "发现思考马克变更，正在提交..."
  git add "source/_thinks/"
  git commit -m "Update thinking marks: $(date '+%Y-%m-%d %H:%M')"
  echo "✅ 思考马克已提交"
fi

# 如果有任何提交，推送到远程
if [ -n "$NEW_POSTS" ] || [ -n "$NEW_NOTES" ] || [ -n "$NEW_THINKS" ]; then
  git push origin source
  echo "✅ 已推送到 source 分支"
else
  echo "没有发现新内容需要提交"
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

