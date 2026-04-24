# 社交媒体内容创作器 - 项目设计文档

## 1. 项目概述

一个纯前端社交媒体内容创作器，支持 7 个平台的模拟编辑与预览，可将多个平台内容组合为长篇社媒文章并导出。

- **运行方式**：直接用浏览器打开 `index.html`，无需服务器（兼容 `file://` 协议）
- **技术栈**：Vue 3（CDN/本地）、原生 JS、CSS3、HTML5 Drag & Drop
- **设计目标**：在完全离线环境下工作，导出 HTML 在目标发布平台保持格式
- **支持平台**：小红书、Instagram、X (Twitter)、Reddit、YouTube、iMessage、WhatsApp
- **平台分组**：国内平台（小红书）/ 国际平台（其余 6 个），通过 Tab 切换

---

## 2. 目录结构

```
social-media-creator/
├── index.html                          # 主应用入口
├── generate-platform-css.js            # 平台 CSS 生成脚本
├── DESIGN.md                           # 项目设计文档
├── css/
│   ├── app.css                         # 编辑器/预览面板/表单/弹窗样式
│   ├── platform-instagram.css          # Instagram 预览样式（.ig-* 前缀）
│   ├── platform-twitter.css            # X 预览样式（.tw-* 前缀）
│   ├── platform-reddit.css             # Reddit 预览样式（.rd-* 前缀）
│   ├── platform-youtube.css            # YouTube 预览样式（.yt-* 前缀）
│   ├── platform-imessage.css           # iMessage 预览样式（.msg-* 前缀）
│   ├── platform-whatsapp.css           # WhatsApp 预览样式（.wa-* 前缀）
│   └── platform-xiaohongshu.css        # 小红书预览样式（.xhs-* 前缀）
├── js/
│   ├── app.js                          # Vue 应用主逻辑、数据、方法
│   ├── vendor/
│   │   └── vue.global.prod.js          # Vue 3 本地副本（v3.5.32）
│   ├── platforms/
│   │   ├── instagram.js                # InstagramEditor + InstagramPreview
│   │   ├── twitter.js                  # TwitterEditor + TwitterPreview
│   │   ├── reddit.js                   # RedditEditor + RedditPreview
│   │   ├── youtube.js                  # YouTubeEditor + YouTubePreview
│   │   ├── imessage.js                 # iMessageEditor + iMessagePreview
│   │   ├── whatsapp.js                 # WhatsAppEditor + WhatsAppPreview
│   │   └── xiaohongshu.js              # XiaohongshuEditor + XiaohongshuPreview
│   ├── components/
│   │   └── universal-editor.js         # 综合页面编辑器组件
│   └── utils/
│       ├── storage.js                  # LocalStorage 操作工具
│       ├── image.js                    # 图片上传/压缩/Base64 工具
│       ├── exporter.js                 # HTML 导出引擎（普通+兼容模式+内联样式提取）
│       └── platform-css.js             # 所有平台 CSS 内嵌为 JS 字符串（自动生成）
```

---

## 3. 架构设计

### 3.1 加载顺序（index.html）

```html
<!-- 1. CSS -->
<link rel="stylesheet" href="css/app.css">
<link rel="stylesheet" href="css/platform-*.css">  ×7

<!-- 2. Vue 3（本地优先，CDN 备用） -->
<script src="js/vendor/vue.global.prod.js"></script>

<!-- 3. 工具模块 -->
<script src="js/utils/storage.js"></script>
<script src="js/utils/image.js"></script>
<script src="js/utils/platform-css.js"></script>    <!-- 必须在 exporter.js 之前 -->
<script src="js/utils/exporter.js"></script>

<!-- 4. 平台模块 -->
<script src="js/platforms/instagram.js"></script>
<script src="js/platforms/twitter.js"></script>
<script src="js/platforms/reddit.js"></script>
<script src="js/platforms/youtube.js"></script>
<script src="js/platforms/imessage.js"></script>
<script src="js/platforms/whatsapp.js"></script>
<script src="js/platforms/xiaohongshu.js"></script>

<!-- 5. 综合页面组件 -->
<script src="js/components/universal-editor.js"></script>

<!-- 6. 主应用（最后加载） -->
<script src="js/app.js"></script>
```

### 3.2 组件结构

每个平台导出两个全局组件：

