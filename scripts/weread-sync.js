// 微信读书批量同步脚本
// 用法: npx hexo weread-sync
// 从微信读书批量导入所有读书笔记

const fs = require('fs');
const path = require('path');
const exec = require('child_process').execSync;
const https = require('https');

// 从 kindle-sync.js 复用的分类配置和 AI 函数
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_API_URL = 'api.deepseek.com';

// 分类缓存文件路径
const CACHE_FILE = path.join(__dirname, '../.weread-category-cache.json');

// 书籍分类映射表
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
const BOOK_TAGS = {
  '百年孤独': '经典',
  '耿济之译卡拉马佐夫兄弟': '经典',
  'Pride And Prejudice': '经典',
  'The Republic': '经典',
  '中国历代政治得失': '必读',
  '可能性的艺术：比较政治学30讲': '必读',
  'Chip War: The Fight for the World\'s Most Critical Technology': '必读',
  '梁宁·产品思维30讲': '必读',
  '工作、消费主义和新穷人': '必读',
};

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

// AI 分类函数
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
      messages: [{ role: 'user', content: prompt }],
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
          const jsonMatch = content.match(/\{[^}]+\}/);
          if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            resolve({ category: result.category || '社科', tag: result.tag || '泛读' });
          } else {
            resolve({ category: '社科', tag: '泛读' });
          }
        } catch (e) {
          resolve({ category: '社科', tag: '泛读' });
        }
      });
    });

    req.on('error', () => resolve({ category: '社科', tag: '泛读' }));
    req.write(body);
    req.end();
  });
}

// 获取书籍分类（优先映射表，其次AI）
async function getBookCategory(bookTitle, summary) {
  if (BOOK_CATEGORIES[bookTitle]) return BOOK_CATEGORIES[bookTitle];

  const normalizedTitle = bookTitle.replace(/[：:]/g, '').toLowerCase();
  for (const [key, category] of Object.entries(BOOK_CATEGORIES)) {
    const normalizedKey = key.replace(/[：:]/g, '').toLowerCase();
    if (normalizedTitle.includes(normalizedKey) || normalizedKey.includes(normalizedTitle)) {
      return category;
    }
  }

  const cache = loadCache();
  if (cache.categories[bookTitle]) return cache.categories[bookTitle];

  console.log(`  🤖 AI分析中...`);
  const result = await aiClassifyBook(bookTitle, summary);
  cache.categories[bookTitle] = result.category;
  cache.tags[bookTitle] = result.tag;
  saveCache(cache);
  return result.category;
}

// 获取书籍标签
async function getBookTag(bookTitle, summary) {
  if (BOOK_TAGS[bookTitle]) return BOOK_TAGS[bookTitle];

  const normalizedTitle = bookTitle.replace(/[：:]/g, '').toLowerCase();
  for (const [key, tag] of Object.entries(BOOK_TAGS)) {
    const normalizedKey = key.replace(/[：:]/g, '').toLowerCase();
    if (normalizedTitle.includes(normalizedKey) || normalizedKey.includes(normalizedTitle)) {
      return tag;
    }
  }

  const cache = loadCache();
  if (cache.tags[bookTitle]) return cache.tags[bookTitle];

  const result = await aiClassifyBook(bookTitle, summary);
  cache.categories[bookTitle] = result.category;
  cache.tags[bookTitle] = result.tag;
  saveCache(cache);
  return result.tag;
}

