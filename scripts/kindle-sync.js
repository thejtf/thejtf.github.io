// Kindle 高亮同步脚本
// 读取 Kindle 的 My Clippings.txt 并生成读书笔记文章

const fs = require('fs');
const path = require('path');
const https = require('https');
const { cleanText, cleanTitle } = require('./book-merge');

const KINDLE_PATH = '/media/jopus/Kindle';
const CLIPPINGS_FILE = '/media/jopus/Kindle/documents/My Clippings.txt';
const READS_DIR = path.join(__dirname, '../source/_reads');

// DeepSeek API 配置
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_API_URL = 'api.deepseek.com';

// 分类缓存文件路径
const CACHE_FILE = path.join(__dirname, '../.weread-category-cache.json');

// 加载分类缓存
function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    }
  } catch (e) {}
  return { categories: {}, tags: {} };
}

// 保存分类缓存
function saveCache(cache) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (e) {}
}

// 调用 DeepSeek API 进行分类
function aiClassifyBook(bookTitle, summary) {
  return new Promise((resolve) => {
    const prompt = `你是一个图书分类专家。请根据以下书籍信息，判断其分类和阅读价值。

书名：${bookTitle}
简介：${summary || '无'}

分类标准（只能选一个）：
- 文学：小说、诗歌、散文、戏剧、童话、古典文学
- 社科：历史、哲学、政治、经济、法律、社会学、心理学
- 科技：数理化、生物、医学、计算机、工程、科普
- 艺术：绘画、音乐、摄影、设计、建筑、影视
- 实用：生活、健身、烹饪、育儿、理财、旅行、工具书

标签标准（只能选一个）：
- 经典：值得反复读的传世之作
- 必读：对自己很重要的书
- 泛读：随便翻翻即可
- 参考：工具书、资料类，按需查阅

请只返回JSON格式，不要其他内容：
{"category": "分类", "tag": "标签"}`;

    const body = JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 100
    });

    const options = {
      hostname: DEEPSEEK_API_URL,
      port: 443,
      path: '/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const content = json.choices[0].message.content.trim();
          // 提取JSON
          const jsonMatch = content.match(/\{[^}]+\}/);
          if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            resolve({
              category: result.category || '社科',
              tag: result.tag || '泛读'
            });
          } else {
            resolve({ category: '社科', tag: '泛读' });
          }
        } catch (e) {
          resolve({ category: '社科', tag: '泛读' });
        }
      });
    });

    req.on('error', () => {
      resolve({ category: '社科', tag: '泛读' });
    });

    req.write(body);
    req.end();
  });
}

// 书籍分类映射表（手动维护的优先级最高）
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

// 根据书名获取分类（优先映射表，其次AI）
async function getBookCategoryAsync(bookTitle, summary) {
  // 精确匹配映射表
  if (BOOK_CATEGORIES[bookTitle]) {
    return BOOK_CATEGORIES[bookTitle];
  }

  // 模糊匹配映射表
  const normalizedTitle = bookTitle.replace(/[：:]/g, '').toLowerCase();
  for (const [key, category] of Object.entries(BOOK_CATEGORIES)) {
    const normalizedKey = key.replace(/[：:]/g, '').toLowerCase();
    if (normalizedTitle.includes(normalizedKey) || normalizedKey.includes(normalizedTitle)) {
      return category;
    }
  }

  // 检查缓存
  const cache = loadCache();
  if (cache.categories[bookTitle]) {
    return cache.categories[bookTitle];
  }

  // 调用 AI 分类
  console.log(`  🤖 AI分析中...`);
  const result = await aiClassifyBook(bookTitle, summary);

  // 保存到缓存
  cache.categories[bookTitle] = result.category;
  cache.tags[bookTitle] = result.tag;
  saveCache(cache);

  return result.category;
}

// 根据书名获取标签（优先映射表，其次AI）
async function getBookTagAsync(bookTitle, summary) {
  // 精确匹配映射表
  if (BOOK_TAGS[bookTitle]) {
    return BOOK_TAGS[bookTitle];
  }

  // 模糊匹配映射表
  const normalizedTitle = bookTitle.replace(/[：:]/g, '').toLowerCase();
  for (const [key, tag] of Object.entries(BOOK_TAGS)) {
    const normalizedKey = key.replace(/[：:]/g, '').toLowerCase();
    if (normalizedTitle.includes(normalizedKey) || normalizedKey.includes(normalizedTitle)) {
      return tag;
    }
  }

  // 检查缓存
  const cache = loadCache();
  if (cache.tags[bookTitle]) {
    return cache.tags[bookTitle];
  }

  // 如果分类也没在缓存里，调用AI（分类函数会同时保存标签）
  const result = await aiClassifyBook(bookTitle, summary);
  cache.categories[bookTitle] = result.category;
  cache.tags[bookTitle] = result.tag;
  saveCache(cache);

  return result.tag;
}