| 全局变量 | 组件名 | 用途 |
|----------|--------|------|
| `InstagramEditor` | `instagram-editor` | Instagram 编辑器表单 |
| `InstagramPreview` | `instagram-preview` | Instagram 预览渲染 |
| `TwitterEditor` | `twitter-editor` | X 编辑器表单 |
| `TwitterPreview` | `twitter-preview` | X 预览渲染 |
| `RedditEditor` | `reddit-editor` | Reddit 编辑器表单 |
| `RedditPreview` | `reddit-preview` | Reddit 预览渲染 |
| `YouTubeEditor` | `youtube-editor` | YouTube 编辑器表单 |
| `YouTubePreview` | `youtube-preview` | YouTube 预览渲染 |
| `iMessageEditor` | `imessage-editor` | iMessage 编辑器表单 |
| `iMessagePreview` | `imessage-preview` | iMessage 预览渲染 |
| `WhatsAppEditor` | `whatsapp-editor` | WhatsApp 编辑器表单 |
| `WhatsAppPreview` | `whatsapp-preview` | WhatsApp 预览渲染 |
| `XiaohongshuEditor` | `xiaohongshu-editor` | 小红书编辑器表单 |
| `XiaohongshuPreview` | `xiaohongshu-preview` | 小红书预览渲染 |
| `UniversalEditor` | `universal-editor` | 综合页面管理+预览 |

### 3.3 数据流

```
app.js (projectData)
  ↓ :data prop
平台编辑器组件 → @update 事件 → updatePlatformData()
  ↓ :data prop
平台预览组件（只读渲染）

app.js (universalData)
  ↓ :universal-data prop
UniversalEditor → @update 事件 → updateUniversalData()
  ↓ 内部遍历 items
各平台预览组件（只读渲染）
```

---

## 4. 数据结构

### 4.1 projectData（单平台编辑数据）

```javascript
projectData: {
    instagram: {
        username, verified, location, avatar, avatarUrl,
        imageUrl, imageUrlExt,
        likes, caption, showAllCaption, timestamp,
        comments: [{ username, text, likes, replies: [{ username, text }] }],
        imageWidth, imageHeight
    },
    twitter: {
        displayName, username, verified, avatar, avatarUrl, content,
        imageUrl, imageUrlExt,
        timestamp, replies, retweets, likes, views, bookmarks,
        quoteTweet: null | {
            displayName, username, verified, content,
            imageUrl, imageUrlExt
        },
        isThread, threadTweets: [],
        comments: [{ username, text, likes, avatar, avatarUrl, replies: [{ username, text }] }]
    },
    reddit: {
        subreddit, author, flair, flairColor,
        title, body, imageUrl, imageUrlExt,
        upvotes, downvotes, commentCount, awards: [],
        timeAgo,
        comments: [{
            author, text, upvotes, timeAgo,
            replies: [{ author, text, upvotes, timeAgo }]
        }]
    },
    youtube: {
        title, thumbnail, thumbnailUrl, channelName, channelAvatar, channelAvatarUrl,
        subscribers, views, dateText, likes, dislikes, description,
        commentsCount,
        comments: [{ author, text, likes, timeAgo, isPinned, replies: [{ author, text }] }]
    },
    imessage: {
        contactName, contactAvatar, contactAvatarUrl,
        showTyping, showReadReceipt, readReceiptText,
        timeSeparator, dateSeparator,
        messages: [{ id, type:'sent'|'received', text, image, imageUrl, time, reaction }]
    },
    whatsapp: {
        contactName, contactAvatar, contactAvatarUrl, contactStatus,
        dateSeparator, showTyping, showReadReceipt, readReceiptText,
        theme: 'whatsapp'|'dark'|'ocean'|'lavender'|'rose'|'mint'|'sunset'|'custom',
        customBgColor, customHeaderColor,
        isGroup: boolean, groupName,
        groupMembers: [{ name, avatar, avatarUrl, color }],
        messages: [{
            id, type:'sent'|'received', text, image, imageUrl,
            time, reaction, ticks, sender,
            isVoice: boolean, voiceDuration, voiceTranscription,
            isCall: boolean, callType, callDuration, callStatus
        }]
    },
    xiaohongshu: {
        username, avatar, avatarUrl,
        imageUrl, imageUrlExt,
        title, content, location,
        likes, favorites,
        showFollowBtn: boolean,
        timestamp,
        comments: [{
            username, text, likes, avatar, avatarUrl,
            replies: [{ username, text, avatar, avatarUrl }]
        }]
    }
}
```

### 4.2 universalData（综合页面数据）

```javascript
universalData: {
    items: [
        {
            id: 'uni_1712998800000_abc123',   // 唯一ID
            platform: 'instagram',             // 平台标识
            data: { ... },                     // 平台数据快照（深拷贝）
            addedAt: '2024/4/13 15:30'        // 添加时间
        }
    ]
}
```

### 4.3 项目保存格式

```javascript
{
    version: '3.8',
    data: { ...projectData },          // 单平台编辑数据
    universalData: { items: [...] },   // 综合页面模块列表
    exportedAt: 'ISO日期字符串'
}
```

---

## 5. 视图系统

### 5.1 双视图模式

| 视图 | currentView 值 | 说明 |
|------|----------------|------|
| 单平台编辑 | `'single'` | 左侧编辑器 + 右侧预览 |
| 综合页面 | `'universal'` | 左侧模块列表 + 右侧综合预览 |

### 5.2 视图切换

