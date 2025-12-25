#!/bin/bash

# Hexo 博客每日自动重建并部署脚本
# 用于确保主题色与当前日期一致，并自动部署到 GitHub Pages

# 加载环境变量（确保能找到 npx 和 node）
export PATH="/home/jopus/.nvm/versions/node/v20.19.6/bin:$PATH"
export NVM_DIR="/home/jopus/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 设置工作目录
BLOG_DIR="/home/jopus/Blog"
LOG_FILE="/home/jopus/Blog/daily-rebuild-deploy.log"

# 进入博客目录
cd "$BLOG_DIR" || exit 1

# 记录开始时间
echo "=========================================" >> "$LOG_FILE"
echo "开始每日重建并部署: $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE"

# 清理旧文件
echo "清理旧文件..." >> "$LOG_FILE"
npx hexo clean >> "$LOG_FILE" 2>&1

# 重新生成静态文件
echo "重新生成静态文件..." >> "$LOG_FILE"
npx hexo generate >> "$LOG_FILE" 2>&1

# 检查生成是否成功
if [ $? -ne 0 ]; then
    echo "生成失败，停止部署: $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE"
    echo "=========================================" >> "$LOG_FILE"
    exit 1
fi

# 部署到 GitHub Pages
echo "部署到 GitHub Pages..." >> "$LOG_FILE"
npx hexo deploy >> "$LOG_FILE" 2>&1

# 检查部署是否成功
if [ $? -eq 0 ]; then
    echo "重建并部署成功: $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE"
    echo "=========================================" >> "$LOG_FILE"
    exit 0
else
    echo "部署失败: $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE"
    echo "=========================================" >> "$LOG_FILE"
    exit 1
fi