// Hexo 命令注册
hexo.extend.console.register('weread-sync', 'Sync all notes from WeRead', async function(args) {
  const wereadApi = require('./weread-api');
  const bookMerge = require('./book-merge');

  console.log('📚 开始从微信读书同步笔记...\n');

  try {
    // 1. 获取所有有笔记的书
    console.log('📋 获取笔记本概览...');
    const notebooks = await wereadApi.getNotebooks();
    console.log(`✓ 找到 ${notebooks.length} 本有笔记的书\n`);

    if (notebooks.length === 0) {
      hexo.log.info('没有找到任何笔记');
      return;
    }

    // 2. 确保 _reads 目录存在
    const readsDir = path.join(hexo.source_dir, '_reads');
    if (!fs.existsSync(readsDir)) {
      fs.mkdirSync(readsDir, { recursive: true });
    }

    let created = 0;
    let updated = 0;
    let skipped = 0;

    // 3. 遍历每本书
    for (const notebook of notebooks) {
      const bookTitle = notebook.title;
      const bookId = notebook.bookId;

      console.log(`处理《${bookTitle}》...`);

      // 获取书籍详情
      let bookInfo;
      try {
        bookInfo = await wereadApi.getBookInfo(bookId);
      } catch (e) {
        console.log(`  ⚠️ 获取书籍详情失败，跳过`);
        skipped++;
        continue;
      }

      // 获取划线和想法
      const bookmarks = await wereadApi.getBookmarks(bookId);
      const reviews = await wereadApi.getReviews(bookId);

      // 获取分类和标签
      const category = await getBookCategory(bookTitle, bookInfo.intro);
      const tag = await getBookTag(bookTitle, bookInfo.intro);

      // 生成 Markdown
      // 格式化日期（转换为北京时间 UTC+8，使用 UTC 方法避免服务器时区影响）
      const formatDate = (d) => {
        const pad = (n) => n.toString().padStart(2, '0');
        // 使用 UTC 方法获取 UTC 时间组件，然后加8小时得到北京时间
        const beijingHour = d.getUTCHours() + 8;
        const beijingDate = new Date(d.getTime() + 8 * 3600 * 1000);
        return `${beijingDate.getUTCFullYear()}-${pad(beijingDate.getUTCMonth()+1)}-${pad(beijingDate.getUTCDate())} ${pad(beijingDate.getUTCHours())}:${pad(beijingDate.getUTCMinutes())}:${pad(beijingDate.getUTCSeconds())}`;
      };

      // 取最新的时间（同时考虑 bookmarks 和 reviews）
      let latestTime = new Date();
      const bookmarkMaxTime = bookmarks.length > 0 ? Math.max(...bookmarks.map(b => b.createTime || 0)) : 0;
      const reviewMaxTime = reviews.length > 0 ? Math.max(...reviews.map(r => r.createTime || 0)) : 0;
      const maxTime = Math.max(bookmarkMaxTime, reviewMaxTime);
      if (maxTime > 0) latestTime = new Date(maxTime * 1000);

      const yamlValue = (val) => {
        if (val && /[:{}[\],&*#?|\-<>=!%@`]/.test(val)) {
          return `"${val.replace(/"/g, '\\"')}"`;
        }
        return val;
      };

      // 合并处理：先收集有想法的划线，再添加纯划线
      // 用 Set 记录已显示的划线文本（用于去重）
      const shownTexts = new Set();
      let excerptsContent = '';

      // 先处理有想法的划线（显示划线+想法）
      reviews.forEach(r => {
        if (r.content) {
          if (r.abstract) {
            // 记录这条划线已显示
            shownTexts.add(r.abstract.trim());
            excerptsContent += `${r.abstract}\n\n**想法**：${r.content}\n\n`;
          } else {
            // 没有划线原文，直接显示想法
            excerptsContent += `**想法**：${r.content}\n\n`;
          }
        }
      });

      // 再处理纯划线（没有想法的）
      bookmarks.forEach(b => {
        const text = b.markText.trim();
        if (!shownTexts.has(text)) {
          excerptsContent += `${text}\n\n`;
        }
      });

      const mdContent = `---
title: ${yamlValue(bookTitle)}
isbn: ${bookInfo.isbn || ''}
date: ${formatDate(latestTime)}
tags:
  - 读书
  - ${tag}
categories:
  - ${category}
---

#### 内容简介

${bookInfo.intro || '待补充'}

#### 书摘

${excerptsContent || ''}
`;

      // 保存文件
      const safeTitle = bookTitle.replace(/[\\/:*?"<>|'\-]/g, ' ').replace(/\s+/g, ' ').trim();
      const filename = `${safeTitle}.md`;
      const filePath = path.join(readsDir, filename);

      // 检查是否已有相同 ISBN 的文件（合并去重）
      const existingFile = bookMerge.findFileByISBN(readsDir, bookInfo.isbn);

      if (existingFile) {
        // 合并去重
        const newExcerpts = bookmarks.map(b => b.markText.trim());
        const newNotes = reviews.filter(r => r.content).map(r => ({
          excerpt: r.abstract ? r.abstract.trim() : '',
          content: r.content.trim()
        }));

        const merged = bookMerge.mergeExcerpts(
          existingFile.excerpts.excerpts,
          newExcerpts,
          existingFile.excerpts.notes,
          newNotes
        );

        const mergedExcerptContent = bookMerge.generateExcerptContent(merged.excerpts, merged.notes);
        const mergedDate = bookMerge.mergeDates(existingFile.frontmatter.date, formatDate(latestTime));

        const mergedMdContent = `---
title: ${yamlValue(existingFile.frontmatter.title || bookTitle)}
isbn: ${bookInfo.isbn || ''}
date: ${mergedDate}
tags:
  - 读书
  - ${tag}
categories:
  - ${category}
---

#### 内容简介

${bookInfo.intro || existingFile.frontmatter.intro || '待补充'}

#### 书摘

${mergedExcerptContent || ''}
`;

        // 比较内容是否有变化
        if (existingFile.raw !== mergedMdContent) {
          fs.writeFileSync(existingFile.filePath, mergedMdContent);
          updated++;
          console.log(`  ✓ 合并更新: ${existingFile.filename} (${merged.excerpts.length} 条划线, ${merged.notes.length} 条笔记)`);
        } else {
          skipped++;
          console.log(`  - 跳过: 无新内容`);
        }
      } else {
        // 新书籍，直接创建
        const isNew = !fs.existsSync(filePath);
        const existingContent = isNew ? '' : fs.readFileSync(filePath, 'utf-8');
        const hasChanges = isNew || existingContent !== mdContent;

        if (isNew) {
          fs.writeFileSync(filePath, mdContent);
          created++;
          console.log(`  ✓ 创建: ${bookmarks.length} 条划线, ${reviews.length} 条想法 (${category}/${tag})`);
        } else if (hasChanges) {
          fs.writeFileSync(filePath, mdContent);
          updated++;
          console.log(`  ✓ 更新: 内容有变化`);
        } else {
          skipped++;
          console.log(`  - 跳过: 无新内容`);
        }
      }
    }

    console.log(`\n同步完成: 创建 ${created} 篇，更新 ${updated} 篇，跳过 ${skipped} 篇`);

    // 4. Git commit 和 push
    if (created > 0 || updated > 0) {
      console.log('\n正在提交到 git...');
      try {
        exec('git add "source/_reads/"', { cwd: hexo.base_dir, stdio: 'inherit' });
        exec(`git commit -m "Sync notes from WeRead: ${created} created, ${updated} updated"`, { cwd: hexo.base_dir, stdio: 'inherit' });
        exec('git push origin source', { cwd: hexo.base_dir, stdio: 'inherit' });
        console.log('✅ 已提交并推送到 source 分支');
      } catch (e) {
        console.log('⚠️ Git 操作失败，请手动提交');
      }
    } else {
      console.log('无新内容，跳过提交');
    }

  } catch (e) {
    hexo.log.error(`同步失败: ${e.message}`);
    hexo.log.info('请检查 WEREAD_API_KEY 环境变量是否正确设置');
  }
});