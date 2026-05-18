// 书籍笔记合并模块
// 用于微信读书和 Kindle 笔记的去重合并

const fs = require('fs');
const path = require('path');

// 从 Markdown 文件中提取 frontmatter 和内容
function parseMarkdownFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  // 提取 frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    return null;
  }

  const frontmatterText = frontmatterMatch[1];
  const bodyContent = frontmatterMatch[2];

  // 解析 frontmatter
  const frontmatter = {};
  frontmatterText.split('\n').forEach(line => {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      let value = match[2];
      // 去掉引号
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      frontmatter[match[1]] = value;
    }
  });

  return {
    frontmatter,
    body: bodyContent,
    raw: content
  };
}

// 从 body 中提取划线和笔记
function parseExcerpts(body) {
  const excerpts = [];
  const notes = [];

  // 分割内容简介和书摘部分
  const bookExcerptMatch = body.match(/#### 书摘\n\n([\s\S]*)$/);
  if (!bookExcerptMatch) {
    return { excerpts, notes };
  }

  const excerptSection = bookExcerptMatch[1];

  // 解析每条内容
  // 格式：纯文本是划线，**想法**：xxx 是笔记
  const lines = excerptSection.split('\n\n').filter(l => l.trim());

  lines.forEach(line => {
    const noteMatch = line.match(/^(.+)\n\n\*\*想法\*\*：(.+)$/);
    if (noteMatch) {
      // 有想法的划线
      excerpts.push(noteMatch[1].trim());
      notes.push({
        excerpt: noteMatch[1].trim(),
        content: noteMatch[2].trim()
      });
    } else if (line.startsWith('**想法**：')) {
      // 纯想法（没有划线原文）
      notes.push({
        excerpt: '',
        content: line.replace('**想法**：', '').trim()
      });
    } else {
      // 纯划线
      excerpts.push(line.trim());
    }
  });

  return { excerpts, notes };
}

// 根据 ISBN 查找现有文件
function findFileByISBN(readsDir, isbn) {
  if (!isbn) return null;

  const files = fs.readdirSync(readsDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(readsDir, file);
    const parsed = parseMarkdownFile(filePath);
    if (parsed && parsed.frontmatter.isbn === isbn) {
      return {
        filePath,
        filename: file,
        frontmatter: parsed.frontmatter,
        excerpts: parseExcerpts(parsed.body)
      };
    }
  }

  return null;
}

// 检查两个文本是否有包含关系
function hasContainRelation(a, b) {
  const aTrim = a.trim();
  const bTrim = b.trim();
  return aTrim.includes(bTrim) || bTrim.includes(aTrim);
}

// 对 excerpts 数组去重（保留最长的版本）
function dedupeExcerpts(excerpts) {
  // 先按长度排序，长的优先
  const sorted = [...excerpts].sort((a, b) => b.length - a.length);
  const result = [];

  for (const text of sorted) {
    const trimmed = text.trim();
    if (!trimmed) continue;

    let isDuplicate = false;
    for (const existing of result) {
      if (trimmed === existing || hasContainRelation(trimmed, existing)) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      result.push(trimmed);
    }
  }

  return result;
}

// 合并划线和笔记（去重）
function mergeExcerpts(existingExcerpts, newExcerpts, existingNotes, newNotes) {
  // 先对已有内容去重
  const dedupedExisting = dedupeExcerpts(existingExcerpts);
  const allExcerpts = [...dedupedExisting, ...newExcerpts.map(e => e.trim())];

  // 再整体去重
  const excerptSet = new Set();
  const sortedAll = allExcerpts.sort((a, b) => b.length - a.length);

  for (const text of sortedAll) {
    const trimmed = text.trim();
    if (!trimmed) continue;

    let isDuplicate = false;
    for (const existing of excerptSet) {
      if (trimmed === existing || hasContainRelation(trimmed, existing)) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      excerptSet.add(trimmed);
    }
  }

  // 笔记去重（按 excerpt + content 组合判断，同时处理 excerpt 重叠）
  const noteMap = new Map();

  // 辅助函数：检查两个文本是否相同或包含关系
  const isTextOverlap = (a, b) => {
    return a === b || a.includes(b) || b.includes(a);
  };

  existingNotes.forEach(n => {
    const key = n.excerpt + '|' + n.content;
    noteMap.set(key, n);
  });

  newNotes.forEach(n => {
    // 检查是否已有相同 content 的笔记
    let isDuplicate = false;
    for (const [key, existing] of noteMap) {
      if (existing.content === n.content) {
        // content 相同，检查 excerpt 是否重叠
        if (isTextOverlap(existing.excerpt, n.excerpt)) {
          isDuplicate = true;
          // 保留更长的 excerpt
          if ((n.excerpt || '').length > (existing.excerpt || '').length) {
            noteMap.delete(key);
            noteMap.set(n.excerpt + '|' + n.content, n);
          }
          break;
        }
      }
    }

    if (!isDuplicate) {
      const key = n.excerpt + '|' + n.content;
      noteMap.set(key, n);
    }
  });

  return {
    excerpts: Array.from(excerptSet),
    notes: Array.from(noteMap.values())
  };
}

// 生成书摘内容
function generateExcerptContent(excerpts, notes) {
  const shownExcerpts = new Set();
  let content = '';

  // 先处理有想法的划线
  notes.forEach(n => {
    if (n.excerpt) {
      shownExcerpts.add(n.excerpt.trim());
      content += `${n.excerpt}\n\n**想法**：${n.content}\n\n`;
    } else {
      content += `**想法**：${n.content}\n\n`;
    }
  });

  // 再处理纯划线（检查包含关系）
  excerpts.forEach(e => {
    const text = e.trim();
    if (!text) return;

    let isDuplicate = false;

    for (const shown of shownExcerpts) {
      if (text === shown || hasContainRelation(text, shown)) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      shownExcerpts.add(text);
      content += `${e}\n\n`;
    }
  });

  return content;
}

// 合并时间（取最新的）
function mergeDates(existingDate, newDate) {
  if (!existingDate) return newDate;
  if (!newDate) return existingDate;

  const existing = new Date(existingDate);
  const newD = new Date(newDate);

  return existing > newD ? existingDate : newDate;
}

module.exports = {
  parseMarkdownFile,
  parseExcerpts,
  findFileByISBN,
  mergeExcerpts,
  mergeDates,
  generateExcerptContent,
  hasContainRelation,
  dedupeExcerpts
};