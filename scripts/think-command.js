// 添加 hexo think 命令
hexo.extend.console.register('think', 'Create a new think note', {
  usage: '[title]',
  arguments: [
    { name: 'title', desc: 'Think note title' }
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

  // 默认 Categories 为思考，Tags 为 Think 和 Mark
  const content = `---
title: ${title}
date: ${formatDate(date)}
tags:
  - Think
  - Mark
categories:
  - 思考
photos:
top: false
---

`;

  const filename = title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-') + '.md';
  const thinksDir = path.join(hexo.source_dir, '_thinks');
  const filePath = path.join(thinksDir, filename);

  // 确保 _thinks 目录存在
  if (!fs.existsSync(thinksDir)) {
    fs.mkdirSync(thinksDir, { recursive: true });
  }

  fs.writeFileSync(filePath, content);
  hexo.log.info(`Created think: source/_thinks/${filename}`);
});