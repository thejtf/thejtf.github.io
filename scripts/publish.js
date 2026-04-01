#!/usr/bin/env node
// 一键发布脚本：提交源码 + 部署上线
// 用法: npm run pub "更新说明"

const { execSync } = require('child_process');
const path = require('path');

// 获取提交信息
const message = process.argv[2] || `更新内容 - ${new Date().toLocaleString('zh-CN')}`;

console.log('\n🚀 开始发布流程...\n');

try {
  // 1. 检查是否有更改
  const status = execSync('git status --porcelain', { encoding: 'utf-8' });

  if (status.trim()) {
    // 2. 提交源码
    console.log('📦 提交源码到 source 分支...');
    execSync('git add -A', { stdio: 'inherit' });
    execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
    execSync('git push origin source', { stdio: 'inherit' });
    console.log('✅ 源码已提交\n');
  } else {
    console.log('ℹ️  没有需要提交的更改\n');
  }

  // 3. 清理、生成、部署
  console.log('🔨 生成静态文件...');
  execSync('hexo clean', { stdio: 'inherit' });
  execSync('hexo generate', { stdio: 'inherit' });

  console.log('\n🌐 部署到 GitHub Pages...');
  execSync('hexo deploy', { stdio: 'inherit' });

  console.log('\n🎉 发布完成！\n');

} catch (error) {
  console.error('\n❌ 发布失败:', error.message);
  process.exit(1);
}