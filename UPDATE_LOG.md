# 社交媒体内容创作器 - 更新日志

## 📅 2026-05-07 最新更新

### ✨ 高清预览模式
- 新增「AO3兼容」/「高清预览」模式切换按钮
- 高清模式下聊天区域按内容自增高度，移除固定高度和滚动条
- 高清模式使用 SVG 图标替代 Emoji，更接近真实 App 效果
- 各平台气泡、阴影、圆角等细节在高清模式下进一步增强

### 🖼️ 图片导出功能
- 新增「导出图片」按钮，使用 html2canvas 截图下载 PNG
- 截图时自动临时切换到高清模式，确保导出 SVG 图标而非 Emoji
- 聊天模块截图时自动展开所有消息（移除 max-height 限制），完整导出全部内容
- 综合页面支持批量导出图片，每个模块单独下载一张 PNG

### 🎨 双图标架构（Emoji + SVG）
- 全平台实现双图标模式：标准模式显示 Emoji，高清/导出时显示 SVG
- 涉及平台：Instagram、X/Twitter、YouTube、Reddit、WhatsApp、QQ、小红书
- CSS 通过 `.preview-hd` 父级选择器切换显示，预览组件无需改动
- AO3 兼容 HTML 导出自动替换为 Emoji，不受 SVG 影响

### 👤 联系人头像显示
- **iMessage**：导航栏显示联系人头像，消息旁显示头像（首条收到的消息）
- **WhatsApp**：导航栏显示联系人头像，消息旁显示头像
- **WhatsApp 群聊**：每条消息旁显示发送者头像，使用成员颜色作为占位头像背景
- 头像大小统一为 45px，占位头像显示联系人姓名首字

### 🐛 问题修复
- 修复 Instagram 点赞图标在 AO3 导出中丢失的问题（双图标架构替代方案）
- 修复 X/Twitter 和 YouTube 图标在兼容 HTML 导出中失效的问题
- 修复 WhatsApp 群成员颜色在综合页面中不更新的问题（从 DOM 注入改为 Vue 内联样式）
- 修复 iMessage 消息对齐问题（头像间隔在连续消息中正确显示）
- 修复 iMessage 头像 CSS 重复定义导致尺寸被覆盖的问题

### 🔧 技术改进
- `exporter.js` 的 `_replaceSVG()` 跳过 `-hd-icon` 类的 SVG，避免重复替换
- `app.js` 的 `exportImage()` 截图前临时添加 `.preview-hd` 并展开聊天容器
- `universal-editor.js` 的 `exportImages()` 同步支持展开聊天容器
- WhatsApp 群成员颜色改用 Vue 响应式 `:style` 绑定，移除 `_injectMemberColors`

---

## 📅 2026-04-13 最新更新

### ✨ 新功能

#### 1. 完善评论系统
- **Instagram**: 评论编辑器与拖拽排序功能
- **Twitter**: ✨ 新增评论编辑器与拖拽排序功能  
- **Reddit**: 评论编辑器与拖拽排序功能
- **YouTube**: 评论编辑器与拖拽排序功能
- **iMessage**: 消息气泡编辑功能

#### 2. 综合页面功能完善
- ✅ 拖拽排序功能应用到预览部分
- ✅ 空状态处理（无平台时的友好提示）
- ✅ 平台顺序管理
- ✅ 数据传递优化（支持默认平台数据）

#### 3. 用户体验改进
- ✨ 新增启动页面 (`launcher.html`)
- ✨ 新增功能测试页面 (`test-functionality.html`)
- ✨ 新增快速验证脚本 (`quick-test.js`)
- ✨ 完善的Toast提示系统
- ✅ 拖拽视觉反馈（拖拽状态、悬停效果）

#### 4. 界面优化
- 添加拖拽手柄 (`⋮⋮`)
- 综合页面拖拽时的高亮效果
- 评论数量的准确显示
- 交互反馈的视觉改进

### 🛠️ 技术实现

#### 评论系统架构
```javascript
// 每个平台评论数据结构
{
    username: string,      // 用户名
    text: string,         // 评论内容
    likes: number,        // 点赞数
    // 其他字段根据平台特性扩展
}
```

#### 拖拽排序实现
- 使用HTML5 Drag & Drop API
- 拖拽时的视觉反馈
- 自定义拖拽逻辑（不是浏览器默认排序）
- 支持拖拽手柄交互

#### 综合页面数据管理
```javascript
// 综合页面数据结构
{
    platforms: {
        instagram: {...},
        twitter: {...},
        // ... 其他平台
    },
    platformOrder: ['instagram', 'twitter', 'reddit'] // 显示顺序
}
```

### 🎯 使用指南

#### 创建单个平台内容
1. 打开 `index.html`
2. 选择目标平台（Instagram、Twitter等）
3. 编辑内容、添加评论
4. 预览效果
5. 导出HTML或JSON

#### 创建综合页面
1. 在主界面点击"综合页面"
2. 点击"添加平台"选择要包含的平台
3. 拖拽调整平台顺序
4. 为每个平台编辑内容
5. 导出完整的HTML页面

#### 功能验证
- 访问 `launcher.html` 查看快速启动界面
- 访问 `test-functionality.html` 运行完整测试
- 在浏览器控制台运行 `quick-test.js` 进行快速验证

### 🎨 支持的平台

| 平台 | 评论支持 | 拖拽排序 | 预览效果 | HTML导出 |
|------|----------|----------|----------|----------|
| Instagram | ✅ | ✅ | ✅ | ✅ |
| Twitter | ✅ | ✅ | ✅ | ✅ |
| Reddit | ✅ | ✅ | ✅ | ✅ |
| YouTube | ✅ | ✅ | ✅ | ✅ |
| iMessage | ✅ | - | ✅ | ✅ |
| 综合页面 | - | ✅ | ✅ | ✅ |

### 🔧 技术栈
- Vue.js 3 (无构建工具，直接浏览器运行)
- 原生JavaScript (ES6+)
- CSS3 (Flexbox, Grid, 动画)
- HTML5 (File API, Drag & Drop)
- 本地存储 (LocalStorage)

### 📁 项目结构
```
social-media-creator/
├── index.html              # 主应用入口
├── launcher.html           # 快速启动页面
├── test-functionality.html # 功能测试页面
├── quick-test.js          # 快速验证脚本
├── css/                   # 样式文件
│   ├── app.css            # 主样式
│   ├── platform-*.css    # 各平台专用样式
├── js/                    # JavaScript文件
│   ├── app.js             # 主应用逻辑
│   ├── platforms/         # 各平台组件
│   └── utils/             # 工具函数
└── assets/                # 静态资源
```

### 🚀 快速开始
1. 克隆项目到本地
2. 用现代浏览器打开 `index.html`
3. 选择平台开始创作
4. 使用导出功能保存作品

### 📞 支持
如遇到问题，请检查：
1. 浏览器是否支持ES6+
2. 是否启用JavaScript
3. 查看浏览器控制台错误信息
4. 运行功能测试页面验证