// 微信读书 API 模块
// 调用微信读书 Agent API Gateway 获取书籍信息和笔记

const https = require('https');

const WEREAD_API_URL = 'i.weread.qq.com';
const WEREAD_API_KEY = process.env.WEREAD_API_KEY || '';
const SKILL_VERSION = '1.0.3';

// 调用微信读书 Gateway
function wereadApi(apiName, params = {}) {
  return new Promise((resolve, reject) => {
    if (!WEREAD_API_KEY) {
      reject(new Error('缺少 WEREAD_API_KEY 环境变量，请在 .env 中配置后再运行同步'));
      return;
    }
    const body = JSON.stringify({
      api_name: apiName,
      skill_version: SKILL_VERSION,
      ...params
    });

    const options = {
      hostname: WEREAD_API_URL,
      port: 443,
      path: '/api/agent/gateway',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WEREAD_API_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.errcode && json.errcode !== 0) {
            reject(new Error(json.errmsg || 'API Error'));
          } else {
            resolve(json);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(body);
    req.end();
  });
}

// 搜索书籍获取 bookId
async function searchBook(keyword) {
  // 注意：scope=10 有 bug，用 scope=1 只搜索书名更准确
  const result = await wereadApi('/store/search', { keyword, scope: 1, count: 5 });

  if (!result.results || result.results.length === 0) {
    return null;
  }

  const books = result.results[0].books || [];
  if (books.length === 0) {
    return null;
  }

  // 返回第一个匹配结果
  const book = books[0].bookInfo;
  return {
    bookId: book.bookId,
    title: book.title,
    author: book.author,
    cover: book.cover,
    intro: book.intro
  };
}

// 获取书籍详情
async function getBookInfo(bookId) {
  return wereadApi('/book/info', { bookId });
}

// 获取划线内容
async function getBookmarks(bookId) {
  const result = await wereadApi('/book/bookmarklist', { bookId });

  // 按章节分组
  const chapters = result.chapters || [];
  const chapterMap = {};
  chapters.forEach(c => {
    chapterMap[c.chapterUid] = c.title;
  });

  const bookmarks = result.updated || [];
  return bookmarks.map(b => ({
    bookmarkId: b.bookmarkId,
    chapterUid: b.chapterUid,
    chapterTitle: chapterMap[b.chapterUid] || '',
    markText: b.markText,
    createTime: b.createTime,
    range: b.range,
    colorStyle: b.colorStyle
  }));
}

// 获取想法/点评
async function getReviews(bookId) {
  // 注意：API 参数名是 bookid（小写），不是 bookId
  const result = await wereadApi('/review/list/mine', { bookid: bookId, count: 100 });

  const reviews = result.reviews || [];
  return reviews.map(r => ({
    reviewId: r.review.reviewId,
    content: r.review.content,
    abstract: r.review.abstract || '',  // 划线原文
    createTime: r.review.createTime,
    star: r.review.star,
    chapterName: r.review.chapterName,
    isFinish: r.review.isFinish
  }));
}

// 获取笔记本概览（所有有笔记的书）
async function getNotebooks() {
  let allBooks = [];
  let hasMore = 1;
  let lastSort = 0;

  while (hasMore === 1) {
    const params = { count: 50 };
    if (lastSort > 0) {
      params.lastSort = lastSort;
    }

    const result = await wereadApi('/user/notebooks', params);

    if (result.books && result.books.length > 0) {
      allBooks = allBooks.concat(result.books.map(b => ({
        bookId: b.bookId,
        title: b.book.title,
        author: b.book.author,
        cover: b.book.cover,
        reviewCount: b.reviewCount,
        noteCount: b.noteCount,
        bookmarkCount: b.bookmarkCount,
        readingProgress: b.readingProgress,
        markedStatus: b.markedStatus,
        sort: b.sort
      })));

      lastSort = result.books[result.books.length - 1].sort;
      hasMore = result.hasMore;
    } else {
      break;
    }
  }

  return allBooks;
}

// 格式化时间戳为日期字符串
function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  const d = new Date(timestamp * 1000);
  const pad = (n) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// 导出函数
module.exports = {
  wereadApi,
  searchBook,
  getBookInfo,
  getBookmarks,
  getReviews,
  getNotebooks,
  formatTimestamp
};