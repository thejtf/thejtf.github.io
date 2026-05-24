# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hexo blog deployed to GitHub Pages at jopus.cn. The project uses a two-branch workflow:
- `source` branch: Source code (configs, posts, themes)
- `master` branch: Generated static files (deployed to GitHub Pages)

**Important**: Never manually edit the `master` branch. It is managed entirely by `hexo deploy`.

## Common Commands

```bash
# Development
./start.sh              # Start auto-sync dev server at localhost:4000 (recommended)
npm run server:original # Start Hexo dev server without auto-sync
npm run build           # Generate static files to public/
npm run clean           # Clean generated files
npm run sync:stop       # Stop the background auto-sync daemon

# Deployment
npm run deploy                # Deploy to GitHub Pages (pushes to master)
npm run deploy:keep-workflow  # Deploy while preserving GitHub Actions workflow

# Creating content (custom hexo commands)
npx hexo new "Post Title"                          # Blog post → source/_posts/
npx hexo note "Title"                              # Public note → source/_notes/
npx hexo think "Title"                             # Think note → source/_thinks/
npx hexo read "Book Title"                         # Reading note → source/_reads/
npx hexo read "Book Title" --category 社科         # With explicit category (社科/文学/科技/实用)
npx hexo read "Book Title" --weread                # Import from WeRead API
npx hexo weread-sync                               # Batch sync all WeRead notes
```

## Auto-Sync Development Mode

`./start.sh` starts a background daemon providing bidirectional sync:
- **Local → Remote**: Auto-commit and push every 30s
- **Remote → Local**: Pull WeRead-synced content every 30s
- **Log**: `tail -f .sync.log`

The GitHub Actions workflow syncs WeRead notes automatically, so without this daemon local development drifts behind remote.

## Architecture

### Content Sections

The site has four independent content sections, each backed by a dedicated directory and custom Hexo generator (`scripts/*-generator.js`):

| Section | Source directory | URL | Created via |
|---|---|---|---|
| Blog posts | `source/_posts/` | `/` (index) | `hexo new` |
| Reading notes | `source/_reads/` | `/read/` | `hexo read` |
| Think notes | `source/_thinks/` | `/think/` | `hexo think` |
| Public notes | `source/_notes/` | `/note/` | `hexo note` |

Content in `_reads/`, `_thinks/`, and `_notes/` is processed by custom `template_locals` filters (not Hexo's standard post pipeline), so these files do **not** appear on the main blog index.

### Scripts (`scripts/`)

Files here must be `.js` only — Hexo auto-loads every file in this directory. Key scripts:
- `*-generator.js` / `*-pagination.js` — register custom generators and paginators for each section
- `*-command.js` — register the `hexo note/read/think` console commands
- `weread-sync.js` / `weread-api.js` — WeRead batch sync and API client
- `copy-workflow.js` — copies `.github/workflows/deploy.yml` into `public/` so `hexo deploy` doesn't overwrite it

### Theme (`themes/paper/`)

Custom theme using **Pug** templates and **Stylus** styles.
- Layout templates: `themes/paper/layout/*.pug`
- Theme config: `themes/paper/_config.yml`
- Menu and sidebar links: edit `menu:` and `social:` sections in theme config
- Theme color: `main_color` in theme config (options: forest, grass, sky, sun, sea, gray, default, red)

### Deployment Automation

1. **WeRead Sync** (`.github/workflows/deploy.yml`): Runs daily (08:10 CST), syncs WeRead notes, rebuilds, and deploys to `master`
2. **Local Auto-Sync** (`start.sh`): Background daemon for bidirectional sync during development
3. **Workflow preservation** (`scripts/copy-workflow.js`): Hexo generates into `public/` which is force-pushed to `master`; this script ensures the workflow file survives that push

### Environment Variables

Required in `.env` (see `.env.example`):
- `WEREAD_API_KEY` — WeRead cookie/token for reading note sync
- `DEEPSEEK_API_KEY` — Used for AI-powered book categorization during sync

## Manual Workflow

1. Make changes in `source` branch
2. Test locally: `npm run server:original`
3. Commit: `git add . && git commit -m "message" && git push origin source`
4. Deploy: `npm run deploy`