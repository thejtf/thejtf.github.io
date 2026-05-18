// 覆盖 hexo new 命令
hexo.extend.console.register('new', 'Create a new post', {
  usage: '[title]',
  arguments: [
    { name: 'title', desc: 'Post title' }
  ]
}, function(args) {
  const fs = require('fs');
  const path = require('path');

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

  const filename = title.replace(/[^a-zA-Z0-9一-龥]/g, '-') + '.md';
  const postsDir = path.join(hexo.source_dir, '_posts');
  const filePath = path.join(postsDir, filename);

  // 确保 _posts 目录存在
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  fs.writeFileSync(filePath, content);
  hexo.log.info(`Created post: source/_posts/${filename}`);
  hexo.log.info('编辑内容后保存，auto-push 会自动推送到 GitHub');
});