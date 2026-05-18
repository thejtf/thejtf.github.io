#!/bin/bash
# 自动同步守护进程 - 统一入口
# 负责双向同步：拉取远程更新 + 推送本地改动

BLOG_DIR="/home/jopus/Blog"
LOG_FILE="/home/jopus/Blog/.sync.log"

cd "$BLOG_DIR"

case "${1:-start}" in
    start)
        # 检查是否已有进程运行
        if pgrep -f "auto-sync-loop" > /dev/null; then
            echo "⚠️  自动同步已在运行"
            pgrep -f "auto-sync-loop" | xargs ps -p | tail -n +2
            exit 0
        fi

        echo "🚀 启动自动同步守护进程..."
        echo "   每 30 秒双向同步"
        echo "   日志: tail -f $LOG_FILE"

        # 启动后台进程，用标记名便于检测
        nohup bash -c '
            cd /home/jopus/Blog

            while true; do
                sleep 30

                # 1. 检查远程连接
                if ! git fetch origin source 2>/dev/null; then
                    echo "[$(date "+%m-%d %H:%M")] ❌ 无法连接远程" >> .sync.log
                    continue
                fi

                # 2. 拉取远程更新
                LOCAL=$(git rev-parse HEAD)
                REMOTE=$(git rev-parse origin/source 2>/dev/null || echo "")

                if [ "$LOCAL" != "$REMOTE" ] && [ -n "$REMOTE" ]; then
                    # 有本地改动时先暂存
                    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
                        git stash -q 2>/dev/null || true
                    fi

                    # 拉取
                    if git pull origin source --quiet 2>/dev/null; then
                        # 恢复暂存
                        git stash pop -q 2>/dev/null || true
                        echo "[$(date "+%m-%d %H:%M")] ⬇️ 已拉取远程更新" >> .sync.log
                    else
                        echo "[$(date "+%m-%d %H:%M")] ⚠️ 拉取失败，可能有冲突" >> .sync.log
                    fi
                fi

                # 3. 推送本地改动
                if ! git diff-index --quiet HEAD -- 2>/dev/null; then
                    # 获取改动文件列表
                    CHANGED=$(git diff --name-only HEAD 2>/dev/null)

                    # 检查是否有实际内容（排除空文件）
                    HAS_CONTENT=false
                    for f in $CHANGED; do
                        if [ -f "$f" ]; then
                            # markdown 文件检查是否有实际内容
                            if [[ "$f" == *.md ]]; then
                                # 检查文件大小和是否只有 front matter
                                SIZE=$(wc -c < "$f" 2>/dev/null || echo 0)
                                if [ "$SIZE" -gt 200 ]; then
                                    # 检查是否有正文内容（front matter 后面有非空行）
                                    BODY=$(sed -n "/^---$/,/^---$/p" "$f" | wc -l)
                                    TOTAL=$(wc -l < "$f")
                                    if [ "$TOTAL" -gt "$BODY" ]; then
                                        HAS_CONTENT=true
                                        break
                                    fi
                                fi
                            else
                                # 非 markdown 文件，有改动就推送
                                HAS_CONTENT=true
                                break
                            fi
                        fi
                    done

                    if [ "$HAS_CONTENT" = true ]; then
                        git add -A 2>/dev/null
                        git commit -m "Auto sync: $(date "+%Y-%m-%d %H:%M")" 2>/dev/null
                        if git push origin source --quiet 2>/dev/null; then
                            echo "[$(date "+%m-%d %H:%M")] ⬆️ 已推送: $(echo "$CHANGED" | head -3 | tr "\n" ", ")" >> .sync.log
                        else
                            echo "[$(date "+%m-%d %H:%M")] ❌ 推送失败" >> .sync.log
                        fi
                    else
                        echo "[$(date "+%m-%d %H:%M")] ⏸️ 跳过空文件推送" >> .sync.log
                    fi
                fi
            done

            # 标记进程名（部分系统支持）
            echo "auto-sync-loop" > /proc/self/comm 2>/dev/null || true
        ' > /dev/null 2>&1 &

        # 记录 PID
        SYNC_PID=$!
        echo $SYNC_PID > "$BLOG_DIR/.sync.pid"
        sleep 1

        if pgrep -f "auto-sync-loop" > /dev/null; then
            echo "✅ 已启动 (PID: $SYNC_PID)"
        else
            echo "❌ 启动失败"
        fi
        ;;

    stop)
        if pgrep -f "auto-sync-loop" > /dev/null; then
            pkill -f "auto-sync-loop"
            rm -f "$BLOG_DIR/.sync.pid"
            echo "✅ 已停止"
        else
            echo "⚠️  未运行"
        fi
        ;;

    status)
        if pgrep -f "auto-sync-loop" > /dev/null; then
            echo "✅ 运行中"
            pgrep -f "auto-sync-loop" | head -1
            echo ""
            echo "最近日志:"
            tail -5 "$LOG_FILE" 2>/dev/null || echo "无日志"
        else
            echo "⚠️  未运行"
        fi
        ;;

    log)
        tail -20 "$LOG_FILE" 2>/dev/null || echo "无日志"
        ;;

    *)
        echo "用法: $0 [start|stop|status|log]"
        ;;
esac