Header 中 `📱 编辑` / `📋 综合` 切换按钮，同时当综合页面有模块时显示模块数量徽章。

---

## 6. 导出系统

### 6.1 三种导出模式

| 按钮 | 方法 | 输出 | 用途 |
|------|------|------|------|
| 📥 导出 HTML | `exportHTML()` | 完整 HTML 文件（含 `<style>`） | 本地浏览、直接展示 |
| 📤 导出兼容 HTML | `exportCompatibleHTML()` | 清理后的 HTML + CSS（单文件） | 粘贴到目标发布平台 |
| 📋 复制 HTML | `copyHTMLFragment()` | HTML 片段到剪贴板 | 粘贴到编辑器 |

### 6.2 普通导出（exportHTML）

生成完整独立 HTML 文件：
- `<style>` 内嵌所有平台 CSS
- `<body>` 包含预览 DOM 的 `innerHTML`
- 可直接在浏览器中打开，格式与编辑器预览一致

### 6.3 兼容导出（exportCompatibleHTML）

目标平台限制下的安全导出，进行以下清理：

#### HTML 清理规则

| 清理项 | 处理方式 |
|--------|---------|
| `<svg>` 图标 | 替换为 emoji/Unicode 文本 |
| `style=""` 属性 | 提取为 CSS class（`_extractInlineStyles()`），class 以 `xc` 前缀命名，`rgb()` 自动转十六进制 |
| `<style>` 标签 | 移除（CSS 放在独立区域） |
| `<input>`/`<button>`/`<label>` | 移除标签保留文本 |
| `<svg>` 内的 `<circle>` | 替换为 `⋯` |
| `data:image/...` 图片 | 替换为 `[图片]` 占位 span |
| 不在白名单的标签 | 递归移除标签，保留子内容 |

**HTML 标签白名单**：
`a, abbr, acronym, address, b, big, blockquote, br, caption, center, cite, code, col, colgroup, dd, del, details, div, dl, dt, em, figcaption, figure, h1-h6, hr, i, img, ins, kbd, li, ol, p, pre, q, rp, rt, ruby, s, samp, small, span, strike, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, tr, tt, u, ul, var`

**HTML 属性白名单**：
`align, alt, axis, class, height, href, name, src, title, width`

#### SVG 替换映射表

| SVG path 前缀 | 替换文本 | 用途 |
|---------------|---------|------|
| `M20.396` | ✓ | 认证蓝标 |
| `M12 4L4 12h5v8h6v-8h5z` | ▲ | 投票上 |
| `M12 20l8-8h-5V4H9v8H4z` | ▼ | 投票下 |
| `M1.751 10c0-4.42` | 💬 | 评论/回复 |
| `M4.5 3.88l4.432` | 🔄 | 转推 |
| `M20.884 13.19c-1.351` | ❤️ | 点赞 |
| `M12 2.59l5.7` | 📤 | 分享 |
| `M8.75 21V3h2` | 📊 | 统计 |
| `M18 16.08c-.76` | 🔗 | 链接 |
| `M17 3H7c-1.1` | 🔖 | 书签 |
| `M15 18l-6-6` | ← | 返回箭头 |
| `M2.01 21L23 12` | ➤ | 发送按钮 |
| `M12 5V1L7` | ↩ | 回复箭头 |
| `M16.5 6H11` | ↗ | 转推箭头 |
| 包含 `<circle>` | ⋯ | 更多按钮 |

#### CSS 清理规则

兼容导出时，`exporter.js` 的 `_cleanCSS()` 方法对 CSS 进行以下清理：

##### 移除的属性（BLOCKED_CSS_PROPS 列表）

```
aspect-ratio          object-fit           backdrop-filter
-webkit-overflow-scrolling    -webkit-font-smoothing
-moz-osx-font-smoothing       -webkit-appearance
-webkit-tap-highlight-color   -webkit-touch-callout
-webkit-text-size-adjust      -webkit-mask
-webkit-clip-path             clip-path
image-rendering        scroll-behavior      overscroll-behavior
touch-action           cursor               fill
stroke-width           pointer-events       user-select
resize                 content              flex-shrink
animation              animation-delay      animation-direction
animation-duration     animation-fill-mode  animation-iteration-count
animation-name         animation-play-state animation-timing-function
```

##### 移除的规则类型

| 规则类型 | 正则匹配 | 原因 |
|---------|---------|------|
| `@keyframes` | `@keyframes ... { ... }` | 动画不被支持 |
| `stroke` 属性 | 行首 `stroke:` | SVG 专用，不被允许 |
| `gap` 属性 | 行首 `gap:` | 不在允许列表 |
| 含 `svg` 选择器的规则 | `*.svg* { ... }` | SVG 已替换为文本 |
| `:hover` 规则 | `*:hover* { ... }` | 静态展示不需要 |
| `:nth-child` 规则 | `*:nth-child* { ... }` | 通常只含 animation-delay |
| `::before/after/placeholder/-webkit-scrollbar` 规则 | `*::xxx* { ... }` | 伪元素不可靠 |
| 空规则 | `selector { }` | 清理 |
| 注释 | `/* ... */` | 平台会自动移除 |

