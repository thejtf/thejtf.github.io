// hexo mark 命令 - 智能追加思考记录
// 用法: npx hexo mark "你的思考内容"
// 自动根据当前月份判断追加到哪篇文章，如需要则创建新文章

hexo.extend.console.register('mark', 'Add a thinking mark entry', {
  usage: '[content]',
  arguments: [
    { name: 'content', desc: 'Thinking content to add' }
  ]
}, function(args) {
  const fs = require('fs');
  const path = require('path');

  const content = args._.join(' ');
  if (!content) {
    hexo.log.error('请输入思考内容，例如: npx hexo mark "今天学到了新东西"');
    return;
  }

  const thinksDir = path.join(hexo.source_dir, '_thinks');

  // 确保 _thinks 目录存在
  if (!fs.existsSync(thinksDir)) {
    fs.mkdirSync(thinksDir, { recursive: true });
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentDay = now.getDate();
  const monthNames = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

  // 读取所有思考马克文章
  const files = fs.readdirSync(thinksDir).filter(f => f.endsWith('.md') && f.startsWith('思考马克·'));

  // 中文数字映射
  const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十',
    '三十一', '三十二', '三十三', '三十四', '三十五', '三十六', '三十七', '三十八', '三十九', '四十',
    '四十一', '四十二', '四十三', '四十四', '四十五', '四十六', '四十七', '四十八', '四十九', '五十'
  ];

  // 从文件名提取编号
  function extractNumber(filename) {
    const match = filename.match(/思考马克·(.+)\.md$/);
    if (match) {
      const numStr = match[1];
      return chineseNums.indexOf(numStr);
    }
    return 0;
  }

  // 生成文件名
  function generateFilename(num) {
    return `思考马克·${chineseNums[num]}.md`;
  }

  // 检查文章是否包含当前月份
  function containsCurrentMonth(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const monthPattern = new RegExp(`${currentYear}年${monthNames[currentMonth - 1]}月记录`);
    const monthPattern2 = new RegExp(`### ${currentMonth}月\\d+日`);
    return monthPattern.test(fileContent) || monthPattern2.test(fileContent);
  }

  // 获取当前月份标题
  function getMonthTitle() {
    return `${currentYear}年${monthNames[currentMonth - 1]}月记录`;
  }

  // 创建新文章
  function createNewArticle(num) {
    const formatDate = (d) => {
      const pad = (n) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const monthTitle = getMonthTitle();
    const filename = generateFilename(num);
    const filePath = path.join(thinksDir, filename);

    // 检查文件是否已存在
    if (fs.existsSync(filePath)) {
      hexo.log.warn(`⚠️  文件已存在: ${filename}，将追加内容而非覆盖`);
      return appendToArticle(filePath);
    }

    const articleContent = `---
title: 思考马克·${chineseNums[num]}
date: ${formatDate(now)}
categories:
  - 思考马克
tags:
  - 思考
  - Mark
---

# 思考马克·${chineseNums[num]}

## **${monthTitle}**

### ${currentMonth}月${currentDay}日

${content}
`;

    fs.writeFileSync(filePath, articleContent);

    // 验证创建的文件格式
    const createdContent = fs.readFileSync(filePath, 'utf-8');
    const expectedTitle = `# 思考马克·${chineseNums[num]}`;
    const expectedMonth = `## **${monthTitle}**`;
    const expectedDate = `### ${currentMonth}月${currentDay}日`;

    if (!createdContent.includes(expectedTitle)) {
      hexo.log.error(`❌ 创建失败: 文章标题不正确`);
      return null;
    }
    if (!createdContent.includes(expectedMonth)) {
      hexo.log.error(`❌ 创建失败: 月份标题不正确`);
      return null;
    }
    if (!createdContent.includes(expectedDate)) {
      hexo.log.error(`❌ 创建失败: 日期标题不正确`);
      return null;
    }

    hexo.log.info(`✅ 格式验证通过`);
    return filename;
  }

  // 追加内容到现有文章
  function appendToArticle(filePath) {
    let fileContent = fs.readFileSync(filePath, 'utf-8');

    // 检查是否已有今天的记录 (使用三级标题格式 ### 3月27日)
    const todayPattern = new RegExp(`### ${currentMonth}月${currentDay}日`);

    if (todayPattern.test(fileContent)) {
      // 找到文件中今天日期的最后一次出现位置，在其内容块末尾追加
      const lines = fileContent.split('\n');
      let lastTodayIndex = -1;

      // 找到最后一个今天日期的位置
      for (let i = lines.length - 1; i >= 0; i--) {
        if (todayPattern.test(lines[i])) {
          lastTodayIndex = i;
          break;
        }
      }

      if (lastTodayIndex >= 0) {
        // 从今天日期开始，找到下一个日期条目或文件末尾
        let insertIndex = lines.length;

        for (let i = lastTodayIndex + 1; i < lines.length; i++) {
          // 检查是否是新的日期条目（如 "### 3月28日"）
          if (lines[i].match(/^### \d+月\d+日/)) {
            insertIndex = i;
            break;
          }
        }

        // 在插入位置前添加新内容
        // 确保格式正确：内容前空一行，内容后空一行
        const newLines = [
          '',
          content,
          ''
        ];

        lines.splice(insertIndex, 0, ...newLines);
        fileContent = lines.join('\n');
        fs.writeFileSync(filePath, fileContent);
        return path.basename(filePath);
      }
    }

    // 没有今天的记录，添加新的日期条目
    // 先检查是否有当月标题
    const monthTitle = getMonthTitle();
    const monthTitlePattern = new RegExp(`##.*${monthTitle}`);

    if (!monthTitlePattern.test(fileContent)) {
      // 添加新的月份标题
      fileContent += `\n## **${monthTitle}**\n`;
    }

    // 添加日期和内容（使用三级标题格式）
    fileContent += `\n### ${currentMonth}月${currentDay}日\n\n${content}\n`;

    fs.writeFileSync(filePath, fileContent);
    return path.basename(filePath);
  }

  // 主逻辑
  let targetFile = null;
  let isNewArticle = false;

  if (files.length === 0) {
    // 没有任何文章，创建第一篇
    targetFile = createNewArticle(1);
    isNewArticle = true;
  } else {
    // 按编号排序，找到最新的文章
    const sortedFiles = files.sort((a, b) => extractNumber(b) - extractNumber(a));
    const latestFile = sortedFiles[0];
    const latestPath = path.join(thinksDir, latestFile);

    if (containsCurrentMonth(latestPath)) {
      // 最新文章包含当前月份，追加内容
      targetFile = appendToArticle(latestPath);
    } else {
      // 需要创建新文章
      const newNum = extractNumber(latestFile) + 1;
      targetFile = createNewArticle(newNum);
      isNewArticle = true;
    }
  }

  if (isNewArticle) {
    hexo.log.info(`✅ 创建新文章: source/_thinks/${targetFile}`);
  } else {
    hexo.log.info(`✅ 已追加到: source/_thinks/${targetFile}`);
  }
  hexo.log.info(`📝 ${currentMonth}月${currentDay}日: "${content}"`);

  // 自动 commit 和 push
  const exec = require('child_process').execSync;
  try {
    hexo.log.info('正在提交到 git...');
    exec(`git add "source/_thinks/${targetFile}"`, { cwd: hexo.base_dir, stdio: 'inherit' });
    exec(`git commit -m "Add thinking mark - ${currentMonth}月${currentDay}日"`, { cwd: hexo.base_dir, stdio: 'inherit' });
    exec('git push origin source', { cwd: hexo.base_dir, stdio: 'inherit' });
    hexo.log.info('✅ 已提交并推送到 source 分支');
  } catch (e) {
    hexo.log.warn('⚠️ Git 操作失败，请手动提交');
  }
});