// Read 页面分页生成器
hexo.extend.generator.register('read-pagination', function(locals) {
  const fs = require('fs');
  const path = require('path');
  const readsDir = path.join(hexo.source_dir, '_reads');

  if (!fs.existsSync(readsDir)) return [];

  const files = fs.readdirSync(readsDir).filter(f => f.endsWith('.md'));

  if (files.length === 0) return [];

  const results = [];
  const perPage = 10;
  const total = files.length;
  const totalPages = Math.ceil(total / perPage);

  // 生成每一页
  for (let i = 2; i <= totalPages; i++) {
    results.push({
      path: `read/page/${i}/index.html`,
      data: {
        type: 'read'
      },
      layout: 'page'
    });
  }

  return results;
});