##### 属性移除机制

所有属性移除使用 `^` 锚点 + `m` 标志，确保只匹配行首的独立属性名，不会误删复合属性（如 `justify-content` 中的 `content`）：

```javascript
// 正确：只匹配行首的 "content:"
/^\s*content\s*:[^;]*;/gim

// 错误：会匹配 "justify-content:" 中的 "content:"
/\s*content\s*:[^;]*;/gi
```

被移除的属性替换为换行符 `\n`（而非空字符串），防止相邻属性粘连导致解析错误。

##### AO3 (Archive of Our Own) 平台 CSS 规则

**允许的属性族（含所有变体和简写）**：
`background`, `border`, `column`, `cue`, `flex`, `font`, `layer-background`, `layout-grid`, `list-style`, `margin`, `marker`, `outline`, `overflow`, `padding`, `page-break`, `pause`, `scrollbar`, `text`, `transform`, `transition`

**额外允许的单独属性**（完整列表）：
```
-replace, -use-link-source, accelerator, accent-color, align-content, align-items,
align-self, alignment-adjust, alignment-baseline, appearance, azimuth, baseline-shift,
behavior, binding, bookmark-label, bookmark-level, bookmark-target, bottom, box-align,
box-direction, box-flex, box-flex-group, box-lines, box-orient, box-pack, box-shadow,
box-sizing, caption-side, clear, clip, color, color-profile, color-scheme, counter-increment,
counter-reset, crop, cue, cue-after, cue-before, cursor, direction, display,
dominant-baseline, drop-initial-after-adjust, drop-initial-after-align,
drop-initial-before-adjust, drop-initial-before-align, drop-initial-size,
drop-initial-value, elevation, empty-cells, filter, fit, fit-position, float,
float-offset, font, font-effect, font-emphasize, font-emphasize-position,
font-emphasize-style, font-family, font-size, font-size-adjust, font-smooth,
font-stretch, font-style, font-variant, font-weight, grid-columns, grid-rows,
hanging-punctuation, height, hyphenate-after, hyphenate-before, hyphenate-character,
hyphenate-lines, hyphenate-resource, hyphens, icon, image-orientation, image-resolution,
ime-mode, include-source, inline-box-align, justify-content, layout-flow, left,
letter-spacing, line-break, line-height, line-stacking, line-stacking-ruby,
line-stacking-shift, line-stacking-strategy, mark, mark-after, mark-before, marks,
marquee-direction, marquee-play-count, marquee-speed, marquee-style, max-height,
max-width, min-height, min-width, move-to, nav-down, nav-index, nav-left, nav-right,
nav-up, opacity, order, orphans, page, page-policy, phonemes, pitch, pitch-range,
play-during, position, presentation-level, punctuation-trim, quotes, rendering-intent,
resize, rest, rest-after, rest-before, richness, right, rotation, rotation-point,
ruby-align, ruby-overhang, ruby-position, ruby-span, size, speak, speak-header,
speak-numeral, speak-punctuation, speech-rate, stress, string-set, tab-side, table-layout,
target, target-name, target-new, target-position, top, unicode-bibi, unicode-bidi,
user-select, vertical-align, visibility, voice-balance, voice-duration, voice-family,
voice-pitch, voice-pitch-range, voice-rate, voice-stress, voice-volume, volume,
white-space, white-space-collapse, widows, width, word-break, word-spacing, word-wrap,
writing-mode, z-index
```

**AO3 特殊限制**：
- 不允许 `font` 简写，必须拆分为 `font-size`/`font-weight`/`font-family` 单独声明
- 不允许 `@font-face`
- 不允许 `cursor` 属性
- 不允许 `fill`、`stroke`、`stroke-width` 等 SVG 属性
- 不允许注释（会被自动移除）
- 每个属性每个规则集只能出现一次（重复的只保留最后一个）
- 自定义 CSS 变量（`var()`）仅站点皮肤可用，作品皮肤不可用
- 外部图片 URL 仅支持 JPG/GIF/PNG 格式
- 数值最多两位小数，单位支持：cm, em, ex, in, mm, pc, pt, px

#### AO3 图片处理

AO3 不支持 `data:image/...` base64 URI，因此需要为每个图片字段提供外部链接：

| 图片字段 | 外部链接字段 | 说明 |
|----------|------------|------|
| `avatar` | `avatarUrl` | Instagram/X 头像 |
| `imageUrl` | `imageUrlExt` | Instagram/X/Reddit 帖子图片 |
| `thumbnail` | `thumbnailUrl` | YouTube 封面 |
| `channelAvatar` | `channelAvatarUrl` | YouTube 频道头像 |
| `contactAvatar` | `contactAvatarUrl` | iMessage/WhatsApp 联系人头像 |
| `messages[].image` | `messages[].imageUrl` | iMessage/WhatsApp 消息图片 |
| `comments[].avatar` | `comments[].avatarUrl` | X 评论头像 |
| `groupMembers[].avatar` | `groupMembers[].avatarUrl` | WhatsApp 群成员头像 |

