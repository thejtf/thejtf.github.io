// 将 thinks、reads、notes 合并到 RSS feed
// 并给所有文章的 content 开头添加 h1 标题
hexo.extend.filter.register('before_exit', function() {
  const fs = require('fs');
  const path = require('path');

  const rssPath = path.join(hexo.public_dir, 'rss.xml');

  if (!fs.existsSync(rssPath)) {
    return;
  }

  // 收集所有文章
  const collectPosts = (dir, prefix, label) => {
    const posts = [];
    if (!fs.existsSync(dir)) return posts;

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const stats = fs.statSync(filePath);

      const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      let meta = { title: file.replace('.md', ''), date: new Date() };
      let body = '';

      if (match) {
        const yaml = require('js-yaml');
        try {
          meta = { ...meta, ...yaml.load(match[1]) };
        } catch (e) {}
        body = match[2] || '';
      }

      // 提取正文前200字符作为摘要
      let summary = body
        .replace(/<!--more-->/g, '')
        .replace(/^#+.*$/gm, '')
        .replace(/\n+/g, ' ')
        .trim()
        .slice(0, 200);

      // 将 markdown 转换为 HTML（完整内容）
      let htmlContent = '';
      try {
        htmlContent = hexo.render.renderSync({ text: body, engine: 'markdown' });
      } catch (e) {
        htmlContent = body;
      }

      // 去掉 content 里的第一个 h1 标题
      htmlContent = htmlContent.replace(/<h1[^>]*>.*?<\/h1>\n?/, '');

      const fullTitle = `${label} ${meta.title}`;

      posts.push({
        title: meta.title,
        label: label,
        fullTitle: fullTitle,
        date: meta.date,
        updated: stats.mtime,
        path: `${prefix}/${file.replace('.md', '')}/`,
        summary: summary,
        content: htmlContent
      });
    });
    return posts;
  };

  // 收集各类文章
  const allPosts = [
    ...collectPosts(path.join(hexo.source_dir, '_thinks'), 'thinks', '[思考]'),
    ...collectPosts(path.join(hexo.source_dir, '_reads'), 'reads', '[读书]'),
    ...collectPosts(path.join(hexo.source_dir, '_notes'), 'notes', '[笔记]')
  ];

  // 按修改时间排序，取最新的20篇
  allPosts.sort((a, b) => new Date(b.updated) - new Date(a.updated));
  const recentPosts = allPosts.slice(0, 20);

  // 读取现有的 rss.xml
  let rssContent = fs.readFileSync(rssPath, 'utf-8');

  // 格式化日期 (RSS 2.0 使用 UTCString 格式)
  const formatDate = (d) => new Date(d).toUTCString();

  // 添加合并的文章 (RSS 2.0 格式)
  if (recentPosts.length > 0) {
    const baseUrl = hexo.config.url || 'https://jopus.cn';

    const newItems = recentPosts.map(post => {
      const postUrl = `${baseUrl}/${post.path}`;

      return `
    <item>
      <title>${post.fullTitle}</title>
      <link>${postUrl}</link>
      <pubDate>${formatDate(post.date)}</pubDate>
      <description><![CDATA[${post.content}]]></description>
    </item>`;
    }).join('\n');

    // 找到 lastBuildDate 标签后的位置插入
    const lastBuildDateMatch = rssContent.match(/<lastBuildDate>.*?<\/lastBuildDate>\n/);
    if (lastBuildDateMatch) {
      rssContent = rssContent.replace(
        /<lastBuildDate>.*?<\/lastBuildDate>\n/,
        lastBuildDateMatch[0] + newItems + '\n'
      );
    } else {
      rssContent = rssContent.replace('</channel>', newItems + '\n  </channel>');
    }
  }

  // 更新 lastBuildDate 时间
  rssContent = rssContent.replace(
    /<lastBuildDate>.*?<\/lastBuildDate>/,
    `<lastBuildDate>${formatDate(new Date())}</lastBuildDate>`
  );

  fs.writeFileSync(rssPath, rssContent);
  hexo.log.info(`✅ RSS 已合并 ${recentPosts.length} 篇思考/读书/笔记文章`);
}, 20);