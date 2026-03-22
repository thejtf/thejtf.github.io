// Kindle 高亮同步脚本
// 读取 Kindle 的 My Clippings.txt 并生成读书笔记文章

const fs = require('fs');
const path = require('path');
const https = require('https');

const KINDLE_PATH = '/media/jopus/Kindle';
const CLIPPINGS_FILE = '/media/jopus/Kindle/documents/My Clippings.txt';
const READS_DIR = path.join(__dirname, '../source/_reads');

// 书籍分类映射表
// 分类标准：文学、社科、科技、艺术、实用
const BOOK_CATEGORIES = {
  // 文学：小说、诗歌、散文、戏剧、童话、古典文学
  '百年孤独': '文学',
  '包法利夫人': '文学',
  '耿济之译卡拉马佐夫兄弟': '文学',
  '紫禁城的黄昏': '文学',
  'Pride And Prejudice': '文学',
  'Pride and Prejudice': '文学',
  '重返狼群': '文学',
  'The Woman in Me': '文学',

  // 社科：历史、哲学、政治、经济、法律、社会学、心理学
  '中国历代政治得失': '社科',
  '可能性的艺术：比较政治学30讲': '社科',
  '乡下人的悲歌': '社科',
  'Hillbilly Elegy': '社科',
  'Chip War: The Fight for the World\'s Most Critical Technology': '社科',
  '金融炼金术': '社科',
  '征服市场的人：西蒙斯传': '社科',
  '工作、消费主义和新穷人': '社科',
  '阅读经典：美国大学的人文教育': '社科',
  '自由：回憶錄1954-2021': '社科',
  'The Republic': '社科',
  'Apology: Of Socrates to the Jury': '社科',
  'Elon Musk': '社科',

  // 实用：生活、健身、理财、成长、工具书
  '梁宁·产品思维30讲': '实用',
  'Mindset': '实用',
  'Why Has Nobody Told Me This Before?': '实用',
};

// 书籍标签映射表
// 标签标准：经典、必读、泛读、参考
const BOOK_TAGS = {
  // 经典（值得反复读的传世之作）
  '百年孤独': '经典',
  '耿济之译卡拉马佐夫兄弟': '经典',
  'Pride And Prejudice': '经典',
  'The Republic': '经典',

  // 必读（对自己很重要的书）
  '中国历代政治得失': '必读',
  '可能性的艺术：比较政治学30讲': '必读',
  'Chip War: The Fight for the World\'s Most Critical Technology': '必读',
  '梁宁·产品思维30讲': '必读',
  '工作、消费主义和新穷人': '必读',

  // 参考（工具书、资料类）
  // 暂无

  // 泛读（默认，随便翻翻即可）
};

// 根据书名获取分类
function getBookCategory(bookTitle) {
  // 精确匹配
  if (BOOK_CATEGORIES[bookTitle]) {
    return BOOK_CATEGORIES[bookTitle];
  }

  // 模糊匹配（处理书名可能有细微差异的情况）
  const normalizedTitle = bookTitle.replace(/[：:]/g, '').toLowerCase();
  for (const [key, category] of Object.entries(BOOK_CATEGORIES)) {
    const normalizedKey = key.replace(/[：:]/g, '').toLowerCase();
    if (normalizedTitle.includes(normalizedKey) || normalizedKey.includes(normalizedTitle)) {
      return category;
    }
  }

  // 默认分类
  return '社科';
}

// 根据书名获取标签
function getBookTag(bookTitle) {
  // 精确匹配
  if (BOOK_TAGS[bookTitle]) {
    return BOOK_TAGS[bookTitle];
  }

  // 模糊匹配
  const normalizedTitle = bookTitle.replace(/[：:]/g, '').toLowerCase();
  for (const [key, tag] of Object.entries(BOOK_TAGS)) {
    const normalizedKey = key.replace(/[：:]/g, '').toLowerCase();
    if (normalizedTitle.includes(normalizedKey) || normalizedKey.includes(normalizedTitle)) {
      return tag;
    }
  }

  // 默认标签
  return '泛读';
}

