#!/bin/bash
# Kindle 高亮自动同步脚本
# 用于 systemd 服务

BLOG_DIR="/home/jopus/Blog"
KINDLE_PATH="/media/jopus/Kindle"
LOG_FILE="/home/jopus/Blog/kindle-sync.log"

# 检查 Kindle 是否连接
if [ ! -d "$KINDLE_PATH" ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Kindle 未连接" >> "$LOG_FILE"
    exit 0
fi

# 检查 My Clippings.txt 是否存在
if [ ! -f "$KINDLE_PATH/documents/My Clippings.txt" ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') - My Clippings.txt 不存在" >> "$LOG_FILE"
    exit 0
fi

# 记录同步开始时间
echo "$(date '+%Y-%m-%d %H:%M:%S') - 开始同步 Kindle 高亮..." >> "$LOG_FILE"

# 执行同步
cd "$BLOG_DIR"
npx hexo kindle-sync >> "$LOG_FILE" 2>&1

echo "$(date '+%Y-%m-%d %H:%M:%S') - 同步完成" >> "$LOG_FILE"