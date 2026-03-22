#!/bin/bash
# Kindle 高亮监控脚本
# 每30秒检查一次 Kindle 连接，连接时自动同步并部署

BLOG_DIR="/home/jopus/Blog"
KINDLE_PATH="/media/jopus/Kindle"
LAST_SYNC_FILE="/tmp/kindle-last-sync"
LOG_FILE="/home/jopus/Blog/kindle-sync.log"

echo "$(date '+%Y-%m-%d %H:%M:%S') - Kindle 监控服务启动" >> "$LOG_FILE"

while true; do
    # 检查 Kindle 是否连接
    if [ -d "$KINDLE_PATH" ]; then
        # 检查是否需要同步（避免重复同步）
        LAST_MTIME=$(stat -c %Y "$KINDLE_PATH/documents/My Clippings.txt" 2>/dev/null || echo "0")
        LAST_SYNC=$(cat "$LAST_SYNC_FILE" 2>/dev/null || echo "0")

        # 如果文件有更新或从未同步过
        if [ "$LAST_MTIME" -gt "$LAST_SYNC" ]; then
            echo "$(date '+%Y-%m-%d %H:%M:%S') - 检测到 Kindle 连接，开始同步..." >> "$LOG_FILE"

            cd "$BLOG_DIR"

            # 执行同步，检查是否有新内容
            SYNC_OUTPUT=$(npx hexo kindle-sync 2>&1)
            echo "$SYNC_OUTPUT" >> "$LOG_FILE"

            # 记录同步时间
            echo "$LAST_MTIME" > "$LAST_SYNC_FILE"
            echo "$(date '+%Y-%m-%d %H:%M:%S') - 同步完成" >> "$LOG_FILE"

            # 检查是否有创建或更新
            if echo "$SYNC_OUTPUT" | grep -q "创建\|更新"; then
                echo "$(date '+%Y-%m-%d %H:%M:%S') - 检测到新内容，开始部署..." >> "$LOG_FILE"

                # 提交源码
                git add source/_reads/
                git commit -m "Add new kindle highlights - $(date '+%Y-%m-%d %H:%M')" >> "$LOG_FILE" 2>&1
                git push origin source >> "$LOG_FILE" 2>&1

                # 部署到 GitHub Pages
                npm run deploy >> "$LOG_FILE" 2>&1

                echo "$(date '+%Y-%m-%d %H:%M:%S') - 部署完成" >> "$LOG_FILE"
            else
                echo "$(date '+%Y-%m-%d %H:%M:%S') - 无新内容，跳过部署" >> "$LOG_FILE"
            fi
        fi
    fi

    # 等待30秒
    sleep 30
done