// 搜索豆瓣图书
function searchDouban(bookTitle, author) {
  return new Promise((resolve) => {
    const query = encodeURIComponent(bookTitle);
    const url = `https://book.douban.com/j/subject_suggest?q=${query}`;

    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://book.douban.com/'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json && json.length > 0) {
            // 找最匹配的结果
            const book = json[0];
            resolve({
              id: book.id,
              title: book.title,
              author: book.author || '',
              publisher: '',
              publishedDate: ''
            });
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => {
      resolve(null);
    });
  });
}

// 获取豆瓣书籍详情（简介）
function getDoubanDetail(bookId) {
  return new Promise((resolve) => {
    const url = `https://book.douban.com/subject/${bookId}/`;

    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://book.douban.com/'
      }
    }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => { chunks.push(chunk); });
      res.on('end', () => {
        try {
          const data = Buffer.concat(chunks).toString('utf-8');

          // 提取书籍简介
          let summary = '待补充';

          // 方式1: <span property="v:summary">
          const summaryMatch1 = data.match(/<span property="v:summary"[^>]*>([\s\S]*?)<\/span>/);
          if (summaryMatch1) {
            summary = summaryMatch1[1]
              .replace(/<br\s*\/?>/g, '\n')
              .replace(/<[^>]+>/g, '')
              .replace(/&nbsp;/g, ' ')
              .trim();
          }

          // 方式2: 提取第一个 <div class="intro"> 中的所有 <p> 标签
          if (summary === '待补充') {
            const introMatch = data.match(/<div class="intro">([\s\S]*?)<\/div>/);
            if (introMatch) {
              // 提取所有 <p> 标签内容
              const pMatches = introMatch[1].match(/<p[^>]*>([\s\S]*?)<\/p>/g);
              if (pMatches && pMatches.length > 0) {
                // 提取段落内容，过滤掉短标题（如「内容简介」等）
                const paragraphs = pMatches
                  .map(p => p.replace(/<[^>]+>/g, '').trim())
                  .filter(p => {
                    // 过滤掉太短的段落、纯标点、纯标题格式
                    if (p.length < 20) return false;
                    if (p.match(/^[「」【】\[\]《》\s]+$/)) return false;
                    if (p.match(/^「[^」]+」$/)) return false;
                    if (p.match(/^★/)) return false;
                    return true;
                  })
                  .slice(0, 3)
                  .join('\n\n');
                if (paragraphs && paragraphs.length > 50) {
                  summary = paragraphs;
                }
              }
            }
          }

          resolve({ summary });
        } catch (e) {
          resolve({ summary: '待补充' });
        }
      });
    }).on('error', () => {
      resolve({ summary: '待补充' });
    });
  });
}

