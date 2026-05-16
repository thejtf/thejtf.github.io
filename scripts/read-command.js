// hexo read 命令 - 创建读书笔记
// 用法: hexo read "书名" [--category 社科/文学/科技/实用] [--weread]

hexo.extend.console.register('read', 'Create a reading note', {
  usage: '[title] [--category <category>] [--weread]',
  arguments: [
    { name: 'title', desc: 'Book title' },
    { name: 'category', desc: 'Category (社科/文学/科技/实用)' },
    { name: 'weread', desc: 'Import from WeRead (微信读书)' }
  ]
}, async function(args) {
  const fs = require('fs');
  const path = require('path');

  const title = args._.join(' ');
  if (!title) {
    hexo.log.error('请输入书名，例如: hexo read "乡土中国"');
    hexo.log.info('可选参数:');
    hexo.log.info('  --category 社科/文学/科技/实用');
    hexo.log.info('  --weread 从微信读书导入');
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

  // 如果指定了 --weread，从微信读书导入
  if (args.weread) {
    await importFromWeread(title, category, hexo);
    return;
  }

  // 默认创建空白模板
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

// 从微信读书导入
async function importFromWeread(title, category, hexo) {
  const fs = require('fs');
  const path = require('path');
  const exec = require('child_process').execSync;
  const wereadApi = require('./weread-api');

  hexo.log.info(`🔍 正在搜索《${title}》...`);

  try {
    // 1. 搜索书籍
    const searchResult = await wereadApi.searchBook(title);
    if (!searchResult) {
      hexo.log.error(`未找到书籍: ${title}`);
      return;
    }

    const bookId = searchResult.bookId;
    hexo.log.info(`✓ 找到书籍: 《${searchResult.title}》 - ${searchResult.author || '未知作者'}`);

    // 2. 获取书籍详情
    const bookInfo = await wereadApi.getBookInfo(bookId);
    hexo.log.info(`✓ 获取书籍详情`);

    // 3. 获取划线
    const bookmarks = await wereadApi.getBookmarks(bookId);
    hexo.log.info(`✓ 获取划线: ${bookmarks.length} 条`);

    // 4. 获取想法
    const reviews = await wereadApi.getReviews(bookId);
    hexo.log.info(`✓ 获取想法: ${reviews.length} 条`);

    // 5. 生成 Markdown 内容
    const bookTitle = bookInfo.title || searchResult.title;
    const bookAuthor = bookInfo.author || searchResult.author || '';
    const bookIntro = bookInfo.intro || searchResult.intro || '待补充';

    const formatDate = (d) => {
      const pad = (n) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    // 找最新的划线/想法时间作为文章日期
    let latestTime = new Date();
    if (bookmarks.length > 0) {
      const bookmarkTimes = bookmarks.map(b => b.createTime || 0);
      const maxBookmarkTime = Math.max(...bookmarkTimes);
      if (maxBookmarkTime > 0) {
        latestTime = new Date(maxBookmarkTime * 1000);
      }
    }

    // YAML 值引号处理
    const yamlValue = (val) => {
      if (val && /[:{}[\],&*#?|\-<>=!%@`]/.test(val)) {
        return `"${val.replace(/"/g, '\\"')}"`;
      }
      return val;
    };

    // 构建书摘部分（引用格式）
    let excerptsContent = '';
    if (bookmarks.length > 0) {
      bookmarks.forEach(b => {
        excerptsContent += `> ${b.markText}\n\n`;
      });
    } else {
      excerptsContent = '\n';
    }

    // 构建心得部分
    let thoughtsContent = '';
    if (reviews.length > 0) {
      reviews.forEach(r => {
        if (r.content) {
          thoughtsContent += `${r.content}\n\n`;
        }
      });
    } else {
      thoughtsContent = '\n';
    }

    const mdContent = `---
title: ${yamlValue(bookTitle)}
date: ${formatDate(latestTime)}
tags:
  - 读书
categories:
  - ${category}
---

#### 内容简介

${bookIntro}

#### 书摘

${excerptsContent}

#### 心得

${thoughtsContent}
`;

    // 6. 保存文件
    const readsDir = path.join(hexo.source_dir, '_reads');
    if (!fs.existsSync(readsDir)) {
      fs.mkdirSync(readsDir, { recursive: true });
    }

    // 清理书名作为文件名
    const safeTitle = bookTitle.replace(/[\\/:*?"<>|'\-]/g, ' ').replace(/\s+/g, ' ').trim();
    const filename = `${safeTitle}.md`;
    const filePath = path.join(readsDir, filename);

    if (fs.existsSync(filePath)) {
      hexo.log.warn(`文件已存在，将覆盖: ${filename}`);
    }

    fs.writeFileSync(filePath, mdContent);
    hexo.log.info(`✅ 创建读书笔记: source/_reads/${filename}`);
    hexo.log.info(`   书名: ${bookTitle}`);
    hexo.log.info(`   作者: ${bookAuthor}`);
    hexo.log.info(`   分类: ${category}`);
    hexo.log.info(`   划线: ${bookmarks.length} 条`);
    hexo.log.info(`   心得: ${reviews.length} 条`);

    // 7. Git commit 和 push
    try {
      hexo.log.info('正在提交到 git...');
      exec(`git add "source/_reads/${filename}"`, { cwd: hexo.base_dir, stdio: 'inherit' });
      exec(`git commit -m "Add reading note from WeRead: ${bookTitle}"`, { cwd: hexo.base_dir, stdio: 'inherit' });
      exec('git push origin source', { cwd: hexo.base_dir, stdio: 'inherit' });
      hexo.log.info('✅ 已提交并推送到 source 分支');
    } catch (e) {
      hexo.log.warn('⚠️ Git 操作失败，请手动提交');
    }

  } catch (e) {
    hexo.log.error(`微信读书导入失败: ${e.message}`);
    hexo.log.info('请检查 WEREAD_API_KEY 环境变量是否正确设置');
  }
}