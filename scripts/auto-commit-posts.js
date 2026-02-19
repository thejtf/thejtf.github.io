const { execSync } = require('child_process');
const path = require('path');

hexo.on('deployBefore', function() {
  const baseDir = hexo.base_dir;
  const postsDir = path.join(baseDir, 'source', '_posts');
  
  try {
    process.chdir(baseDir);
    
    const status = execSync('git status --porcelain "source/_posts/"', { encoding: 'utf-8' });
    const newPosts = status.split('\n').filter(line => line.startsWith('??'));
    
    if (newPosts.length > 0) {
      hexo.log.info(`📝 发现 ${newPosts.length} 篇新博文，正在提交到 source 分支...`);
      
      execSync('git add "source/_posts/"', { stdio: 'inherit' });
      
      const date = new Date().toISOString().slice(0, 16).replace('T', ' ');
      execSync(`git commit -m "Add new posts: ${date}"`, { stdio: 'inherit' });
      
      execSync('git push origin source', { stdio: 'inherit' });
      
      hexo.log.info('✅ 新博文已提交到 source 分支');
    }
  } catch (error) {
    hexo.log.warn('⚠️  检查新博文时出错:', error.message);
  }
});
