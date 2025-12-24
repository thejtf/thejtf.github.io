# 项目版本更新日志 - V1.01

**更新日期**: 2025年1月  
**项目版本**: V1.01  
**基于版本**: V1.0

---

## 📋 版本信息

- **项目版本**: V1.01
- **Hexo 版本**: 6.3.0
- **主题**: paper
- **更新类型**: 功能优化与体验改进

---

## ✨ 版本优化说明

### 1. 移动端分页体验优化

**问题描述**：
- 移动端分页按钮宽度不足，导致箭头符号接近按钮边缘
- "前一页"和"下一页"按钮在移动端显示体验不佳
- 页码和按钮未在同一行显示

**优化内容**：
- ✅ 增加移动端按钮宽度：将按钮左右内边距从 `1.5rem` 增加到 `2.5rem`，为箭头图标提供充足空间
- ✅ 优化移动端布局：使用 Flexbox 布局，确保"前一页"、页码和"下一页"在同一行显示
- ✅ 调整箭头位置：更新箭头位置计算，适配新的按钮宽度
- ✅ 优化间距：使用 `gap: 0.8rem` 控制元素间距，提升视觉效果

**修改文件**：
- `themes/paper/source/css/includes/_paginator.styl`

**移动端断点**：`max-width: 580px`

---

### 2. 分页器显示逻辑优化

**问题描述**：
- 当总页数较多时，分页器会显示所有页码，导致移动端显示拥挤
- 需要智能显示页码：总页数 ≤ 3 时显示所有页码，> 3 时只显示当前页及其前后各一页

**优化内容**：
- ✅ 实现智能分页显示逻辑
  - 总页数 ≤ 3：显示所有页码（如：1 2 3）
  - 总页数 > 3：只显示当前页及其前后各一页
    - 第 5 页显示：4 5 6
    - 第 7 页显示：6 7 8
    - 第 1 页显示：1 2
    - 最后一页显示：倒数第二页 最后一页

**修改文件**：
- `themes/paper/layout/includes/paginator.pug`

**技术实现**：
- 使用 Hexo `paginator()` 函数的 `mid_size: 1` 和 `end_size: 0` 参数

---

### 3. 主题色配置调整

**调整内容**：
- ✅ 测试了多种主题色（red、black、grass）
- ✅ 最终保持默认主题色 `default`（`#ebc65a` 金黄色）
- ✅ 更新了 red 主题色值为 `#FF585B`（在样式文件中，当前未使用）

**修改文件**：
- `themes/paper/_config.yml`
- `themes/paper/source/css/var.styl`
- `themes/paper/layout/includes/layout.pug`

---

## 📝 技术细节

### 移动端分页样式优化

```styl
@media screen and (max-width: $S)
  .paginator
    display: flex
    flex-wrap: nowrap
    justify-content: center
    align-items: center
    gap: 0.8rem
    padding: 3rem 1rem
    .extend
      padding: 1rem 2.5rem  // 增加按钮宽度
      font-size: 1.3rem
    .page-number
      flex: 0 0 auto
      padding: 0 0.3em
```

### 分页器配置

```pug
.paginator!= paginator({
  prev_text: '前一页', 
  next_text: '下一页', 
  mid_size: 1,      // 当前页前后各显示1页
  end_size: 0       // 不显示首尾页码
})
```

---

## 🔄 与 V1.0 的差异

### 新增功能
- 移动端分页优化布局
- 智能分页显示逻辑

### 修改内容
- 移动端分页按钮样式和布局
- 分页器显示逻辑
- 主题色配置（red 颜色值更新）

### 保持不变
- Hexo 核心版本：6.3.0
- 所有依赖包版本
- 主要配置文件结构
- 主题核心功能

---

## 📦 当前配置状态

### 主题配置
- **主题色**: `default` (`#ebc65a`)
- **语言**: `zh-CN`
- **每页文章数**: 10

### 分页配置
- **每页显示**: 10 篇文章
- **分页目录**: `page`
- **显示逻辑**: 智能显示（≤3页显示全部，>3页显示当前页±1）

---

## 🚀 升级说明

从 V1.0 升级到 V1.01：

1. **无需修改依赖**：所有 npm 包版本保持不变
2. **配置文件**：主题配置文件已更新
3. **样式文件**：分页器样式已优化
4. **模板文件**：分页器模板已更新

**升级步骤**：
```bash
# 清理缓存
npx hexo clean

# 重新生成静态文件
npx hexo generate

# 启动服务器查看效果
npx hexo server
```

---

## 📌 注意事项

1. **移动端测试**：建议在移动设备或浏览器移动端视图中测试分页效果
2. **分页逻辑**：当总页数超过 3 页时，分页器会自动应用智能显示逻辑
3. **主题色**：当前使用默认主题色，如需切换可在 `themes/paper/_config.yml` 中修改 `main_color`

---

## 🔗 相关文件

### 修改的文件
- `themes/paper/_config.yml` - 主题配置
- `themes/paper/source/css/includes/_paginator.styl` - 分页器样式
- `themes/paper/layout/includes/paginator.pug` - 分页器模板
- `themes/paper/source/css/var.styl` - 主题色变量（red 颜色值）
- `themes/paper/layout/includes/layout.pug` - 布局文件（colorMap）

### 参考文档
- `VERSION_V1.0_BACKUP.md` - V1.0 版本备份文档

---

**文档创建时间**: 2025年1月  
**最后更新**: 2025年1月

