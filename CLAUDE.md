# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hexo blog deployed to GitHub Pages at jopus.cn. The project uses a two-branch workflow:
- `source` branch: Source code (configs, posts, themes)
- `master` branch: Generated static files (deployed to GitHub Pages)

## Common Commands

```bash
# Development
npm run server          # Start local dev server at localhost:4000
npm run build           # Generate static files to public/
npm run clean           # Clean generated files

# Deployment
npm run deploy          # Deploy to GitHub Pages (pushes to master)
npm run deploy:keep-workflow  # Deploy while preserving GitHub Actions workflow

# Creating posts
npx hexo new "Post Title"      # Create new post in source/_posts/
```

## Architecture

### Directory Structure
- `source/_posts/` - Blog posts (Markdown files)
- `themes/paper/` - Custom theme (pug templates, stylus styles)
- `scripts/` - Hexo scripts (workflow file copying)
- `.github/workflows/` - GitHub Actions for automated daily rebuilds
- `public/` - Generated static files (gitignored, output of hexo generate)

### Deployment Automation
1. **GitHub Actions** (`.github/workflows/deploy.yml`): Daily rebuild at UTC 16:10 (Beijing 0:10)
2. **Cron job** (`daily-rebuild-and-deploy.sh`): Local daily rebuild with auto-commit for new posts
3. **Hexo script** (`scripts/copy-workflow.js`): Ensures workflow file is preserved during deploy

### Theme Configuration
- Theme: `paper` (located in `themes/paper/`)
- Theme config: `themes/paper/_config.yml`
- Supports daily theme color rotation via `main_color` setting

## Workflow

1. Make changes in `source` branch
2. Test locally: `npm run server`
3. Commit source changes: `git add . && git commit -m "message" && git push origin source`
4. Deploy: `npm run deploy` (updates master branch automatically)

**Important**: Never manually edit `master` branch. It is managed entirely by `hexo deploy`.