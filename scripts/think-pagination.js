// 生成 think 分页页面
hexo.extend.generator.register('think-pagination', function(locals) {
  const fs = require('fs');
  const path = require('path');

  const thinksDir = path.join(hexo.source_dir, '_thinks');

  if (!fs.existsSync(thinksDir)) {
    return [];
  }

  const files = fs.readdirSync(thinksDir).filter(f => f.endsWith('.md'));
  const perPage = 10;
  const total = files.length;
  const totalPages = Math.ceil(total / perPage);

  const results = [];

  // 生成分页页面 (从第2页开始，第1页是 think/index.html)
  for (let i = 2; i <= totalPages; i++) {
    results.push({
      path: `think/page/${i}/index.html`,
      data: {
        title: 'Think',
        type: 'think',
        layout: 'page'
      },
      layout: 'page'
    });
  }

  return results;
});