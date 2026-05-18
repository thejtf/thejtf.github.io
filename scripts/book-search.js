// 书籍搜索匹配模块
// 解决微信读书搜索结果不准确的问题
// 组合策略：标题匹配 + 多结果比对 + ISBN 优先 + 手动映射

const wereadApi = require('./weread-api');

// 已知易混淆书籍映射表（手动干预）
const BOOK_MAPPING = {
  // Kindle 书名 → 正确的微信读书书名
  '工作、消费主义和新穷人': '工作、消费主义和新穷人',
  '将熟悉变为陌生': '将熟悉变为陌生：与齐格蒙特·鲍曼对谈',
  // 可继续添加其他已知问题书籍
};

// 计算两个字符串的相似度（简单版本）
function similarity(a, b) {
  if (!a || !b) return 0;

  const aLower = a.toLowerCase().replace(/[：:]/g, '');
  const bLower = b.toLowerCase().replace(/[：:]/g, '');

  // 完全匹配
  if (aLower === bLower) return 100;

  // 包含关系
  if (aLower.includes(bLower) || bLower.includes(aLower)) {
    const ratio = Math.min(aLower.length, bLower.length) / Math.max(aLower.length, bLower.length);
    return 80 * ratio;
  }

  // 计算共同字符比例
  const aChars = new Set(aLower.split(''));
  const bChars = new Set(bLower.split(''));
  const common = [...aChars].filter(c => bChars.has(c)).length;
  const total = aChars.size + bChars.size;

  return Math.round(50 * (2 * common / total));
}

// 改进的书籍搜索函数
async function searchBookAccurate(bookTitle, author = '') {
  // 策略 1：检查手动映射表
  if (BOOK_MAPPING[bookTitle]) {
    const mappedTitle = BOOK_MAPPING[bookTitle];
    console.log(`  📖 使用映射表: "${bookTitle}" → "${mappedTitle}"`);
    const book = await wereadApi.searchBook(mappedTitle);
    if (book && book.bookId) {
      const bookInfo = await wereadApi.getBookInfo(book.bookId);
      return {
        summary: bookInfo.intro || '待补充',
        isbn: bookInfo.isbn || '',
        title: bookInfo.title || mappedTitle,
        confidence: 100
      };
    }
  }

  // 策略 2：搜索并获取多个结果
  try {
    // 直接调用 API 获取多个结果
    const result = await wereadApi.wereadApi('/store/search', {
      keyword: bookTitle,
      scope: 10,
      count: 5  // 获取5个结果
    });

    if (!result.results || !result.results[0] || !result.results[0].books) {
      return { summary: '待补充', isbn: '', title: bookTitle, confidence: 0 };
    }

    const books = result.results[0].books;

    // 策略 3：比对所有结果，选择最匹配的
    let bestMatch = null;
    let bestScore = 0;

    for (const b of books) {
      const info = b.bookInfo;
      const titleScore = similarity(bookTitle, info.title);

      // 作者加分（如果提供）
      let authorScore = 0;
      if (author && info.author) {
        authorScore = similarity(author, info.author) * 0.3;
      }

      const totalScore = titleScore + authorScore;

      console.log(`  📚 候选: "${info.title}" (相似度: ${totalScore.toFixed(0)}%)`);

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestMatch = info;
      }
    }

    // 策略 4：置信度阈值检查
    if (bestMatch && bestScore >= 70) {
      const bookInfo = await wereadApi.getBookInfo(bestMatch.bookId);
      console.log(`  ✅ 选中: "${bestMatch.title}" (置信度: ${bestScore.toFixed(0)}%)`);
      return {
        summary: bookInfo.intro || '待补充',
        isbn: bookInfo.isbn || '',
        title: bookInfo.title || bookTitle,
        confidence: bestScore
      };
    }

    // 策略 5：置信度过低，使用原书名
    console.log(`  ⚠️ 匹配度过低 (最高 ${bestScore.toFixed(0)}%)，保留原书名`);
    return {
      summary: '待补充',
      isbn: '',
      title: bookTitle,
      confidence: bestScore,
      needsManualCheck: true
    };

  } catch (e) {
    console.log(`  ❌ 搜索失败: ${e.message}`);
    return { summary: '待补充', isbn: '', title: bookTitle, confidence: 0 };
  }
}

module.exports = {
  searchBookAccurate,
  similarity,
  BOOK_MAPPING
};