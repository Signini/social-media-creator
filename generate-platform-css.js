const fs = require('fs');
const path = require('path');

const platforms = ['instagram', 'twitter', 'reddit', 'youtube', 'imessage', 'whatsapp', 'xiaohongshu'];
const cssDir = path.join(__dirname, 'css');
const outFile = path.join(__dirname, 'js', 'utils', 'platform-css.js');

const entries = [];
for (const p of platforms) {
    const cssFile = path.join(cssDir, `platform-${p}.css`);
    const css = fs.readFileSync(cssFile, 'utf-8');
    const escaped = css.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
    entries.push(`    ${p}: "${escaped}"`);
}

const content = `/**
 * 平台 CSS 字符串（用于 HTML 导出）
 * 由构建脚本自动生成
 */
const PlatformCSS = {
${entries.join(',\n')}
};
`;

fs.writeFileSync(outFile, content, 'utf-8');
console.log('✅ platform-css.js 已生成');
