// 书籍搜索匹配模块
// 解决微信读书搜索结果不准确的问题
// 核心策略：ISBN 优先匹配（唯一标识） + 书名相似度验证

const wereadApi = require('./weread-api');

// ISBN 映射表（手动维护已知书籍的 ISBN）
// ISBN 是唯一标识，搜索精确度 100%
const ISBN_MAPPING = {
  // Kindle 书名 → 微信读书 ISBN
  // 示例：'工作、消费主义和新穷人': '9787559806789',
  '百年孤独': '9787573510921',
  '中国历代政治得失': '9787522506859',
  '可能的可能性': '9787542674262',
  // 添加更多已知书籍...
};

// 不在微信读书上的书籍（标记为 null）
const NOT_ON_WEREAD = {
  '工作、消费主义和新穷人': true,  // 此书不在微信读书上
};

// 计算两个字符串的相似度
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
// 参数：bookTitle (Kindle 原书名), isbn (可选), author (可选)
async function searchBookAccurate(bookTitle, author = '', isbn = '') {
  // 策略 1：检查是否标记为"不在微信读书"
  if (NOT_ON_WEREAD[bookTitle]) {
    console.log(`  📖 已知信息: "${bookTitle}" 不在微信读书上`);
    return {
      summary: '待补充（此书不在微信读书）',
      isbn: '',
      title: bookTitle,
      confidence: 100,
      notOnWeRead: true
    };
  }

  // 等略 2：ISBN 优先匹配（最精确）
  const searchISBN = isbn || ISBN_MAPPING[bookTitle];
  if (searchISBN) {
    console.log(`  🔍 用 ISBN 搜索: ${searchISBN}`);
    try {
      const result = await wereadApi.wereadApi('/store/search', {
        keyword: searchISBN,
        scope: 10,
        count: 1
      });

      if (result.results && result.results[0] && result.results[0].books) {
        const book = result.results[0].books[0].bookInfo;
        const bookInfo = await wereadApi.getBookInfo(book.bookId);

        // ISBN 匹配，置信度 100%
        console.log(`  ✅ ISBN 匹配: "${bookInfo.title}"`);
        return {
          summary: bookInfo.intro || '待补充',
          isbn: bookInfo.isbn || searchISBN,
          title: bookInfo.title || bookTitle,
          confidence: 100
        };
      }
    } catch (e) {
      console.log(`  ⚠️ ISBN 搜索失败: ${e.message}`);
    }
  }

  // 等略 3：书名搜索 + 多结果比对
  console.log(`  🔍 用书名搜索: "${bookTitle}"`);
  try {
    const result = await wereadApi.wereadApi('/store/search', {
      keyword: bookTitle,
      scope: 10,
      count: 5
    });

    if (!result.results || !result.results[0] || !result.results[0].books) {
      console.log(`  ❌ 无搜索结果`);
      return { summary: '待补充', isbn: '', title: bookTitle, confidence: 0 };
    }

    const books = result.results[0].books;

    // 比对所有结果，选择最匹配的
    let bestMatch = null;
    let bestScore = 0;

    for (const b of books) {
      const info = b.bookInfo;
      const titleScore = similarity(bookTitle, info.title);

      // 作者加分
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

    // 等略 4：置信度阈值检查（>=70 才接受）
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

    // 等略 5：置信度过低，保留原书名
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

// 添加/更新 ISBN 映射（供外部调用）
function addISBNMapping(bookTitle, isbn) {
  ISBN_MAPPING[bookTitle] = isbn;
}

// 标记书籍不在微信读书
function markNotOnWeRead(bookTitle) {
  NOT_ON_WEREAD[bookTitle] = true;
}

module.exports = {
  searchBookAccurate,
  similarity,
  ISBN_MAPPING,
  NOT_ON_WEREAD,
  addISBNMapping,
  markNotOnWeRead
};