- **预览**：`base64图片 || 外部URL`（优先使用本地上传的 base64）
- **AO3 导出**：外部 URL 保留为 `<img src>`，base64 图片替换为 `[图片]` 占位符
- **普通导出**：所有图片正常保留

编辑器中每个图片上传区域下方都有 `🔗` 外部链接输入框，标注"外部图片链接（AO3导出用）"。

#### AO3 内联样式提取

`_extractInlineStyles()` 方法在 sanitizer 运行之前处理所有 `style` 属性：

1. 扫描所有带 `style` 的元素
2. 提取所有 CSS 属性（不限于特定属性，提取全部）
3. 浏览器会将颜色序列化为 `rgb()` 格式，自动转换为十六进制（如 `rgb(255,107,107)` → `#ff6b6b`），避免 AO3 不识别
4. 每种独特的样式组合生成 CSS class（如 `.xc0 { color: #ff6b6b; }`），**不以 `_` 开头**（AO3 会清除下划线开头的 class）
5. 用 class 替换内联 style
6. 生成的 CSS 追加到输出的 `<style>` 中

#### AO3 预览内嵌样式提取

部分平台（如 WhatsApp 群聊成员颜色）通过 `mounted`/`updated` 钩子注入真实 `<style>` DOM 元素到预览组件内部。导出兼容 HTML 时：

1. 在 `_sanitizeHTML()` 之前，提取克隆 DOM 中所有 `<style>` 元素的 `textContent`
2. 移除这些 `<style>` 元素
3. 将提取的 CSS 合并到输出的 `<style>` 区域

这解决了 WhatsApp 群聊中每个成员名字颜色不同的问题——颜色通过 CSS class（`wa-sc-0`、`wa-sc-1` 等）+ `<style>` 规则传递，不依赖内联 `style` 属性。

#### AO3 兼容性 CSS 补丁

`COMPAT_FIXES` 对象为每个平台提供 fallback CSS，补充被 `_cleanCSS()` 移除的关键属性（如 `aspect-ratio`、`object-fit`）：

```javascript
COMPAT_FIXES: {
    instagram: '.ig-image-container { height: 470px; } ...',
    twitter: '.tw-image-container img { max-height: 500px; } ...',
    youtube: '.yt-player { height: 338px; } ...',
    imessage: '.msg-messages { height: auto; } ...',
    whatsapp: '.wa-messages { height: auto; } .wa-bubble-image img { max-height: 400px; } ...',
    reddit: '.rd-post-image img { max-height: 600px; } ...',
    xiaohongshu: '.xhs-image-area { height: 520px; } ...'
}
```

---

## 7. CSS 编写规范

为同时兼容编辑器预览和导出环境，平台 CSS 须遵循：

### 7.1 禁止使用（AO3 不允许）

| 属性 | 替代方案 |
|------|---------|
| `gap` | 子元素 `margin` |
| `aspect-ratio` | 固定 `width` + `height` |
| `object-fit` | 固定尺寸 `div` 容器 |
| `animation` / `@keyframes` | 静态展示 |
| `backdrop-filter` | 普通 `background` |
| `var()` 变量 | 硬编码颜色值 |
| `content: '...'` | 直接在 HTML 中写文本 |
| `cursor` | 移除（不需要自定义光标） |
| `fill` / `stroke` / `stroke-width` | SVG 已替换为 emoji，不需要 |
| `flex-shrink` | 用固定 `width` 代替 |
| `pointer-events` | 移除 |
| `user-select` | 移除 |
| `resize` | 移除 |
| `font` 简写 | 拆分为 `font-size` + `font-weight` + `font-family` |
| `-webkit-*` 前缀 | 移除（除 `-webkit-scrollbar` 在编辑器中可用） |

### 7.1.1 禁止使用的规则选择器

| 选择器 | 原因 |
|--------|------|
| `*svg* { }` | SVG 在兼容导出中被替换为文本 |
| `*:hover* { }` | 静态展示不需要 hover 效果 |
| `*:nth-child* { }` | 通常只含 animation-delay |
| `*::before/after/placeholder* { }` | 伪元素装饰不可靠 |
| `*::-webkit-scrollbar* { }` | 滚动条样式不被支持 |

### 7.1.2 属性移除防粘连

移除属性行时**必须替换为换行符 `\n`**，不能替换为空字符串。否则会导致：

