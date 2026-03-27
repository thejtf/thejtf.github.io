// 处理 _thinks 目录下的文章
// 使用 template_locals 将 thinks 注入到模板上下文
hexo.extend.filter.register('template_locals', function(locals) {
  const fs = require('fs');
  const path = require('path');

  const thinksDir = path.join(hexo.source_dir, '_thinks');

  // 检查目录是否存在
  if (!fs.existsSync(thinksDir)) {
    locals.thinks = [];
    return locals;
  }

  // 读取所有 .md 文件
  const files = fs.readdirSync(thinksDir).filter(f => f.endsWith('.md'));

  const posts = files.map(file => {
    const filePath = path.join(thinksDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // 解析 front matter
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    let meta = { title: file.replace('.md', ''), date: new Date(), tags: [], categories: [] };
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
      path: `thinks/${file.replace('.md', '')}/`,
      sortNum: sortNum,
      tags: meta.tags || [],
      categories: meta.categories || []
    };
  });

  // 按日期倒序排序
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 注入到模板 locals
  locals.thinks = posts;

  // 将 thinks 的 categories 和 tags 添加到 site 中
  if (locals.site) {
    const categoryMap = new Map();
    const tagMap = new Map();

    posts.forEach(post => {
      // 处理 categories
      if (post.categories && post.categories.length > 0) {
        post.categories.forEach(cat => {
          if (typeof cat === 'string') {
            if (!categoryMap.has(cat)) {
              categoryMap.set(cat, []);
            }
            categoryMap.get(cat).push(post);
          }
        });
      }

      // 处理 tags
      if (post.tags && post.tags.length > 0) {
        post.tags.forEach(tag => {
          if (typeof tag === 'string') {
            if (!tagMap.has(tag)) {
              tagMap.set(tag, []);
            }
            tagMap.get(tag).push(post);
          }
        });
      }
    });

    // 将 think 的分类和标签合并到 site 中
    locals.thinkCategories = Array.from(categoryMap.entries()).map(([name, posts]) => ({
      name,
      posts: { toArray: () => posts },
      path: `thinks/categories/${name}/`
    }));

    locals.thinkTags = Array.from(tagMap.entries()).map(([name, posts]) => ({
      name,
      posts: { toArray: () => posts },
      path: `thinks/tags/${name}/`
    }));

    // 处理归档（按年份分组）
    const archiveMap = new Map();
    posts.forEach(post => {
      const year = new Date(post.date).getFullYear();
      if (!archiveMap.has(year)) {
        archiveMap.set(year, []);
      }
      archiveMap.get(year).push(post);
    });

    locals.thinkArchives = Array.from(archiveMap.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([year, posts]) => ({
        name: year.toString(),
        posts: { toArray: () => posts },
        path: `thinks/archives/${year}/`
      }));
  }

  return locals;
});