// 使用精确搜索模块匹配书籍信息
async function searchBookInfo(bookTitle, author) {
  const { searchBookAccurate } = require('./book-search');

  try {
    const result = await searchBookAccurate(bookTitle, author);

    // 如果匹配置信度过低，标记需要人工检查
    if (result.needsManualCheck) {
      console.log(`  ⚠️ 建议: 请确认书籍 "${bookTitle}" 是否正确识别`);
    }

    return result;
  } catch (e) {
    console.log(`  ❌ 搜索失败: ${e.message}`);
    return { summary: '待补充', isbn: '', title: bookTitle };
  }
}

// 解析 Kindle My Clippings.txt 格式
function parseClippings(content) {
  // 按 ========== 分割每条记录
  const entries = content.split(/==========\r?\n?/).filter(e => e.trim());
  const books = {};

  entries.forEach(entry => {
    const lines = entry.split(/\r?\n/).filter(l => l.trim());

    if (lines.length < 2) return;

    // 第一行是书名（可能有 BOM），清理括号版本信息和冒号副标题
    let bookTitle = cleanTitle(lines[0].trim().replace(/^﻿/, ''));

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
    const highlightContent = cleanText(contentLines.join('\n\n'));

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

  // 匹配 "2024年7月24日星期三 下午9:44:51" 或 "2024年7月24日星期三 上午9:44:51" 格式
  const fullMatch = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日[^ ]*\s*(上午|下午)?(\d{1,2}):(\d{2}):?(\d{2})?/);
  if (fullMatch) {
    const year = parseInt(fullMatch[1]);
    const month = parseInt(fullMatch[2]) - 1;
    const day = parseInt(fullMatch[3]);
    let hour = parseInt(fullMatch[5]);
    const minute = parseInt(fullMatch[6]);
    const second = fullMatch[7] ? parseInt(fullMatch[7]) : 0;

    // 处理下午时间（+12小时，除非是12点）
    if (fullMatch[4] === '下午' && hour !== 12) {
      hour += 12;
    }
    // 处理上午12点（凌晨）
    if (fullMatch[4] === '上午' && hour === 12) {
      hour = 0;
    }

    return new Date(year, month, day, hour, minute, second);
  }

  // 兼容只匹配年月日的情况
  const match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (match) {
    return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
  }

  return new Date();
}

// 生成 markdown 文件内容
async function generateMarkdown(book, bookInfo) {
  const highlights = book.highlights;

  // 找到最新的时间
  const latestTime = highlights.reduce((latest, h) => {
    const hTime = parseChineseDate(h.time);
    return hTime > latest ? hTime : latest;
  }, new Date(0));

  // 格式化日期（格式：2018-12-17 22:14:34）
  const formatDate = (d) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
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

  // 使用微信读书的标准书名（如果有）
  const standardTitle = bookInfo.title || pureBookTitle;

  // 生成正文（不带 > 引用符号）
  let body = '';
  highlights.forEach((h, index) => {
    if (h.type === 'highlight') {
      body += `${h.content}\n\n`;
    } else if (h.type === 'note') {
      body += `**笔记**：${h.content}\n\n`;
    }
  });

  // 用标准书名生成文件名
  const safeTitle = standardTitle.replace(/[\\/:*?"<>|'\-]/g, ' ').replace(/\s+/g, ' ').trim();

  // YAML 值需要引号包裹的情况（包含冒号等特殊字符）
  const yamlValue = (val) => {
    if (val && /[:{}[\],&*#?|\-<>=!%@`]/.test(val)) {
      return `"${val.replace(/"/g, '\\"')}"`;
    }
    return val;
  };

  // 获取书籍分类和标签（异步，可能调用AI）
  const category = await getBookCategoryAsync(standardTitle, bookInfo.summary);
  const tag = await getBookTagAsync(standardTitle, bookInfo.summary);

  const content = `---
title: ${yamlValue(standardTitle)}
isbn: ${bookInfo.isbn || ''}
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
    title: standardTitle,
    isbn: bookInfo.isbn || '',
    excerpts: highlights.filter(h => h.type === 'highlight').map(h => h.content.trim()),
    notes: highlights.filter(h => h.type === 'note').map(h => ({ excerpt: '', content: h.content.trim() }))
  };
}

// 主同步函数（异步）
async function syncKindle() {
  const bookMerge = require('./book-merge');

  // 检查 Kindle 是否连接
  if (!fs.existsSync(KINDLE_PATH)) {
    console.log('Kindle 未连接');
    return { success: false };
  }

  // 检查 My Clippings.txt 是否存在
  if (!fs.existsSync(CLIPPINGS_FILE)) {
    console.log('My Clippings.txt 文件不存在');
    return { success: false };
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

    const { filename, content: mdContent, title, isbn, excerpts, notes } = await generateMarkdown(book, bookInfo);
    const filePath = path.join(READS_DIR, filename);

    // 检查是否已有相同书籍的文件（优先 ISBN，其次书名）
    const existingFile = bookMerge.findExistingFile(READS_DIR, isbn, title);

    if (existingFile) {
      // 合并去重
      const merged = bookMerge.mergeExcerpts(
        existingFile.excerpts.excerpts,
        excerpts,
        existingFile.excerpts.notes,
        notes
      );

      const mergedExcerptContent = bookMerge.generateExcerptContent(merged.excerpts, merged.notes);

      // 格式化日期
      const formatDate = (d) => {
        const pad = (n) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      };

      const latestTime = book.highlights.reduce((latest, h) => {
        const hTime = parseChineseDate(h.time);
        return hTime > latest ? hTime : latest;
      }, new Date(0));

      const mergedDate = bookMerge.mergeDates(existingFile.frontmatter.date, formatDate(latestTime));

      // 获取分类和标签
      const category = await getBookCategoryAsync(title, bookInfo.summary);
      const tag = await getBookTagAsync(title, bookInfo.summary);

      const yamlValue = (val) => {
        if (val && /[:{}[\],&*#?|\-<>=!%@`]/.test(val)) {
          return `"${val.replace(/"/g, '\\"')}"`;
        }
        return val;
      };

      const mergedMdContent = `---
title: ${yamlValue(existingFile.frontmatter.title || title)}
isbn: ${isbn}
date: ${mergedDate}
categories:
  - ${category}
tags:
  - 读书
  - ${tag}
---

#### 内容简介
${bookInfo.summary || existingFile.frontmatter.intro || '待补充'}

#### 书摘

${mergedExcerptContent || ''}
`;

      // 比较内容是否有变化
      if (existingFile.raw !== mergedMdContent) {
        fs.writeFileSync(existingFile.filePath, mergedMdContent);
        updated++;
        console.log(`✓ 合并更新: 《${existingFile.frontmatter.title}》(${merged.excerpts.length} 条划线, ${merged.notes.length} 条笔记)`);
      } else {
        skipped++;
        console.log(`- 跳过: 《${title}》(无新内容)`);
      }
    } else {
      // 新书籍，直接创建
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, mdContent);
        created++;
        console.log(`✓ 创建: 《${title}》(${book.highlights.length} 条高亮)`);
      } else {
        // 文件存在但没有 ISBN 匹配，检查内容更新
        const existingContent = fs.readFileSync(filePath, 'utf-8');
        if (existingContent !== mdContent) {
          fs.writeFileSync(filePath, mdContent);
          updated++;
          console.log(`✓ 更新: 《${title}》`);
        } else {
          skipped++;
          console.log(`- 跳过: 《${title}》(无新内容)`);
        }
      }
    }
  }

  console.log(`\n同步完成: 创建 ${created} 篇，更新 ${updated} 篇，跳过 ${skipped} 篇`);
  return { success: true, created, updated };
}

// Hexo 命令注册
hexo.extend.console.register('kindle-sync', 'Sync Kindle highlights', async function(args) {
  const result = await syncKindle();
  if (!result || !result.success) {
    hexo.log.info('请连接 Kindle 后重试');
    return;
  }

  // 如果有创建或更新，自动部署
  if (result.created > 0 || result.updated > 0) {
    hexo.log.info('检测到新内容，开始自动部署...');

    // 清理并重新生成
    await hexo.call('clean');
    await hexo.call('generate');

    // 部署
    await hexo.call('deploy');
    hexo.log.info('自动部署完成！');
  } else {
    hexo.log.info('无新内容，跳过部署');
  }
});

// 导出函数供外部调用
module.exports = { syncKindle, parseClippings };