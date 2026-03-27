// 添加 hexo note 命令
hexo.extend.console.register('note', 'Create a new note', {
  usage: '[title]',
  arguments: [
    { name: 'title', desc: 'Note title' }
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

  // 默认 Categories 为公开笔记，Tags 为笔记
  const content = `---
title: ${title}
date: ${formatDate(date)}
tags:
  - 笔记
categories:
  - 公开笔记
photos:
top: false
---

`;

  const filename = title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-') + '.md';
  const notesDir = path.join(hexo.source_dir, '_notes');
  const filePath = path.join(notesDir, filename);

  // 确保 _notes 目录存在
  if (!fs.existsSync(notesDir)) {
    fs.mkdirSync(notesDir, { recursive: true });
  }

  fs.writeFileSync(filePath, content);
  hexo.log.info(`Created note: source/_notes/${filename}`);
});