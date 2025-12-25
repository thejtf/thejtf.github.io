// Hexo 脚本：在生成后自动复制 workflow 文件到 public 目录
// 这样部署时会自动包含 workflow 文件

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

