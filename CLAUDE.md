# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hexo blog deployed to GitHub Pages at jopus.cn. The project uses a two-branch workflow:
- `source` branch: Source code (configs, posts, themes)
- `master` branch: Generated static files (deployed to GitHub Pages)

## Quick Start

```bash
# 启动完全无感开发模式（推荐）
./start.sh

# 或使用 npm
npm start
```

This will:
- Start background auto-sync daemon (pulls remote changes every 30s)
- Start Hexo dev server at localhost:4000
- Auto-commit and push local changes every 30s

## Common Commands

```bash
# Development
./start.sh              # Start auto-sync dev server (recommended)
npm run server          # Start local dev server at localhost:4000
npm run build           # Generate static files to public/
npm run clean           # Clean generated files

# Deployment
npm run deploy          # Deploy to GitHub Pages (pushes to master)
npm run deploy:keep-workflow  # Deploy while preserving GitHub Actions workflow

# Creating posts
npx hexo new "Post Title"      # Create new post in source/_posts/
```

## Auto-Sync Development Mode

The project includes automatic bidirectional sync:

- **Local → Remote**: Changes auto-commit and push every 30 seconds
- **Remote → Local**: New content from WeRead sync auto-pulls every 30 seconds
- **Log**: `tail -f .sync.log`

**Why this matters**: The GitHub Actions workflow automatically syncs WeRead notes to the repo. Without auto-sync, local development would be outdated.

## Architecture

### Directory Structure
- `source/_posts/` - Blog posts (Markdown files)
- `source/_reads/` - Reading notes (auto-synced from WeRead)
- `source/_notes/` - Public notes
- `themes/paper/` - Custom theme (pug templates, stylus styles)
- `scripts/` - Hexo scripts (must be JS files only - Hexo loads these)
- `.github/workflows/` - GitHub Actions for automated WeRead sync
- `public/` - Generated static files (gitignored, output of hexo generate)

### Deployment Automation
1. **WeRead Sync** (`.github/workflows/deploy.yml`): Syncs WeRead notes every 30 minutes
2. **Local Auto-Sync** (`start.sh`): Background daemon for bidirectional sync
3. **Hexo script** (`scripts/copy-workflow.js`): Ensures workflow file is preserved during deploy

### Theme Configuration
- Theme: `paper` (located in `themes/paper/`)
- Theme config: `themes/paper/_config.yml`
- Sidebar links: Edit `social:` section in theme config

## Workflow

### Development (with auto-sync)
1. Run `./start.sh` to start auto-sync dev server
2. Edit files normally
3. Changes auto-commit and push every 30s
4. Remote changes auto-pull

### Manual Workflow (if needed)
1. Make changes in `source` branch
2. Test locally: `npm run server`
3. Commit source changes: `git add . && git commit -m "message" && git push origin source`
4. Deploy: `npm run deploy` (updates master branch automatically)

**Important**: Never manually edit `master` branch. It is managed entirely by `hexo deploy`.