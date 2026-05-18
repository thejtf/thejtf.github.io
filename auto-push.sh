#!/bin/bash
# 自动 push 守护脚本
# 每 30 秒检查文件变化并自动 push

BLOG_DIR="/home/jopus/Blog"
LOG_FILE="/home/jopus/Blog/.auto-push.log"
PID_FILE="/home/jopus/Blog/.auto-push.pid"

cd "$BLOG_DIR"

case "${1:-start}" in
    start)
        if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
            echo "⚠️  已在运行 (PID: $(cat $PID_FILE))"
            exit 0
        fi
        echo "🚀 启动自动 push..."
        echo "   每 30 秒检查并 push"
        echo "   日志: tail -f $LOG_FILE"

        # 启动后台进程
        nohup bash -c '
            cd /home/jopus/Blog
            while true; do
                sleep 30
                # 拉取远程
                git fetch origin source 2>/dev/null
                LOCAL=$(git rev-parse HEAD)
                REMOTE=$(git rev-parse origin/source 2>/dev/null)
                if [ "$LOCAL" != "$REMOTE" ]; then
                    echo "[$(date "+%m-%d %H:%M")] ⬇️ 拉取远程" >> /home/jopus/Blog/.auto-push.log
                    git pull origin source --quiet 2>/dev/null
                fi
                # 检查本地改动
                if ! git diff-index --quiet HEAD -- 2>/dev/null; then
                    CHANGED=$(git diff --name-only 2>/dev/null | grep "^source/" | head -5 | tr "\n" ", ")
                    if [ -n "$CHANGED" ]; then
                        echo "[$(date "+%m-%d %H:%M")] ⬆️ 推送: ${CHANGED}" >> /home/jopus/Blog/.auto-push.log
                        git add source/ 2>/dev/null
                        git commit -m "Auto push: $(date "+%Y-%m-%d %H:%M")" 2>/dev/null
                        git push origin source --quiet 2>/dev/null
                        echo "[$(date "+%m-%d %H:%M")] ✅ 已推送" >> /home/jopus/Blog/.auto-push.log
                    fi
                fi
            done
        ' > /dev/null 2>&1 &

        echo $! > "$PID_FILE"
        sleep 1
        echo "✅ 已启动 (PID: $(cat $PID_FILE))"
        ;;

    stop)
        if [ -f "$PID_FILE" ]; then
            kill $(cat "$PID_FILE") 2>/dev/null
            rm "$PID_FILE"
            echo "✅ 已停止"
        else
            echo "⚠️  未运行"
        fi
        ;;

    status)
        if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
            echo "✅ 运行中 (PID: $(cat $PID_FILE))"
            tail -5 "$LOG_FILE" 2>/dev/null
        else
            echo "⚠️  未运行"
        fi
        ;;

    *)
        echo "用法: $0 [start|stop|status]"
        ;;
esac