# Hexo 博客项目设置说明

## ✅ 已完成的工作

1. ✅ Git 仓库已初始化
2. ✅ 已连接到 GitHub 远程仓库：`https://github.com/thejtf/thejtf.github.io.git`
3. ✅ SSH 认证已配置（使用 443 端口）
4. ✅ 已创建 `source` 分支用于存储 Hexo 源代码
5. ✅ 源代码已成功推送到 GitHub 的 `source` 分支
6. ✅ Hexo 依赖已安装，项目可以正常运行
7. ✅ 已从配置文件中移除敏感信息（Personal Access Token）

## 📋 分支说明

- **`master` 分支**：存储生成的静态文件（用于 GitHub Pages）
- **`source` 分支**：存储 Hexo 源代码（配置文件、文章、主题等）

## 🔐 Git 认证状态

✅ **SSH 认证已配置完成**

- SSH 密钥已存在：`~/.ssh/id_ed25519`
- 远程仓库已配置为 SSH：`git@github.com:thejtf/thejtf.github.io.git`
- 已配置使用 GitHub 的 HTTPS 端口（443）进行 SSH 连接
- 源代码已成功推送到 GitHub

如果需要重新配置，请参考下面的说明。

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

`_config.yml` 中的部署配置已移除 token（出于安全考虑）。部署时需要使用以下方式之一：

**方式 1：使用 SSH 部署（推荐）**

修改 `_config.yml` 中的部署配置：
```yaml
deploy:
  type: git
  repo: git@github.com:thejtf/thejtf.github.io.git
  branch: master
```

**方式 2：使用 Personal Access Token**

1. 在 GitHub 创建 Personal Access Token（Settings → Developer settings → Personal access tokens）
2. 修改 `_config.yml`：
```yaml
deploy:
  type: git
  repo: https://thejtf:YOUR_TOKEN@github.com/thejtf/thejtf.github.io.git
  branch: master
```
⚠️ **注意**：不要将包含 token 的配置文件提交到 Git！

**方式 3：使用环境变量**

使用 `hexo-deployer-git` 的环境变量功能，避免在配置文件中存储 token。

