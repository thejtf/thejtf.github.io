// 将 thinks、reads、notes 合并到 RSS feed
// 在生成完成后修改 atom.xml
hexo.extend.filter.register('before_exit', function() {
  const fs = require('fs');
  const path = require('path');

  const atomPath = path.join(hexo.public_dir, 'atom.xml');

  if (!fs.existsSync(atomPath)) {
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

      posts.push({
        title: meta.title,
        label: label,
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

  if (recentPosts.length === 0) return;

  // 读取现有的 atom.xml
  const atomContent = fs.readFileSync(atomPath, 'utf-8');

  // 格式化日期
  const formatDate = (d) => new Date(d).toISOString();

  // 生成新的 entry XML
  const baseUrl = hexo.config.url || 'https://jopus.cn';

  const newEntries = recentPosts.map(post => {
    const fullTitle = `${post.label} ${post.title}`;
    const postUrl = `${baseUrl}/${post.path}`;

    return `
  <entry>
    <title>${fullTitle}</title>
    <link href="${postUrl}"/>
    <id>${postUrl}</id>
    <published>${formatDate(post.date)}</published>
    <updated>${formatDate(post.updated)}</updated>
    <content type="html"><![CDATA[${post.content}]]></content>
    <summary type="html"><![CDATA[${post.summary}]]></summary>
  </entry>`;
  }).join('\n');

  // 找到 generator 标签后的位置插入
  let updatedAtom;

  const generatorMatch = atomContent.match(/<generator[^>]*>.*?<\/generator>\n/);
  if (generatorMatch) {
    updatedAtom = atomContent.replace(
      /<generator[^>]*>.*?<\/generator>\n/,
      generatorMatch[0] + newEntries + '\n'
    );
  } else {
    // 在 </feed> 前插入
    updatedAtom = atomContent.replace('</feed>', newEntries + '\n</feed>');
  }

  // 更新 feed 的 updated 时间
  updatedAtom = updatedAtom.replace(
    /<updated>.*?<\/updated>/,
    `<updated>${formatDate(new Date())}</updated>`
  );

  fs.writeFileSync(atomPath, updatedAtom);
  hexo.log.info(`✅ RSS 已合并 ${recentPosts.length} 篇思考/读书/笔记文章（含完整内容）`);
}, 20);