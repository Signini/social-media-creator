/**
 * 综合页面编辑器组件
 */
const UniversalEditor = {
    name: 'universal-editor',
    props: ['universalData'],
    emits: ['update', 'export-complete'],
    template: `
    <div class="universal-layout">
        <aside class="universal-sidebar">
            <div class="section-title">📋 已添加模块 ({{ universalData.items.length }})</div>
            
            <div class="universal-item-list" v-if="universalData.items.length > 0">
                <div class="universal-item"
                    v-for="(item, idx) in universalData.items" :key="item.id"
                    draggable="true"
                    @dragstart="onDragStart(idx, $event)"
                    @dragover.prevent="onDragOver(idx, $event)"
                    @dragleave="onDragLeave(idx, $event)"
                    @drop="onDrop(idx, $event)"
                    @click="selectItem(idx)"
                    :class="{ 'drag-over': dragOverIndex === idx, 'selected': selectedIndex === idx }">
                    <div class="universal-item-handle">⋮⋮</div>
                    <div class="universal-item-info">
                        <span class="universal-item-icon">{{ getPlatformIcon(item.platform) }}</span>
                        <span class="universal-item-name">{{ getPlatformName(item.platform) }}</span>
                        <span class="universal-item-time">{{ item.addedAt }}</span>
                    </div>
                    <div class="universal-item-actions">
                        <button class="btn btn-small btn-outline" @click.stop="editItem(idx)" title="回到编辑器编辑此模块">✏️</button>
                        <button class="btn btn-small btn-danger" @click.stop="removeItem(idx)" title="删除此模块">✕</button>
                    </div>
                </div>
            </div>

            <div class="empty-state" v-else>
                <div style="font-size:48px;opacity:0.2;margin-bottom:12px;">📋</div>
                <p style="font-size:14px;color:#8e8e93;">暂无模块</p>
                <p style="font-size:12px;color:#aeaeb2;margin-top:4px;">在单平台编辑器中点击<br>"➕ 添加到综合页面"</p>
            </div>

            <div class="universal-sidebar-actions" v-if="universalData.items.length > 0">
                <button class="btn btn-danger" style="width:100%;" @click="clearAll">🗑️ 清空所有模块</button>
            </div>
        </aside>

        <section class="universal-preview-panel">
            <div class="universal-preview-toolbar">
                <span class="section-title" style="margin:0;">综合页面预览</span>
                <div class="preview-actions">
                    <button class="btn btn-primary" @click="exportHTML">📥 导出 HTML</button>
                    <button class="btn btn-secondary" @click="exportCompatible">📤 导出兼容 HTML</button>
                    <button class="btn btn-secondary" @click="copyHTML">📋 复制 HTML</button>
                </div>
            </div>
            <div class="universal-preview-scroll" ref="universalPreview">
                <div class="universal-preview" v-if="universalData.items.length > 0">
                    <div class="universal-preview-section"
                        v-for="(item, idx) in universalData.items" :key="item.id"
                        :ref="el => { if (el) sectionRefs[idx] = el }"
                        :class="{ 'preview-selected': selectedIndex === idx }">
                        <div class="universal-section-label">
                            <span>{{ getPlatformIcon(item.platform) }} {{ getPlatformName(item.platform) }}</span>
                            <span style="font-size:11px;color:#aeaeb2;">#{{ idx + 1 }}</span>
                        </div>
                        <instagram-preview v-if="item.platform === 'instagram'" :data="item.data"></instagram-preview>
                        <twitter-preview v-if="item.platform === 'twitter'" :data="item.data"></twitter-preview>
                        <reddit-preview v-if="item.platform === 'reddit'" :data="item.data"></reddit-preview>
                        <youtube-preview v-if="item.platform === 'youtube'" :data="item.data"></youtube-preview>
                        <imessage-preview v-if="item.platform === 'imessage'" :data="item.data"></imessage-preview>
                        <whatsapp-preview v-if="item.platform === 'whatsapp'" :data="item.data"></whatsapp-preview>
                        <xiaohongshu-preview v-if="item.platform === 'xiaohongshu'" :data="item.data"></xiaohongshu-preview>
                    </div>
                </div>
                <div class="empty-state" v-else style="padding:80px 20px;">
                    <div style="font-size:64px;opacity:0.15;margin-bottom:16px;">📄</div>
                    <p style="font-size:16px;color:#8e8e93;">添加模块后，这里会显示综合预览</p>
                </div>
            </div>
        </section>
    </div>
    `,
    data() {
        return {
            dragIndex: null,
            dragOverIndex: null,
            selectedIndex: -1,
            sectionRefs: {}
        };
    },
    methods: {
        getPlatformIcon(platformId) {
            const map = {
                xiaohongshu: '📕', instagram: '📸', twitter: '🐦', reddit: '🔴',
                youtube: '▶️', imessage: '💬', whatsapp: '📱'
            };
            return map[platformId] || '📱';
        },
        getPlatformName(platformId) {
            const map = {
                xiaohongshu: '小红书', instagram: 'Instagram',                 twitter: 'X', reddit: 'Reddit',
                youtube: 'YouTube', imessage: 'iMessage',
                whatsapp: 'WhatsApp'
            };
            return map[platformId] || platformId;
        },
        removeItem(idx) {
            const items = [...this.universalData.items];
            items.splice(idx, 1);
            this.$emit('update', { items });
        },
        editItem(idx) {
            this.$emit('edit-item', idx);
        },
        selectItem(idx) {
            this.selectedIndex = this.selectedIndex === idx ? -1 : idx;
            if (this.selectedIndex >= 0) {
                this.$nextTick(() => {
                    const el = this.sectionRefs[this.selectedIndex];
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                });
            }
        },
        clearAll() {
            if (confirm('确定清空所有模块吗？')) {
                this.$emit('update', { items: [] });
            }
        },
        onDragStart(idx, event) {
            this.dragIndex = idx;
            const el = event.target.closest('.universal-item');
            if (el) el.classList.add('dragging');
            event.dataTransfer.effectAllowed = 'move';
        },
        onDragOver(idx, event) {
            event.preventDefault();
            this.dragOverIndex = idx;
        },
        onDragLeave(idx, event) {
            this.dragOverIndex = null;
        },
        onDrop(idx, event) {
            event.preventDefault();
            this.dragOverIndex = null;
            if (this.dragIndex === null || this.dragIndex === idx) {
                this.dragIndex = null;
                return;
            }
            const items = [...this.universalData.items];
            const [moved] = items.splice(this.dragIndex, 1);
            items.splice(idx, 0, moved);
            this.dragIndex = null;
            this.$emit('update', { items });
        },
        exportHTML() {
            const previewEl = this.$refs.universalPreview;
            if (!previewEl) {
                this.$emit('export-complete', '❌ 没有可导出的内容');
                return;
            }
            try {
                const html = ExporterUtil.exportHTML(previewEl, 'universal');
                ExporterUtil.downloadHTML(html, 'social-media-universal.html');
                this.$emit('export-complete', '📥 综合页面已导出！');
            } catch (e) {
                console.error('导出失败:', e);
                this.$emit('export-complete', '❌ 导出失败：' + e.message);
            }
        },
        exportCompatible() {
            const previewEl = this.$refs.universalPreview;
            if (!previewEl) {
                this.$emit('export-complete', '❌ 没有可导出的内容');
                return;
            }
            try {
                const html = ExporterUtil.exportCompatibleHTML(previewEl, 'universal');
                ExporterUtil.downloadText(html, 'social-media-universal-compatible.html');
                this.$emit('export-complete', '📥 兼容 HTML 已下载！');
            } catch (e) {
                console.error('导出失败:', e);
                this.$emit('export-complete', '❌ 导出失败：' + e.message);
            }
        },
        async copyHTML() {
            const previewEl = this.$refs.universalPreview;
            if (!previewEl) {
                this.$emit('export-complete', '❌ 没有可复制的内容');
                return;
            }
            try {
                const html = ExporterUtil.copyHTMLFragment(previewEl, 'universal');
                await navigator.clipboard.writeText(html);
                this.$emit('export-complete', '📋 HTML 已复制到剪贴板！');
            } catch (e) {
                try {
                    const html = ExporterUtil.copyHTMLFragment(previewEl, 'universal');
                    const textarea = document.createElement('textarea');
                    textarea.value = html;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    this.$emit('export-complete', '📋 HTML 已复制到剪贴板！');
                } catch (e2) {
                    this.$emit('export-complete', '❌ 复制失败');
                }
            }
        }
    }
};
