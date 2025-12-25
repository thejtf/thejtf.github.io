// Hexo 脚本：在生成后自动复制 workflow 文件到 public 目录
// 并在部署前确保 workflow 文件被复制到 .deploy_git 目录

const fs = require('fs');
const path = require('path');

hexo.on('generateAfter', function() {
  const sourceWorkflow = path.join(hexo.base_dir, '.github', 'workflows', 'deploy.yml');
  const targetDir = path.join(hexo.public_dir, '.github', 'workflows');
  const targetWorkflow = path.join(targetDir, 'deploy.yml');
  
  // 检查源文件是否存在
  if (fs.existsSync(sourceWorkflow)) {
    // 创建目标目录
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // 复制文件
    fs.copyFileSync(sourceWorkflow, targetWorkflow);
    hexo.log.info('✅ Workflow file copied to public directory');
  } else {
    hexo.log.warn('⚠️  Workflow file not found, skipping copy');
  }
});

// 在部署后确保 workflow 文件被添加到 master 分支
hexo.on('deployAfter', function() {
  const deployDir = path.join(hexo.base_dir, '.deploy_git');
  const workflowSource = path.join(hexo.base_dir, '.github', 'workflows', 'deploy.yml');
  const workflowTarget = path.join(deployDir, '.github', 'workflows', 'deploy.yml');
  
  if (fs.existsSync(deployDir) && fs.existsSync(workflowSource)) {
    try {
      const originalDir = process.cwd();
      const { execSync } = require('child_process');
      
      // 创建目标目录
      const targetDir = path.dirname(workflowTarget);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // 复制文件到 .deploy_git
      fs.copyFileSync(workflowSource, workflowTarget);
      
      // 切换到 .deploy_git 目录并执行 git 命令
      process.chdir(deployDir);
      
      // 添加并提交文件
      execSync('git add .github/workflows/deploy.yml', { stdio: 'pipe' });
      try {
        execSync('git commit -m "Add GitHub Actions workflow for daily rebuild and deploy"', { stdio: 'pipe' });
        execSync('git push origin master', { stdio: 'pipe' });
        hexo.log.info('✅ Workflow file added to master branch');
      } catch (e) {
        // 如果文件已经存在或没有更改，忽略错误
        hexo.log.info('ℹ️  Workflow file already exists in master branch');
      }
      
      process.chdir(originalDir);
    } catch (error) {
      hexo.log.warn('⚠️  Failed to add workflow file to master branch:', error.message);
      process.chdir(hexo.base_dir);
    }
  }
});