```css
/* 移除 object-fit 时如果用空字符串替换（错误） */
border-radius: 50%;
object-fit: cover;
background: #efefef;
/* 结果变成 */
border-radius: 50%;background: #efefef;   /* ← AO3 解析为 border-radius: "50%background" */

/* 移除 object-fit 时用换行符替换（正确） */
border-radius: 50%;
                          /* ← object-fit 行变成空行 */
background: #efefef;
```

### 7.2 头像占位符居中

使用 `line-height` 等于 `height` + `text-align: center`，不依赖 `display: flex`：

```css
.avatar-placeholder {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #007aff;
    text-align: center;
    line-height: 40px;    /* 等于 height */
    color: white;
    font-weight: 700;
    font-size: 16px;
}
```

### 7.3 多列布局

优先使用 `<table>` 而非 `display: flex`，因为导出环境对 flex 支持不确定：

```html
<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td width="40" valign="middle">固定列</td>
        <td valign="middle">自适应列</td>
    </tr>
</table>
```

### 7.4 类名前缀规范

| 平台 | CSS 前缀 | 文件 |
|------|---------|------|
| Instagram | `.ig-` | `platform-instagram.css` |
| X (Twitter) | `.tw-` | `platform-twitter.css` |
| Reddit | `.rd-` | `platform-reddit.css` |
| YouTube | `.yt-` | `platform-youtube.css` |
| iMessage | `.msg-` | `platform-imessage.css` |
| WhatsApp | `.wa-` | `platform-whatsapp.css` |
| 小红书 | `.xhs-` | `platform-xiaohongshu.css` |

### 7.5 编辑器 vs 预览样式分离

- `css/app.css` — 编辑器 UI（表单、面板、弹窗、拖拽）
- `css/platform-*.css` — 各平台预览渲染样式
- 预览样式**不得**依赖 `app.css` 中的任何样式

---

## 8. 平台 CSS 内嵌机制

### 8.1 为什么需要内嵌

`file://` 协议下浏览器阻止所有网络请求（`fetch`、`XMLHttpRequest`）和 `document.styleSheets.cssRules` 访问（CORS）。因此平台 CSS 必须在页面加载时以 `<script>` 标签加载为 JS 字符串。

### 8.2 生成方式

运行以下命令重新生成 `platform-css.js`：

```bash
node generate-platform-css.js
```

脚本会读取所有 `css/platform-*.css` 文件，生成 `js/utils/platform-css.js`。

**重要**：每次修改 `css/platform-*.css` 后都必须重新运行此命令。

### 8.3 导出引擎依赖链

```
platform-css.js  →  定义全局变量 PlatformCSS
exporter.js      →  通过 PlatformCSS[platform] 读取 CSS 字符串
```

`platform-css.js` 必须在 `exporter.js` **之前**加载。

---

## 9. 综合页面工作流

```
1. 选择平台 → 编辑内容 → 预览满意
2. 点击「➕ 添加到综合页面」→ 深拷贝当前数据到 universalData.items
3. 点击「🔄 新建空白」→ 重置当前平台为默认数据
4. 重复步骤 1-3 添加更多模块
5. 切换到「📋 综合」视图
6. 拖拽调整模块顺序
7. 点击 ✏️ 可回到编辑器修改某模块
8. 导出 HTML / 兼容 HTML
```

---

## 10. 关键注意事项

### 10.1 file:// 兼容性

- Vue 3 已下载到 `js/vendor/`，不依赖 CDN
- 平台 CSS 已内嵌为 JS，不依赖 `fetch`/`XHR`
- 所有资源引用使用相对路径

### 10.2 弹窗防护

`.modal-overlay` 默认 `display: none`，仅在 `#app .modal-overlay` 下 `display: flex`。这样当 JS 报错时弹窗不会泄漏。

### 10.3 安全空值访问

平台组件中访问数组属性时必须做空值保护：
```javascript
// 正确
(data.comments || []).length
// 错误（可能导致 Vue 静默失败白屏）
data.comments.length
```

### 10.4 版本号缓存

修改 JS/CSS 后更新 `index.html` 中的 `?v=` 版本号以破坏浏览器缓存。

---

## 11. 平台显示名称

| platformId | 显示名 | 图标 | 分组 |
|------------|--------|------|------|
| xiaohongshu | 小红书 | 📕 | 国内 |
| instagram | Instagram | 📸 | 国际 |
| twitter | X | 🐦 | 国际 |
| reddit | Reddit | 🔴 | 国际 |
| youtube | YouTube | ▶️ | 国际 |
| imessage | iMessage | 💬 | 国际 |
| whatsapp | WhatsApp | 📱 | 国际 |

名称映射在两处维护：
- `app.js` → `platforms` 数组
- `js/components/universal-editor.js` → `getPlatformName()` 方法

---

## 12. 平台特性详情

### 12.1 WhatsApp

**主题系统**：8 种预设主题，每种定义 `bg`（聊天气泡背景）、`header`（头部颜色）、`sent`（发送气泡色）。

