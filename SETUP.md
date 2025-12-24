# Hexo 博客项目设置说明

## ✅ 已完成的工作

1. ✅ Git 仓库已初始化
2. ✅ 已连接到 GitHub 远程仓库：`https://github.com/thejtf/thejtf.github.io.git`
3. ✅ 已创建 `source` 分支用于存储 Hexo 源代码
4. ✅ Hexo 依赖已安装，项目可以正常运行

## 📋 分支说明

- **`master` 分支**：存储生成的静态文件（用于 GitHub Pages）
- **`source` 分支**：存储 Hexo 源代码（配置文件、文章、主题等）

## 🔐 配置 Git 认证

在推送代码到 GitHub 之前，需要配置身份验证。有两种方式：

### 方式 1：使用 SSH 密钥（推荐）

1. 检查是否已有 SSH 密钥：
```bash
ls -al ~/.ssh
```

2. 如果没有，生成新的 SSH 密钥：
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

3. 将公钥添加到 GitHub：
```bash
cat ~/.ssh/id_ed25519.pub
```
复制输出内容，在 GitHub 设置中添加 SSH 密钥。

4. 更改远程仓库 URL 为 SSH：
```bash
git remote set-url origin git@github.com:thejtf/thejtf.github.io.git
```

### 方式 2：使用 Personal Access Token

1. 在 GitHub 创建 Personal Access Token（Settings → Developer settings → Personal access tokens）
2. 使用 token 推送：
```bash
git push -u origin source
# 用户名：thejtf
# 密码：输入你的 Personal Access Token
```

或者配置 credential helper：
```bash
git config --global credential.helper store
git push -u origin source
# 输入用户名和 token
```

## 🚀 推送源代码到 GitHub

配置好认证后，执行：

```bash
git push -u origin source
```

## 💻 本地运行 Hexo 博客

### 启动开发服务器

```bash
# 方式 1：使用 npm scripts
npm run server

# 方式 2：直接使用 hexo
npx hexo server
```

服务器启动后，访问 `http://localhost:4000` 查看博客。

### 生成静态文件

```bash
# 方式 1：使用 npm scripts
npm run build

# 方式 2：直接使用 hexo
npx hexo generate
```

### 清理并重新生成

```bash
npx hexo clean
npx hexo generate
```

## 📝 常用命令

```bash
# 创建新文章
npx hexo new "文章标题"

# 部署到 GitHub Pages（会推送到 master 分支）
npx hexo deploy

# 或者使用 npm scripts
npm run deploy
```

## 📌 注意事项

1. **不要直接修改 master 分支**：master 分支应该只包含生成的静态文件，由 `hexo deploy` 命令自动更新。

2. **源代码修改**：所有源代码（文章、配置、主题）的修改都应该在 `source` 分支进行。

3. **工作流程**：
   - 在 `source` 分支编辑文章和配置
   - 本地测试：`npx hexo server`
   - 提交到 `source` 分支：`git add . && git commit -m "..." && git push origin source`
   - 部署到 GitHub Pages：`npx hexo deploy`（会自动推送到 master 分支）

4. **GitHub Pages 设置**：确保 GitHub 仓库设置中，GitHub Pages 的源分支设置为 `master`。

## 🔧 故障排除

### 如果依赖缺失

```bash
npm install
```

### 如果主题文件有问题

检查 `themes/paper` 目录是否完整，如果缺失可以重新下载主题。

### 如果部署失败

检查 `_config.yml` 中的部署配置，确保 GitHub token 有效（注意：token 可能已过期，需要更新）。

