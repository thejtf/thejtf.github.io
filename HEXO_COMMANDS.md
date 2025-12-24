# Hexo 命令使用说明

## 问题原因

`hexo` 命令找不到是因为 Hexo 安装在项目的 `node_modules` 中，而不是全局安装。`node_modules/.bin` 目录不在系统的 PATH 环境变量中。

## 解决方案

### 方法 1：使用 npx（推荐，无需配置）

```bash
npx hexo server    # 启动服务器
npx hexo clean     # 清理
npx hexo generate  # 生成静态文件（可简写为 npx hexo g）
npx hexo deploy    # 部署
```

### 方法 2：使用 npm scripts（最简洁）

```bash
npm run server   # 启动服务器
npm run clean    # 清理
npm run build    # 生成静态文件
npm run deploy   # 部署
```

### 方法 3：直接使用完整路径

```bash
./node_modules/.bin/hexo server
./node_modules/.bin/hexo clean
./node_modules/.bin/hexo generate
./node_modules/.bin/hexo deploy
```

### 方法 4：使用函数（已配置）

已经在 `~/.bashrc` 中添加了 `hexo()` 函数，**需要重新加载配置或打开新终端**：

```bash
# 重新加载配置
source ~/.bashrc

# 然后就可以直接使用
hexo server
hexo clean
hexo generate
hexo deploy
```

## 快速参考

| 功能 | npx 方式 | npm 方式 | 直接命令（需重新加载 .bashrc） |
|------|---------|---------|---------------------------|
| 启动服务器 | `npx hexo server` | `npm run server` | `hexo server` |
| 清理 | `npx hexo clean` | `npm run clean` | `hexo clean` |
| 生成 | `npx hexo generate` | `npm run build` | `hexo generate` |
| 部署 | `npx hexo deploy` | `npm run deploy` | `hexo deploy` |

## 推荐使用方式

**日常使用推荐 `npm run` 方式**，因为：
- 命令更短
- 不需要输入 `npx`
- package.json 中已配置好

**如果习惯直接使用 `hexo` 命令**：
1. 打开新终端，或运行 `source ~/.bashrc`
2. 然后就可以直接使用 `hexo` 命令了