| 主题 ID | 名称 | 说明 |
|---------|------|------|
| whatsapp | 经典 | 默认 WhatsApp 绿色 |
| dark | 深色 | 深色模式 |
| ocean | 海洋 | 蓝色调 |
| lavender | 薰衣草 | 紫色调 |
| rose | 玫瑰 | 粉色调 |
| mint | 薄荷 | 清新绿色调 |
| sunset | 日落 | 暖色调 |
| custom | 自定义 | 用户通过 `customBgColor`/`customHeaderColor` 自定义 |

**群聊模式**（`isGroup: true`）：
- 头部显示堆叠头像 + 群名
- `groupMembers` 数组管理成员，每个成员有 `name`、`avatar`、`avatarUrl`、`color`
- 收到的消息通过 `sender` 索引关联到 `groupMembers`，显示发送者名字（颜色取自成员 `color`）
- `sender: -1` 表示"我"（发送方），`sender: 0/1/2...` 索引到 `groupMembers`

**语音消息**（`isVoice: true`）：
- 编辑器：开关切换语音模式，设置时长 (`voiceDuration`) 和转文字内容 (`voiceTranscription`)
- 预览：绿色/白色气泡内显示 ▶ 播放按钮 + 20 条波形柱 + 时长
- 转文字内容以斜体小字显示在语音气泡下方，带分隔线

### 12.2 X (Twitter) 引用转发

`quoteTweet` 字段：`null`（无引用）或对象 `{ displayName, username, verified, content, imageUrl, imageUrlExt }`

- **编辑器**：开关启用后填写原推作者、内容、图片链接
- **预览**：正文下方显示圆角边框的嵌套推文卡片（`.tw-quote-card`），包含头像占位、作者名、认证标、@用户名、正文和可选图片

### 12.3 评论回复（Instagram / X / YouTube）

三个平台的 `comments` 数组中每条评论新增 `replies: []` 字段：

| 平台 | 回复字段 | 编辑器功能 |
|------|---------|-----------|
| Instagram | `replies: [{ username, text }]` | 添加/删除/编辑回复 |
| X | `replies: [{ username, text }]` | 添加/删除/编辑回复 |
| YouTube | `replies: [{ author, text }]` | 添加/删除/编辑回复 |
| Reddit | `replies: [{ author, text, upvotes, timeAgo }]` | 已有，支持嵌套 |

预览中回复以缩进+左边框方式显示在父评论下方。

---

## 13. 数据迁移

当 `localStorage` 中保存了旧版本数据（缺少新字段）时，`_migrateData()` 方法自动补全：

```javascript
_migrateData() {
    const platforms = ['instagram', 'twitter', 'youtube', 'xiaohongshu'];
    for (const p of platforms) {
        const comments = this.projectData[p] && this.projectData[p].comments;
        if (Array.isArray(comments)) {
            for (let i = 0; i < comments.length; i++) {
                if (!comments[i].replies) {
                    comments[i] = { ...comments[i], replies: [] };
                }
            }
        }
    }
}
```

此方法在 `mounted()` 和 `loadProject()` 中调用，确保从 localStorage 加载的旧数据兼容新模板。

---

## 14. 变更日志

### v3.5-v3.8 新增功能与优化

#### 14.1 小红书平台模块（v3.5 新增）

- **CSS 前缀**：`.xhs-*`（`platform-xiaohongshu.css`）
- **编辑器**：用户信息、笔记图片（3:4 竖图）、标题/正文、位置、点赞/收藏、评论区（含嵌套回复+头像上传+外链）
- **预览**：红色主题卡片、关注按钮、互动栏（❤️ 点赞 / 💬 评论 / ⭐ 收藏）、评论/回复带头像
- **数据字段**：`username, avatar, avatarUrl, imageUrl, imageUrlExt, title, content, location, likes, favorites, showFollowBtn, timestamp, comments[{ username, text, likes, avatar, avatarUrl, replies[{ username, text, avatar, avatarUrl }] }]`
- **图片导出**：`COMPAT_FIXES.xiaohongshu` 提供 `height: 520px` fallback（替代被移除的 `aspect-ratio: 3/4`）

#### 14.2 平台 Tab 分组（v3.5）

- 平台选择器分为「🇨🇳 国内平台」和「🌍 国际平台」两个 Tab
- `platformRegion` 数据字段控制当前 Tab（`'domestic'` / `'international'`）
- `filteredPlatforms` 计算属性根据 `platformRegion` 过滤显示
- `switchPlatform()` 自动跳转到对应平台所在的 Tab

#### 14.3 综合页面模块选中聚焦（v3.4）

- 左侧模块列表项可点击选中（`selectedIndex` 状态）
- 选中后右侧预览自动平滑滚动到对应模块（`scrollIntoView({ behavior: 'smooth', block: 'center' })`）
- 左右两侧均有高亮样式（蓝色边框+背景）
- 再次点击取消选中

#### 14.4 综合页面「更新综合页面」按钮（v3.4）