// 生成 thinks 文章页面
hexo.extend.generator.register('thinks', function(locals) {
  const fs = require('fs');
  const path = require('path');

  const thinksDir = path.join(hexo.source_dir, '_thinks');

  if (!fs.existsSync(thinksDir)) {
    return [];
  }

  const files = fs.readdirSync(thinksDir).filter(f => f.endsWith('.md'));
  const results = [];

  // 收集所有文章数据，按分类和标签分组
  const categoryMap = new Map();
  const tagMap = new Map();
  const allPosts = [];

  // 生成文章页面
  files.forEach(file => {
    const filePath = path.join(thinksDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    let meta = { title: file.replace('.md', ''), date: new Date(), tags: [], categories: [] };
    let body = content;

    if (match) {
      const yaml = require('js-yaml');
      try {
        meta = { ...meta, ...yaml.load(match[1]) };
      } catch (e) {}
      body = match[2];
    }

    const postData = {
      title: meta.title,
      date: meta.date,
      source: file,
      path: `thinks/${file.replace('.md', '')}/`,
      content: hexo.render.renderSync({ text: body, engine: 'markdown' }),
      tags: meta.tags || [],
      categories: meta.categories || [],
      _think: true
    };

    allPosts.push(postData);

    // 收集 categories
    if (meta.categories) {
      meta.categories.forEach(cat => {
        if (typeof cat === 'string') {
          if (!categoryMap.has(cat)) {
            categoryMap.set(cat, []);
          }
          categoryMap.get(cat).push(postData);
        }
      });
    }

    // 收集 tags
    if (meta.tags) {
      meta.tags.forEach(tag => {
        if (typeof tag === 'string') {
          if (!tagMap.has(tag)) {
            tagMap.set(tag, []);
          }
          tagMap.get(tag).push(postData);
        }
      });
    }
  });

  // 按日期排序所有文章
  allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 为每篇文章设置 prev 和 next
  allPosts.forEach((post, index) => {
    if (index > 0) {
      post.prev = allPosts[index - 1];
    }
    if (index < allPosts.length - 1) {
      post.next = allPosts[index + 1];
    }
  });

  // 生成文章页面（带 prev/next）
  allPosts.forEach(postData => {
    results.push({
      path: `thinks/${postData.source.replace('.md', '')}/index.html`,
      data: postData,
      layout: 'post'
    });
  });

  // 存储所有思考数据供模板使用
  hexo.locals.set('thinksData', {
    posts: allPosts,
    categories: categoryMap,
    tags: tagMap
  });

  return results;
});

// 生成思考的分类和标签页面
hexo.extend.generator.register('thinks-taxonomy', function(locals) {
  const thinksData = hexo.locals.get('thinksData');
  if (!thinksData) return [];

  const results = [];
  const { categories, tags } = thinksData;

  // 生成分类页面
  categories.forEach((posts, catName) => {
    results.push({
      path: `thinks/categories/${catName}/index.html`,
      data: {
        name: catName,
        posts: { toArray: () => posts },
        _thinkCategory: true
      },
      layout: 'category'
    });
  });

  // 生成标签页面
  tags.forEach((posts, tagName) => {
    results.push({
      path: `thinks/tags/${tagName}/index.html`,
      data: {
        name: tagName,
        posts: { toArray: () => posts },
        _thinkTag: true
      },
      layout: 'tag'
    });
  });

  return results;
});

// 生成思考的归档页面
hexo.extend.generator.register('thinks-archives', function(locals) {
  const thinksData = hexo.locals.get('thinksData');
  if (!thinksData) return [];

  const results = [];
  const { posts } = thinksData;

  // 按年份分组
  const archiveMap = new Map();
  posts.forEach(post => {
    const year = new Date(post.date).getFullYear();
    if (!archiveMap.has(year)) {
      archiveMap.set(year, []);
    }
    archiveMap.get(year).push(post);
  });

  // 生成每年归档页面
  archiveMap.forEach((yearPosts, year) => {
    results.push({
      path: `thinks/archives/${year}/index.html`,
      data: {
        name: year.toString(),
        posts: { toArray: () => yearPosts },
        _thinkArchive: true
      },
      layout: 'archive'
    });
  });

  return results;
});

// 注入分页数据到 think 页面
hexo.extend.filter.register('after_init', function() {
  const fs = require('fs');
  const path = require('path');
  const thinksDir = path.join(hexo.source_dir, '_thinks');

  if (!fs.existsSync(thinksDir)) return;

  const files = fs.readdirSync(thinksDir).filter(f => f.endsWith('.md'));
  const perPage = 10;
  const total = files.length;
  const totalPages = Math.ceil(total / perPage);

  hexo.locals.set('thinkPaginationInfo', {
    total: totalPages,
    perPage: perPage,
    totalPosts: total
  });
});

// 在模板中注入当前页的分页数据
hexo.extend.filter.register('template_locals', function(locals) {
  const thinks = locals.thinks || [];
  const pagePath = locals.page ? locals.page.path : '';
  const isThinkPage = pagePath === 'think/index.html' || pagePath.match(/^think\/page\/\d+\/index\.html$/);

  if (!isThinkPage) {
    return locals;
  }

  const paginationInfo = hexo.locals.get('thinkPaginationInfo') || { total: 1, perPage: 10 };
  const perPage = paginationInfo.perPage;
  const totalPages = paginationInfo.total;

  let currentPage = 1;
  const match = pagePath.match(/page\/(\d+)\/index\.html$/);
  if (match) {
    currentPage = parseInt(match[1]);
  }

  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const pageThinks = thinks.slice(start, end);

  locals.pageThinks = pageThinks;
  locals.thinkPagination = {
    current: currentPage,
    total: totalPages,
    perPage: perPage,
    totalPosts: paginationInfo.totalPosts
  };

  return locals;
});