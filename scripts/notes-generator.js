// 处理 _notes 目录下的文章
// 使用 template_locals 将 notes 注入到模板上下文
hexo.extend.filter.register('template_locals', function(locals) {
  const fs = require('fs');
  const path = require('path');

  const notesDir = path.join(hexo.source_dir, '_notes');

  // 检查目录是否存在
  if (!fs.existsSync(notesDir)) {
    locals.notes = [];
    return locals;
  }

  // 读取所有 .md 文件
  const files = fs.readdirSync(notesDir).filter(f => f.endsWith('.md'));

  const posts = files.map(file => {
    const filePath = path.join(notesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // 解析 front matter
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    let meta = { title: file.replace('.md', ''), date: new Date() };
    let body = content;

    if (match) {
      const yaml = require('js-yaml');
      try {
        meta = { ...meta, ...yaml.load(match[1]) };
      } catch (e) {}
      body = match[2];
    }

    // 从标题中提取数字用于排序
    let sortNum = 0;
    const numMatch = meta.title.match(/(\d+)/);
    if (numMatch) {
      sortNum = parseInt(numMatch[1]);
    }

    return {
      title: meta.title,
      date: meta.date,
      content: body,
      source: file,
      path: `notes/${file.replace('.md', '')}/`,
      sortNum: sortNum
    };
  });

  // 按日期倒序排序
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 注入到模板 locals
  locals.notes = posts;

  return locals;
});

// 生成 notes 文章页面
hexo.extend.generator.register('notes', function(locals) {
  const fs = require('fs');
  const path = require('path');

  const notesDir = path.join(hexo.source_dir, '_notes');

  if (!fs.existsSync(notesDir)) {
    return [];
  }

  const files = fs.readdirSync(notesDir).filter(f => f.endsWith('.md'));
  const results = [];

  // 生成文章页面
  files.forEach(file => {
    const filePath = path.join(notesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    let meta = { title: file.replace('.md', ''), date: new Date() };
    let body = content;

    if (match) {
      const yaml = require('js-yaml');
      try {
        meta = { ...meta, ...yaml.load(match[1]) };
      } catch (e) {}
      body = match[2];
    }

    results.push({
      path: `notes/${file.replace('.md', '')}/index.html`,
      data: {
        title: meta.title,
        date: meta.date,
        content: hexo.render.renderSync({ text: body, engine: 'markdown' })
      },
      layout: 'post'
    });
  });

  return results;
});

// 注入分页数据到 note 页面
hexo.extend.filter.register('after_init', function() {
  // 注册一个在页面生成时处理分页的 filter
  const fs = require('fs');
  const path = require('path');
  const notesDir = path.join(hexo.source_dir, '_notes');

  if (!fs.existsSync(notesDir)) return;

  const files = fs.readdirSync(notesDir).filter(f => f.endsWith('.md'));
  const perPage = 10;
  const total = files.length;
  const totalPages = Math.ceil(total / perPage);

  // 存储分页信息供后续使用
  hexo.locals.set('notePaginationInfo', {
    total: totalPages,
    perPage: perPage,
    totalPosts: total
  });
});

// 在模板中注入当前页的分页数据
hexo.extend.filter.register('template_locals', function(locals) {
  // 获取所有笔记
  const notes = locals.notes || [];

  // 判断是否是 note 页面或其分页
  const pagePath = locals.page ? locals.page.path : '';
  const isNotePage = pagePath === 'note/index.html' || pagePath.match(/^note\/page\/\d+\/index\.html$/);

  if (!isNotePage) {
    return locals;
  }

  // 获取分页信息
  const paginationInfo = hexo.locals.get('notePaginationInfo') || { total: 1, perPage: 10 };
  const perPage = paginationInfo.perPage;
  const totalPages = paginationInfo.total;

  // 获取当前页码
  let currentPage = 1;
  const match = pagePath.match(/page\/(\d+)\/index\.html$/);
  if (match) {
    currentPage = parseInt(match[1]);
  }

  // 计算当前页的文章
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const pageNotes = notes.slice(start, end);

  // 分页信息
  locals.pageNotes = pageNotes;
  locals.notePagination = {
    current: currentPage,
    total: totalPages,
    perPage: perPage,
    totalPosts: paginationInfo.totalPosts
  };

  return locals;
});