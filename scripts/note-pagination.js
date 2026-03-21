// 生成 note 分页页面
hexo.extend.generator.register('note-pagination', function(locals) {
  const fs = require('fs');
  const path = require('path');

  const notesDir = path.join(hexo.source_dir, '_notes');

  if (!fs.existsSync(notesDir)) {
    return [];
  }

  const files = fs.readdirSync(notesDir).filter(f => f.endsWith('.md'));
  const perPage = 10;
  const total = files.length;
  const totalPages = Math.ceil(total / perPage);

  const results = [];

  // 生成分页页面 (从第2页开始，第1页是 note/index.html)
  for (let i = 2; i <= totalPages; i++) {
    results.push({
      path: `note/page/${i}/index.html`,
      data: {
        title: 'Note',
        type: 'note',
        layout: 'page'
      },
      layout: 'page'
    });
  }

  return results;
});