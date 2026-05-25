// 将 thinks、reads、notes 合并到 RSS feed（幂等重建，防止多次运行重复插入）
hexo.extend.filter.register('before_exit', function() {
  const fs = require('fs');
  const path = require('path');
  const yaml = require('js-yaml');

  const rssPath = path.join(hexo.public_dir, 'rss.xml');
  if (!fs.existsSync(rssPath)) return;

  let rssContent = fs.readFileSync(rssPath, 'utf-8');

  // ① 提取 channel 头部（第一个 <item> 之前的所有内容）
  const headerMatch = rssContent.match(/^([\s\S]+?)(?=\n\s*<item>|\n\s*<\/channel>)/);
  if (!headerMatch) return;
  const channelHeader = headerMatch[1];

  // ② 提取 hexo-generator-feed 生成的原始 _posts 条目
  //    过滤掉已由本脚本注入的 [读书]/[思考]/[笔记] 条目，防止重复
  const itemPattern = /<item>([\s\S]*?)<\/item>/g;
  const originalItems = [];
  let m;
  while ((m = itemPattern.exec(rssContent)) !== null) {
    const body = m[1];
    const titleMatch = body.match(/<title>([\s\S]*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : '';
    if (title.startsWith('[读书]') || title.startsWith('[思考]') || title.startsWith('[笔记]')) continue;
    const linkMatch = body.match(/<link>(.*?)<\/link>/);
    const pubMatch = body.match(/<pubDate>(.*?)<\/pubDate>/);
    originalItems.push({
      link: linkMatch ? linkMatch[1] : '',
      pubDate: pubMatch ? new Date(pubMatch[1]) : new Date(0),
      raw: `    <item>${body}</item>`
    });
  }

  // ③ 从源目录读取 thinks/reads/notes 文章
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
        try { meta = { ...meta, ...yaml.load(match[1]) }; } catch (e) {}
        body = match[2] || '';
      }

      let summary = body
        .replace(/<!--more-->/g, '')
        .replace(/^#+.*$/gm, '')
        .replace(/\n+/g, ' ')
        .trim()
        .slice(0, 200);

      let htmlContent = '';
      try {
        htmlContent = hexo.render.renderSync({ text: body, engine: 'markdown' });
      } catch (e) {
        htmlContent = body;
      }
      htmlContent = htmlContent.replace(/<h1[^>]*>.*?<\/h1>\n?/, '');

      posts.push({
        fullTitle: `${label} ${meta.title}`,
        label,
        date: new Date(meta.date),
        updated: stats.mtime,
        path: `${prefix}/${file.replace('.md', '')}/`,
        content: htmlContent
      });
    });
    return posts;
  };

  const allExtras = [
    ...collectPosts(path.join(hexo.source_dir, '_thinks'), 'thinks', '[思考]'),
    ...collectPosts(path.join(hexo.source_dir, '_reads'), 'reads', '[读书]'),
    ...collectPosts(path.join(hexo.source_dir, '_notes'), 'notes', '[笔记]')
  ];

  // 按文件修改时间排序，取最新 20 篇
  allExtras.sort((a, b) => b.updated - a.updated);
  const recentExtras = allExtras.slice(0, 20);

  const baseUrl = hexo.config.url || 'https://jopus.cn';
  const formatDate = (d) => new Date(d).toUTCString();

  const extraItems = recentExtras.map(post => {
    const postUrl = `${baseUrl}/${post.path}`;
    return {
      link: postUrl,
      pubDate: new Date(post.updated || post.date),
      raw: `    <item>
      <title>${post.fullTitle}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${formatDate(post.updated || post.date)}</pubDate>
      <description><![CDATA[${post.content}]]></description>
    </item>`
    };
  });

  // ④ 合并去重：extraItems 优先，按 link 去重，按 pubDate 降序，取前 20
  const seen = new Set();
  const merged = [...extraItems, ...originalItems].filter(item => {
    if (!item.link || seen.has(item.link)) return false;
    seen.add(item.link);
    return true;
  });
  merged.sort((a, b) => b.pubDate - a.pubDate);
  const finalItems = merged.slice(0, 20);

  // ⑤ 更新 lastBuildDate 并重建 rss.xml
  const updatedHeader = channelHeader.replace(
    /<lastBuildDate>.*?<\/lastBuildDate>/,
    `<lastBuildDate>${formatDate(new Date())}</lastBuildDate>`
  );

  const newRss = updatedHeader + '\n' +
    finalItems.map(i => i.raw).join('\n') +
    '\n  </channel>\n</rss>';

  fs.writeFileSync(rssPath, newRss);
  hexo.log.info(`✅ RSS 已合并，共 ${finalItems.length} 条（含 ${recentExtras.length} 篇思考/读书/笔记）`);
}, 20);
