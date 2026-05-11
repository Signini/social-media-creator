/**
 * HTML 导出引擎
 * 使用内嵌 CSS 字符串（完全兼容 file:// 协议）
 */
const ExporterUtil = {

    ALLOWED_TAGS: new Set([
        'a','abbr','acronym','address','b','big','blockquote','br','caption','center',
        'cite','code','col','colgroup','dd','del','details','div','dl','dt','em',
        'figcaption','figure','h1','h2','h3','h4','h5','h6','hr','i','img','ins',
        'kbd','li','ol','p','pre','q','rp','rt','ruby','s','samp','small','span',
        'strike','strong','sub','summary','sup','table','tbody','td','tfoot','th',
        'thead','tr','tt','u','ul','var'
    ]),

    ALLOWED_ATTRS: new Set([
        'align','alt','axis','class','height','href','name','src','title','width'
    ]),

    SVG_REPLACEMENTS: [
        { path: 'M20.396', text: '✓' },
        { path: 'M12 4L4 12h5v8h6v-8h5z', text: '▲' },
        { path: 'M12 20l8-8h-5V4H9v8H4z', text: '▼' },
        { path: 'M1.751 10c0-4.42', text: '💬' },
        { path: 'M20 2H4c-1.1', text: '💬' },
        { path: 'M4.5 3.88l4.432', text: '🔄' },
        { path: 'M20.884 13.19c-1.351', text: '❤️' },
        { path: 'M12 21.35l-1.45', text: '❤️' },
        { path: 'M12 2.59l5.7', text: '📤' },
        { path: 'M8.75 21V3h2', text: '📊' },
        { path: 'M18 16.08c-.76', text: '🔗' },
        { path: 'M17 3H7c-1.1', text: '🔖' },
        { path: 'M15 18l-6-6', text: '←' },
        { path: 'M2.01 21L23 12', text: '➤' },
        { path: 'M12 5V1L7', text: '↩' },
        { path: 'M16.5 6H11', text: '↗' },
    ],

    BLOCKED_CSS_PROPS: [
        'backdrop-filter', '-webkit-overflow-scrolling',
        '-webkit-font-smoothing', '-moz-osx-font-smoothing', '-webkit-appearance',
        '-webkit-tap-highlight-color', '-webkit-touch-callout', '-webkit-text-size-adjust',
        '-webkit-mask', '-webkit-clip-path', 'clip-path', 'image-rendering',
        'scroll-behavior', 'overscroll-behavior', 'touch-action',
        'cursor', 'fill', 'stroke-width', 'pointer-events', 'user-select',
        'resize', 'content',
        'object-fit', 'object-position', 'aspect-ratio',
        'animation', 'animation-delay', 'animation-direction', 'animation-duration',
        'animation-fill-mode', 'animation-iteration-count', 'animation-name',
        'animation-play-state', 'animation-timing-function'
    ],

    SVG_RULE_SELECTORS: [
        /\s*svg\s*\{[^}]*\}/gi,
        /\s*[\w\-.#:\[\]="'>+\s~]+\s+svg\s*\{[^}]*\}/gi,
        /\s*[\w\-.#:\[\]="'>+\s~]+:hover\s+svg\s*\{[^}]*\}/gi,
    ],

    getExportBaseCSS() {
        return `
*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
    -webkit-font-smoothing: antialiased;
    line-height: 1.5;
}
img { max-width: 100%; }
`;
    },

    getCompatibleBaseCSS() {
        return `
.social-media-export {
    max-width: 620px;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #1d1d1f;
}
.social-media-export * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.social-media-export img {
    max-width: 100%;
    height: auto;
}
`;
    },

    _cleanCSS(css) {
        css = css.replace(/\/\*[\s\S]*?\*\//g, '');

        css = css.replace(/@keyframes\s+[\w-]+\s*\{[^}]*\}/gi, '');
        css = css.replace(/@keyframes\s+[\w-]+\s*\{[\s\S]*?\n\}/gi, '');
        css = css.replace(/@keyframes\s+[\w-]+\s*\{[\s\S]*?\}\s*\}/gi, '');

        css = css.replace(/^\s*stroke\s*:[^;]+;/gim, '\n');

        // Remove HD preview rules entirely (SVG-based, not compatible)
        css = css.replace(/[^{}\n]*\.preview-hd[^{\n]*\{[^}]*\}/gi, '');

        for (const prop of this.BLOCKED_CSS_PROPS) {
            const escaped = prop.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            css = css.replace(new RegExp('^\\s*' + escaped + '\\s*:[^;]*;', 'gim'), '\n');
        }

        // Replace calc(X% - Ypx) with just X% for AO3 compatibility
        css = css.replace(/calc\(\s*([\d.]+%)\s*[-+]\s*[\d.]+(?:px|em|rem)\s*\)/gi, '$1');

        css = css.replace(/[^{}\n]*svg[^{\n]*\{[^}]*\}/gi, '');

        css = css.replace(/[^{}\n]*::(?:before|after|placeholder|-webkit-scrollbar|-webkit-scrollbar-track|-webkit-scrollbar-thumb)\s*\{[^}]*\}/gi, '');

        css = css.replace(/[^{}\n]*:hover[^{\n]*\{[^}]*\}/gi, '');

        css = css.replace(/[^{}\n]*nth-child[^{\n]*\{[^}]*\}/gi, '');

        // Thoroughly remove empty rules (including multi-line and complex selectors)
        css = css.replace(/[^{}]+\{\s*\}/g, '');
        for (let i = 0; i < 3; i++) {
            css = css.replace(/[^{}]+\{[\s\n]*\}/g, '');
        }

        css = css.replace(/\n\s*\n\s*\n/g, '\n');

        return css.trim();
    },

    _collectCSS(platform) {
        let css = this.getExportBaseCSS() + '\n';

        if (platform === 'universal') {
            for (const p of Object.keys(PlatformCSS)) {
                css += PlatformCSS[p] + '\n';
            }
            css += `
.universal-export-container {
    max-width: 620px;
    margin: 0 auto;
    padding: 24px 0;
    background: #f5f5f7;
}
.universal-export-container > section {
    margin-bottom: 32px;
}
.universal-export-container > section:last-child {
    margin-bottom: 0;
}
`;
        } else if (PlatformCSS[platform]) {
            css += PlatformCSS[platform] + '\n';
        }

        return css;
    },

    COMPAT_FIXES: {
        instagram: `
.ig-image-container { width: 100%; max-height: 470px; overflow: hidden; }
.ig-image-container img { width: 100%; height: auto; }
`,
        twitter: `
.tw-image-container { overflow: hidden; }
.tw-image-container img { width: 100%; height: auto; }
.tw-quote-image { max-height: 200px; }
.tw-quote-image img { width: 100%; height: auto; display: block; }
`,
        youtube: `
.yt-player { height: 338px; }
.yt-player img { max-height: 338px; }
.yt-player-placeholder { height: 338px; }
.yt-comment > .yt-comment-avatar-placeholder { margin-right: 12px; flex-shrink: 0; }
.yt-comment > .yt-comment-avatar { margin-right: 12px; flex-shrink: 0; }
.yt-comment > .yt-comment-content { flex: 1; min-width: 0; }
`,
        imessage: `
.msg-messages { height: auto; }
`,
        whatsapp: `
.wa-messages { height: auto; }
.wa-bubble-image img { max-height: 400px; }
`,
        wechat: `
.wx-messages { height: auto; }
.wx-bubble-image img { max-height: 400px; }
`,
        qq: `
.qq-messages { height: auto; }
.qq-bubble-image img { max-height: 400px; }
`,
        reddit: `
.rd-post-image img { max-height: 600px; }
`,
        xiaohongshu: `
.xhs-image-area { width: 100%; max-height: 520px; overflow: hidden; }
.xhs-image-area img { width: 100%; height: auto; }
`,
        wechatMoments: `
.wm-img-item img { max-height: 200px; }
`
    },

    _collectCompatibleCSS(platform) {
        let css = this.getCompatibleBaseCSS() + '\n';

        if (platform === 'universal') {
            for (const p of Object.keys(PlatformCSS)) {
                css += PlatformCSS[p] + '\n';
            }
        } else if (PlatformCSS[platform]) {
            css += PlatformCSS[platform] + '\n';
        }

        css = this._cleanCSS(css);

        if (platform === 'universal') {
            for (const p of Object.keys(this.COMPAT_FIXES)) {
                css += this.COMPAT_FIXES[p] + '\n';
            }
        } else if (this.COMPAT_FIXES[platform]) {
            css += this.COMPAT_FIXES[platform] + '\n';
        }

        return css;
    },

    _extractInlineStyles(rootEl) {
        const styleMap = {};
        let idx = 0;
        const elements = rootEl.querySelectorAll('[style]');
        for (const el of elements) {
            const style = el.getAttribute('style') || '';
            const props = {};
            const regex = /(?:^|;)\s*([\w-]+)\s*:\s*([^;]+)/g;
            let m;
            while ((m = regex.exec(style)) !== null) {
                const prop = m[1].trim().toLowerCase();
                let val = m[2].trim();
                if (!val) continue;
                val = val.replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/gi, function(_, r, g, b) {
                    return '#' + [r, g, b].map(function(c) { return parseInt(c).toString(16).padStart(2, '0'); }).join('');
                });
                props[prop] = val;
            }
            if (Object.keys(props).length === 0) continue;
            const key = JSON.stringify(props);
            if (!styleMap[key]) {
                styleMap[key] = 'xc' + idx;
                idx++;
            }
            const cls = styleMap[key];
            el.removeAttribute('style');
            const existing = el.getAttribute('class') || '';
            el.setAttribute('class', (existing + ' ' + cls).trim());
        }
        let css = '';
        for (const [key, cls] of Object.entries(styleMap)) {
            const props = JSON.parse(key);
            let rule = '.' + cls + ' { ';
            for (const [prop, val] of Object.entries(props)) {
                rule += prop + ': ' + val + '; ';
            }
            rule += '}\n';
            css += rule;
        }
        return css;
    },

    _replaceSVG(svgEl) {
        const classes = svgEl.getAttribute('class') || '';
        if (classes.includes('-hd-icon')) {
            return document.createTextNode('');
        }
        const pathEl = svgEl.querySelector('path');
        if (pathEl) {
            const d = pathEl.getAttribute('d') || '';
            for (const rep of this.SVG_REPLACEMENTS) {
                if (d.startsWith(rep.path)) {
                    return document.createTextNode(rep.text);
                }
            }
        }
        const html = svgEl.innerHTML || '';
        if (html.includes('circle')) return document.createTextNode('⋯');
        return document.createTextNode('');
    },

    _sanitizeNode(node) {
        if (node.nodeType === Node.TEXT_NODE) return node.cloneNode(true);

        if (node.nodeType !== Node.ELEMENT_NODE) return null;

        const tag = node.tagName.toLowerCase();

        if (tag === 'svg') {
            return this._replaceSVG(node);
        }

        if (!this.ALLOWED_TAGS.has(tag)) {
            const frag = document.createDocumentFragment();
            for (const child of node.childNodes) {
                const sanitized = this._sanitizeNode(child);
                if (sanitized) frag.appendChild(sanitized);
            }
            return frag;
        }

        const clean = document.createElement(tag);

        for (const attr of node.attributes) {
            if (this.ALLOWED_ATTRS.has(attr.name)) {
                clean.setAttribute(attr.name, attr.value);
            }
        }

        for (const child of node.childNodes) {
            const sanitized = this._sanitizeNode(child);
            if (sanitized) clean.appendChild(sanitized);
        }

        return clean;
    },

    _sanitizeHTML(htmlString) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = htmlString;
        const clean = document.createElement('div');
        for (const child of wrapper.childNodes) {
            const sanitized = this._sanitizeNode(child);
            if (sanitized) clean.appendChild(sanitized);
        }
        return clean.innerHTML;
    },

    exportHTML(previewElement, platform) {
        if (!previewElement) {
            throw new Error('没有可导出的内容');
        }

        const content = previewElement.cloneNode(true);
        content.querySelectorAll('[data-v-]').forEach(el => {
            el.removeAttribute('data-v-');
        });

        const css = this._collectCSS(platform);

        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>社交媒体内容</title>
    <style>
${css}
    </style>
</head>
<body style="margin:0; padding:20px; background:#f5f5f7; display:flex; justify-content:center; align-items:flex-start; min-height:100vh;">
    <div style="max-width:620px; width:100%;">
${content.innerHTML}
    </div>
</body>
</html>`;
    },

    exportCompatibleHTML(previewElement, platform) {
        if (!previewElement) {
            throw new Error('没有可导出的内容');
        }

        const content = previewElement.cloneNode(true);
        content.querySelectorAll('[data-v-]').forEach(el => {
            el.removeAttribute('data-v-');
        });

        const extractedCSS = this._cleanCSS(this._extractInlineStyles(content));

        let previewStyleCSS = '';
        content.querySelectorAll('style').forEach(styleEl => {
            const text = (styleEl.textContent || '').trim();
            if (text) previewStyleCSS += text + '\n';
            styleEl.remove();
        });
        previewStyleCSS = this._cleanCSS(previewStyleCSS);

        content.querySelectorAll('img').forEach(img => {
            const src = img.getAttribute('src') || '';
            if (src.startsWith('data:')) {
                const span = document.createElement('span');
                span.textContent = '[图片]';
                span.setAttribute('class', '_img-placeholder');
                img.parentNode.replaceChild(span, img);
            } else {
                // Remove browser-injected fixed width/height to let CSS control sizing
                img.removeAttribute('width');
                img.removeAttribute('height');
            }
        });

        const imgPlaceholderCSS = content.querySelector('._img-placeholder')
            ? '\n._img-placeholder { display: inline-block; padding: 8px 16px; background: #f0f0f0; border-radius: 4px; color: #666; font-size: 13px; }\n'
            : '';

        const cleanHTML = this._sanitizeHTML(content.innerHTML);
        const css = this._collectCompatibleCSS(platform);

        return `<!-- 社交媒体内容 - 兼容模式 -->
<!-- HTML 部分：粘贴到平台的 HTML 编辑器 -->
<!-- CSS 部分：粘贴到平台的自定义 CSS 区域 -->

<style>
${css}
${extractedCSS}${previewStyleCSS}${imgPlaceholderCSS}</style>

<div class="social-media-export">
${cleanHTML}
</div>`;
    },

    copyHTMLFragment(previewElement, platform) {
        if (!previewElement) return '';
        const content = previewElement.cloneNode(true);
        const css = this._collectCSS(platform);

        return `<div style="max-width:620px; margin:0 auto;">
<style>
${css}
</style>
${content.innerHTML}
</div>`;
    },

    downloadHTML(htmlContent, filename) {
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'social-media-content.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    downloadText(textContent, filename) {
        const blob = new Blob(['\uFEFF' + textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};
