// 覆盖 hexo new 命令，添加自动 commit 和 push
hexo.extend.console.register('new', 'Create a new post', {
  usage: '[title]',
  arguments: [
    { name: 'title', desc: 'Post title' }
  ]
}, function(args) {
  const fs = require('fs');
  const path = require('path');
  const exec = require('child_process').execSync;

  const title = args._.join(' ') || 'Untitled';
  const date = new Date();

  const formatDate = (d) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  // 默认内容
  const content = `---
title: ${title}
date: ${formatDate(date)}
tags:
categories:
---

`;

  const filename = title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-') + '.md';
  const postsDir = path.join(hexo.source_dir, '_posts');
  const filePath = path.join(postsDir, filename);

  // 确保 _posts 目录存在
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  fs.writeFileSync(filePath, content);
  hexo.log.info(`Created post: source/_posts/${filename}`);

  // 自动 commit 和 push
  try {
    hexo.log.info('正在提交到 git...');
    exec(`git add "source/_posts/${filename}"`, { cwd: hexo.base_dir, stdio: 'inherit' });
    exec(`git commit -m "Add new post: ${title}"`, { cwd: hexo.base_dir, stdio: 'inherit' });
    exec('git push origin source', { cwd: hexo.base_dir, stdio: 'inherit' });
    hexo.log.info('✅ 已提交并推送到 source 分支');
  } catch (e) {
    hexo.log.warn('⚠️ Git 操作失败，请手动提交');
  }
});