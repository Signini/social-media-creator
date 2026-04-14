# 社交媒体内容创作器 - 项目设计文档

## 1. 项目概述

一个纯前端社交媒体内容创作器，支持 5 个平台的模拟编辑与预览，可将多个平台内容组合为长篇社媒文章并导出。

- **运行方式**：直接用浏览器打开 `index.html`，无需服务器（兼容 `file://` 协议）
- **技术栈**：Vue 3（CDN/本地）、原生 JS、CSS3、HTML5 Drag & Drop
- **设计目标**：在完全离线环境下工作，导出 HTML 在目标发布平台保持格式

---

## 2. 目录结构

```
social-media-creator/
├── index.html                          # 主应用入口
├── css/
│   ├── app.css                         # 编辑器/预览面板/表单/弹窗样式
│   ├── platform-instagram.css          # Instagram 预览样式（.ig-* 前缀）
│   ├── platform-twitter.css            # X 预览样式（.tw-* 前缀）
│   ├── platform-reddit.css             # Reddit 预览样式（.rd-* 前缀）
│   ├── platform-youtube.css            # YouTube 预览样式（.yt-* 前缀）
│   └── platform-imessage.css           # iMessage 预览样式（.msg-* 前缀）
├── js/
│   ├── app.js                          # Vue 应用主逻辑、数据、方法
│   ├── vendor/
│   │   └── vue.global.prod.js          # Vue 3 本地副本（v3.5.32）
│   ├── platforms/
│   │   ├── instagram.js                # InstagramEditor + InstagramPreview
│   │   ├── twitter.js                  # TwitterEditor + TwitterPreview
│   │   ├── reddit.js                   # RedditEditor + RedditPreview
│   │   ├── youtube.js                  # YouTubeEditor + YouTubePreview
│   │   └── imessage.js                 # iMessageEditor + iMessagePreview
│   ├── components/
│   │   └── universal-editor.js         # 综合页面编辑器组件
│   └── utils/
│       ├── storage.js                  # LocalStorage 操作工具
│       ├── image.js                    # 图片上传/压缩/Base64 工具
│       ├── exporter.js                 # HTML 导出引擎（普通+兼容模式）
│       └── platform-css.js             # 所有平台 CSS 内嵌为 JS 字符串（自动生成）
```

---

## 3. 架构设计

### 3.1 加载顺序（index.html）

```html
<!-- 1. CSS -->
<link rel="stylesheet" href="css/app.css">
<link rel="stylesheet" href="css/platform-*.css">  ×5

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
        username, verified, location, avatar, imageUrl,
        likes, caption, showAllCaption, timestamp,
        comments: [{ username, text, likes }],
        imageWidth, imageHeight
    },
    twitter: {
        displayName, username, verified, avatar, content, imageUrl,
        timestamp, replies, retweets, likes, views, bookmarks,
        isThread, threadTweets: [],
        comments: [{ username, text, likes, avatar }]
    },
    reddit: {
        subreddit, author, flair, flairColor,
        title, body, imageUrl,
        upvotes, downvotes, commentCount, awards: [],
        timeAgo,
        comments: [{
            author, text, upvotes, timeAgo,
            replies: [{ author, text, upvotes, timeAgo }]
        }]
    },
    youtube: {
        title, thumbnail, channelName, channelAvatar, subscribers,
        views, dateText, likes, dislikes, description,
        commentsCount,
        comments: [{ author, text, likes, timeAgo, isPinned }]
    },
    imessage: {
        contactName, contactAvatar,
        showTyping, showReadReceipt, readReceiptText,
        timeSeparator, dateSeparator,
        messages: [{ id, type:'sent'|'received', text, image, time, reaction }]
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
    version: '2.0',
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
| `style=""` 属性 | 移除 |
| `<style>` 标签 | 移除（CSS 放在独立区域） |
| `<input>`/`<button>`/`<label>` | 移除标签保留文本 |
| `<svg>` 内的 `<circle>` | 替换为 `⋯` |
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
node -e "
const fs = require('fs');
const dir = 'css';
const platforms = ['instagram', 'twitter', 'reddit', 'youtube', 'imessage'];
let js = '/**\n * 平台 CSS 字符串（用于 HTML 导出）\n * 由构建脚本自动生成\n */\nconst PlatformCSS = {\n';
for (const p of platforms) {
    const css = fs.readFileSync(dir + '/platform-' + p + '.css', 'utf8');
    js += '    ' + p + ': ' + JSON.stringify(css) + ',\n';
}
js += '};\n';
fs.writeFileSync('js/utils/platform-css.js', js);
"
```

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

| platformId | 显示名 | 图标 |
|------------|--------|------|
| instagram | Instagram | 📸 |
| twitter | X | 🐦 |
| reddit | Reddit | 🔴 |
| youtube | YouTube | ▶️ |
| imessage | iMessage | 💬 |

名称映射在两处维护：
- `app.js` → `platforms` 数组
- `js/components/universal-editor.js` → `getPlatformName()` 方法