- 当 `editingUniversalIndex >= 0` 时显示「✅ 更新综合页面」和「❌ 取消编辑」按钮
- 切换平台、切换视图、新建空白时自动清除 `editingUniversalIndex`

#### 14.5 Instagram 评论回复格式优化（v3.5）

- 去掉 `slice(0, 5)` 限制，显示全部评论
- 回复区添加 20px 缩进 + 2px 灰色竖线（`.ig-reply-thread-line`），类似真实 Instagram
- 评论用 `.ig-comment-group` 包裹分组

#### 14.6 X/Twitter 评论显示优化（v3.4）

- 去掉评论 `slice(0, 5)` 和回复 `slice(0, 3)` 限制，显示全部

#### 14.7 WhatsApp 群聊成员颜色 AO3 导出修复（v3.8）

**问题**：AO3 会清除元素的 `style` 属性，导致群聊不同成员的昵称颜色丢失。

**解决方案**：
1. 预览模板中发送者名字不再用 `:style`，改用 CSS class `wa-sc-{index}`
2. `WhatsAppPreview` 组件通过 `mounted`/`updated` 钩子，用 `document.createElement('style')` 注入真实 `<style>` 到 DOM（如 `.wa-sc-0 { color: #ff6b6b !important; }`）
3. 导出兼容 HTML 时，在 `_sanitizeHTML()` 之前提取克隆 DOM 中所有 `<style>` 的 `textContent`，合并到输出 CSS
4. `_extractInlineStyles()` 生成的 class 前缀改为 `xc`（不以 `_` 开头，AO3 会清除下划线开头的 class）
5. 浏览器序列化的 `rgb()` 颜色自动转换为十六进制

#### 14.8 平台选择器 Grid 布局（v3.4）

- `platform-tabs` 从 `display: flex` 改为 `display: grid; grid-template-columns: repeat(3, 1fr)`
- 避免平台多时按钮拥挤遮挡

#### 14.9 构建脚本（v3.4）

- 新增 `generate-platform-css.js` 替代内联 Node 命令
- 运行 `node generate-platform-css.js` 即可重新生成 `platform-css.js`
- 包含所有 7 个平台（含 xiaohongshu）

#### 14.10 小红书评论独立时间（v4.0）

- 评论和回复各有独立的 `time` 字段，不再共用主贴 `timestamp`
- 编辑器中评论和回复各有「🕐 时间」输入框
- 预览中评论显示 `comment.time`，回复显示 `reply.time`（小灰色文字）
- 主贴时间修改不再影响评论/回复的时间显示

#### 14.11 X/Twitter 图片导出变形修复（v4.1）

**问题**：`_cleanCSS` 删除 `object-fit: cover` 后，图片只有 `width: 100%` 无高度约束，导出 HTML 中图片拉伸变形。

**修复**：`COMPAT_FIXES.twitter` 为 `.tw-image-container` 和 `img` 设置固定 `height: 280px` + `overflow: hidden`。

#### 14.12 全平台预览宽度统一（v4.2）

**问题**：各平台预览 `max-width` 差距大（390px~800px），切换平台时视觉不统一。

**修复**：
- 所有平台根容器统一为 `max-width: 500px`
- 每个平台 CSS 末尾添加 `@media (max-width: 540px) { .xx-root { max-width: 100%; } }`
- 网页端折中宽度居中显示，手机端自动全宽

| 平台 | 修改前 | 修改后 |
|------|--------|--------|
| 小红书 | 390px | 500px |
| WhatsApp | 414px | 500px |
| iMessage | 414px | 500px |
| Instagram | 470px | 500px |
| X/Twitter | 598px | 500px |
| Reddit | 640px | 500px |
| YouTube | 800px | 500px |

#### 14.13 自动保存功能（v4.3）

**问题**：用户关闭页面后未手动保存的数据丢失。

**方案**：
- **独立 localStorage key**：`social-media-creator-autosave`，与手动保存的项目列表互不干扰
- **防抖监听**：`mounted()` 中通过 `this.$watch()` 监听 `projectData` + `universalData` 的 JSON 序列化，2 秒防抖写入
- **页面关闭前保存**：`window.addEventListener('beforeunload', ...)` 立即写入
- **启动时自动恢复**：检测 autosave key，有数据则恢复 `projectData`、`universalData`、`currentPlatform` 并提示
- **手动保存时清除 autosave**：`confirmSaveProject()` 成功后 `localStorage.removeItem('social-media-creator-autosave')`

```javascript
// 监听数据变化，2秒防抖保存
this.$watch(
    () => JSON.stringify(this.projectData) + JSON.stringify(this.universalData),
    () => { /* 防抖写入 localStorage */ },
    { deep: false }
);

// 关闭页面前立即保存
window.addEventListener('beforeunload', () => {
    localStorage.setItem(autoSaveKey, JSON.stringify({...}));
});
```