// 搜索 Google Books
function searchGoogleBooks(bookTitle, author) {
  return new Promise((resolve) => {
    let query = bookTitle;
    if (author) {
      query += ` ${author}`;
    }
    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&maxResults=1`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.items && json.items.length > 0) {
            const book = json.items[0].volumeInfo;
            resolve({
              summary: book.description || '待补充'
            });
          } else {
            resolve({ summary: '待补充' });
          }
        } catch (e) {
          resolve({ summary: '待补充' });
        }
      });
    }).on('error', () => {
      resolve({ summary: '待补充' });
    });
  });
}

// 综合搜索书籍信息（优先豆瓣，失败则用 Google Books）
async function searchBookInfo(bookTitle, author) {
  // 判断是否为中文书籍
  const isChinese = /[\u4e00-\u9fa5]/.test(bookTitle);

  if (isChinese) {
    // 中文书籍：先尝试豆瓣
    const doubanResult = await searchDouban(bookTitle, author);
    if (doubanResult && doubanResult.id) {
      const detail = await getDoubanDetail(doubanResult.id);
      if (detail.summary !== '待补充') {
        return detail;
      }
    }
  }

  // 回退到 Google Books
  return await searchGoogleBooks(bookTitle, author);
}

// 解析 Kindle My Clippings.txt 格式
function parseClippings(content) {
  // 按 ========== 分割每条记录
  const entries = content.split(/==========\r?\n?/).filter(e => e.trim());
  const books = {};

  entries.forEach(entry => {
    const lines = entry.split(/\r?\n/).filter(l => l.trim());

    if (lines.length < 2) return;

    // 第一行是书名（可能有 BOM）
    let bookTitle = lines[0].trim().replace(/^\uFEFF/, '');

    // 第二行是位置和时间信息
    const locationLine = lines[1] || '';

    // 解析添加时间
    let addTime = '';
    const timeMatch = locationLine.match(/添加于\s*(.+)/);
    if (timeMatch) {
      addTime = timeMatch[1].trim();
    }

    // 判断类型
    let type = 'highlight';
    if (locationLine.includes('笔记') || locationLine.includes('Note')) {
      type = 'note';
    } else if (locationLine.includes('书签') || locationLine.includes('Bookmark')) {
      type = 'bookmark';
    }

    // 高亮内容从第三行开始（索引2之后的所有非空行）
    const contentLines = [];
    for (let i = 2; i < lines.length; i++) {
      if (lines[i].trim()) {
        contentLines.push(lines[i].trim());
      }
    }
    const highlightContent = contentLines.join('\n\n');

    if (!highlightContent) return;
    if (type === 'bookmark') return; // 跳过书签

    // 按书名分组
    if (!books[bookTitle]) {
      books[bookTitle] = {
        title: bookTitle,
        highlights: []
      };
    }

    books[bookTitle].highlights.push({
      content: highlightContent,
      time: addTime,
      type: type,
      location: locationLine
    });
  });

  return books;
}

// 解析时间字符串为 Date 对象
function parseChineseDate(dateStr) {
  if (!dateStr) return new Date();

  // 匹配 "2024年7月24日星期三 下午9:44:51" 格式
  const match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (match) {
    return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
  }

  return new Date();
}

// 生成 markdown 文件内容
function generateMarkdown(book, bookInfo) {
  const highlights = book.highlights;

  // 找到最新的时间
  const latestTime = highlights.reduce((latest, h) => {
    const hTime = parseChineseDate(h.time);
    return hTime > latest ? hTime : latest;
  }, new Date(0));

  // 格式化日期
  const formatDate = (d) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  // 提取作者名（从括号中获取，去掉国籍等方括号内容）
  let author = '';
  // 先提取圆括号内容
  const parenMatch = book.title.match(/\(([^)]+)\)/);
  if (parenMatch) {
    let content = parenMatch[1];
    // 去掉方括号及其内容（如国籍）
    content = content.replace(/\[[^\]]+\]/g, '').trim();
    author = content;
  }
  // 如果没有圆括号，尝试中文括号
  if (!author) {
    const parenMatchCN = book.title.match(/（([^）]+)）/);
    if (parenMatchCN) {
      let content = parenMatchCN[1];
      content = content.replace(/【[^】]+】/g, '').trim();
      author = content;
    }
  }

  // 提取纯书名（去掉括号内的作者名，包括嵌套括号）
  let pureBookTitle = book.title;
  // 循环移除括号内容（从最内层开始，处理嵌套情况）
  let changed = true;
  while (changed) {
    let old = pureBookTitle;
    // 匹配括号内没有其他括号的情况
    pureBookTitle = pureBookTitle.replace(/\s*[\(\[（【][^\(\)\[\]（）【】]*[\)\]）】]/g, '');
    changed = old !== pureBookTitle;
  }
  // 清理残留的括号字符
  pureBookTitle = pureBookTitle.replace(/[\(\)\[\]（）【】]/g, '');
  // 清理多余空格
  pureBookTitle = pureBookTitle.replace(/\s+/g, ' ').trim();

  // 生成正文（不带 > 引用符号）
  let body = '';
  highlights.forEach((h, index) => {
    if (h.type === 'highlight') {
      body += `${h.content}\n\n`;
    } else if (h.type === 'note') {
      body += `**笔记**：${h.content}\n\n`;
    }
  });

  // 用清理后的书名生成文件名（特殊字符替换成空格，合并多个空格）
  const safeTitle = pureBookTitle.replace(/[\\/:*?"<>|'\-]/g, ' ').replace(/\s+/g, ' ').trim();

  // YAML 值需要引号包裹的情况（包含冒号等特殊字符）
  const yamlValue = (val) => {
    if (val && /[:{}[\],&*#?|\-<>=!%@`]/.test(val)) {
      return `"${val.replace(/"/g, '\\"')}"`;
    }
    return val;
  };

  // 获取书籍分类和标签
  const category = getBookCategory(pureBookTitle);
  const tag = getBookTag(pureBookTitle);

  const content = `---
title: ${yamlValue(pureBookTitle)}
date: ${formatDate(latestTime)}
categories:
  - ${category}
tags:
  - 读书
  - ${tag}
---

#### 内容简介
${bookInfo.summary}

#### 书摘

${body}
`;

  return {
    filename: `${safeTitle}.md`,
    content: content,
    title: pureBookTitle
  };
}

