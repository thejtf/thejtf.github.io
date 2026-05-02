// hexo read 命令 - 创建读书笔记
// 用法: hexo read "书名" [--category 社科/文学/科技/实用]

hexo.extend.console.register('read', 'Create a reading note', {
  usage: '[title] [--category <category>]',
  arguments: [
    { name: 'title', desc: 'Book title' },
    { name: 'category', desc: 'Category (社科/文学/科技/实用)' }
  ]
}, function(args) {
  const fs = require('fs');
  const path = require('path');

  const title = args._.join(' ');
  if (!title) {
    hexo.log.error('请输入书名，例如: hexo read "乡土中国"');
    hexo.log.info('可选分类: --category 社科/文学/科技/实用');
    return;
  }

  // 解析分类参数
  const validCategories = ['社科', '文学', '科技', '实用'];
  let category = '实用'; // 默认分类

  if (args.category) {
    if (validCategories.includes(args.category)) {
      category = args.category;
    } else {
      hexo.log.warn(`无效分类 "${args.category}"，使用默认分类 "实用"`);
      hexo.log.info(`有效分类: ${validCategories.join('/')}`);
    }
  }

  const date = new Date();

  const formatDate = (d) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const content = `---
title: ${title}
date: ${formatDate(date)}
tags:
  - 读书
categories:
  - ${category}
photos:
top:
---

<!--more-->

#### 书摘



#### 心得

`;

  const filename = title + '.md';
  const readsDir = path.join(hexo.source_dir, '_reads');
  const filePath = path.join(readsDir, filename);

  // 确保 _reads 目录存在
  if (!fs.existsSync(readsDir)) {
    fs.mkdirSync(readsDir, { recursive: true });
  }

  // 检查文件是否已存在
  if (fs.existsSync(filePath)) {
    hexo.log.error(`文件已存在: source/_reads/${filename}`);
    hexo.log.info('请手动编辑该文件追加内容');
    return;
  }

  fs.writeFileSync(filePath, content);
  hexo.log.info(`✅ 创建读书笔记: source/_reads/${filename}`);
  hexo.log.info(`📝 分类: ${category}`);
  hexo.log.info(`提示: 编辑文件添加书摘和心得`);

  // 自动 commit 和 push
  const exec = require('child_process').execSync;
  try {
    hexo.log.info('正在提交到 git...');
    exec(`git add "source/_reads/${filename}"`, { cwd: hexo.base_dir, stdio: 'inherit' });
    exec(`git commit -m "Add reading note: ${title}"`, { cwd: hexo.base_dir, stdio: 'inherit' });
    exec('git push origin source', { cwd: hexo.base_dir, stdio: 'inherit' });
    hexo.log.info('✅ 已提交并推送到 source 分支');
  } catch (e) {
    hexo.log.warn('⚠️ Git 操作失败，请手动提交');
  }
});