// hexo mark "内容" — 追加到当月思考马克，文件编号按月份公式自动计算
// 公式: 编号 = year*12 + month - 24278 （May 2026=39, Jun 2026=40, ...）

hexo.extend.console.register('mark', 'Append content to current month\'s 思考马克', {
  usage: '[content]',
  arguments: [
    { name: 'content', desc: 'Content to append' }
  ]
}, function(args) {
  const fs = require('fs');
  const path = require('path');

  const content = args._.join(' ');
  if (!content) {
    hexo.log.error('请提供内容，例如: hexo mark "你的想法"');
    return;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const pad = (n) => n.toString().padStart(2, '0');
  const isoDate = `${year}-${pad(month)}-${pad(day)}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const digits = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const tensMap = ['', '十', '二十', '三十', '四十', '五十', '六十', '七十', '八十', '九十'];
  function toChineseNumber(n) {
    if (n <= 9) return digits[n];
    if (n === 10) return '十';
    const t = Math.floor(n / 10);
    const d = n % 10;
    return tensMap[t] + (d > 0 ? digits[d] : '');
  }

  const num = year * 12 + month - 24278;
  const title = `思考马克·${toChineseNumber(num)}`;
  const filename = `${title}.md`;
  const thinksDir = path.join(hexo.source_dir, '_thinks');
  const filePath = path.join(thinksDir, filename);

  if (!fs.existsSync(thinksDir)) {
    fs.mkdirSync(thinksDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    const newFile = `---\ntitle: ${title}\ndate: ${isoDate}\ncategories:\n  - 思考马克\ntags:\n  - 思考\n  - Mark\nphotos:\ntop: false\n---\n\n### ${month}月${day}日\n\n${content}\n`;
    fs.writeFileSync(filePath, newFile);
    hexo.log.info(`创建: source/_thinks/${filename}`);
  } else {
    const existing = fs.readFileSync(filePath, 'utf-8');
    const todayHeader = `### ${month}月${day}日`;
    if (existing.includes(todayHeader)) {
      // 同一天再追加，直接在文件末尾加内容
      const appended = existing.trimEnd() + '\n\n' + content + '\n';
      fs.writeFileSync(filePath, appended);
    } else {
      // 新的一天，加日期标题
      const appended = existing.trimEnd() + '\n\n' + todayHeader + '\n\n' + content + '\n';
      fs.writeFileSync(filePath, appended);
    }
    hexo.log.info(`追加到: source/_thinks/${filename}`);
  }

  hexo.log.info(`${month}月${day}日: "${content}"`);
});