// 检查是否需要更新文件
function needsUpdate(filePath, newContent) {
  if (!fs.existsSync(filePath)) {
    return true;
  }

  const existingContent = fs.readFileSync(filePath, 'utf-8');

  // 比较高亮数量
  const existingCount = (existingContent.match(/> /g) || []).length;
  const newCount = (newContent.match(/> /g) || []).length;

  return newCount > existingCount;
}

// 主同步函数（异步）
async function syncKindle() {
  // 检查 Kindle 是否连接
  if (!fs.existsSync(KINDLE_PATH)) {
    console.log('Kindle 未连接');
    return false;
  }

  // 检查 My Clippings.txt 是否存在
  if (!fs.existsSync(CLIPPINGS_FILE)) {
    console.log('My Clippings.txt 文件不存在');
    return false;
  }

  // 确保 _reads 目录存在
  if (!fs.existsSync(READS_DIR)) {
    fs.mkdirSync(READS_DIR, { recursive: true });
  }

  // 读取并解析高亮
  const content = fs.readFileSync(CLIPPINGS_FILE, 'utf-8');
  const books = parseClippings(content);

  console.log(`发现 ${Object.keys(books).length} 本书的高亮\n`);

  // 生成文章
  let created = 0;
  let updated = 0;
  let skipped = 0;

  const bookList = Object.values(books);

  for (const book of bookList) {
    // 提取作者用于搜索
    let author = '';
    const parenMatch = book.title.match(/\(([^)]+)\)/);
    if (parenMatch) {
      author = parenMatch[1].replace(/\[[^\]]+\]/g, '').trim();
    }

    // 提取纯书名
    let pureBookTitle = book.title;
    let changed = true;
    while (changed) {
      let old = pureBookTitle;
      pureBookTitle = pureBookTitle.replace(/\s*[\(\[（【][^\(\)\[\]（）【】]*[\)\]）】]/g, '');
      changed = old !== pureBookTitle;
    }
    pureBookTitle = pureBookTitle.replace(/[\(\)\[\]（）【】]/g, '').replace(/\s+/g, ' ').trim();

    // 搜索书籍信息
    process.stdout.write(`正在搜索《${pureBookTitle}》的信息...`);
    const bookInfo = await searchBookInfo(pureBookTitle, author);
    const summaryPreview = bookInfo.summary !== '待补充' ? '已获取简介' : '无简介';
    console.log(` ${summaryPreview}`);

    const { filename, content: mdContent, title } = generateMarkdown(book, bookInfo);
    const filePath = path.join(READS_DIR, filename);

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, mdContent);
      created++;
      console.log(`✓ 创建: 《${title}》(${book.highlights.length} 条高亮)`);
    } else if (needsUpdate(filePath, mdContent)) {
      fs.writeFileSync(filePath, mdContent);
      updated++;
      console.log(`✓ 更新: 《${title}》`);
    } else {
      skipped++;
      console.log(`- 跳过: 《${title}》(无新内容)`);
    }
  }

  console.log(`\n同步完成: 创建 ${created} 篇，更新 ${updated} 篇，跳过 ${skipped} 篇`);
  return true;
}

// Hexo 命令注册
hexo.extend.console.register('kindle-sync', 'Sync Kindle highlights', async function(args) {
  const result = await syncKindle();
  if (!result) {
    hexo.log.info('请连接 Kindle 后重试');
  }
});

// 导出函数供外部调用
module.exports = { syncKindle, parseClippings };