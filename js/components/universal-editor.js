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
            <div class="section-title">📋 {{ $t('uni.addedModules') }} ({{ universalData.items.length }})</div>

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
                    <input type="checkbox" class="universal-item-check"
                        :checked="checkedIds.has(item.id)"
                        @click.stop
                        @change="toggleCheck(item.id)">
                    <div class="universal-item-handle">⋮⋮</div>
                    <div class="universal-item-info">
                        <span class="universal-item-icon">{{ getPlatformIcon(item.platform) }}</span>
                        <span class="universal-item-name">{{ getPlatformName(item.platform) }}</span>
                        <span class="universal-item-time">{{ item.addedAt }}</span>
                    </div>
                    <div class="universal-item-actions">
                        <button class="btn btn-small btn-outline" @click.stop="editItem(idx)" :title="$t('uni.editModule')">✏️</button>
                        <button class="btn btn-small btn-danger" @click.stop="removeItem(idx)" :title="$t('uni.deleteModule')">✕</button>
                    </div>
                </div>
            </div>

            <div class="empty-state" v-else>
                <div style="font-size:48px;opacity:0.2;margin-bottom:12px;">📋</div>
                <p style="font-size:14px;color:#8e8e93;">{{ $t('uni.noModules') }}</p>
                <p style="font-size:12px;color:#aeaeb2;margin-top:4px;">{{ $t('uni.hintPrefix') }}<br>"{{ $t('uni.hintButton') }}"</p>
            </div>

            <div class="universal-sidebar-actions" v-if="universalData.items.length > 0">
                <div class="universal-check-actions">
                    <button class="btn btn-small btn-outline" @click="checkAll">{{ $t('uni.selectAll') }}</button>
                    <button class="btn btn-small btn-outline" @click="uncheckAll">{{ $t('uni.deselectAll') }}</button>
                    <span class="universal-check-count" v-if="universalData.items.length > 0">{{ $t('uni.selected') }} {{ checkedCount }}/{{ universalData.items.length }}</span>
                </div>
                <button class="btn btn-danger" style="width:100%;" @click="clearAll">{{ $t('uni.clearAll') }}</button>
            </div>
        </aside>

        <section class="universal-preview-panel">
            <div class="universal-preview-toolbar">
                <span class="section-title" style="margin:0;">{{ $t('uni.preview') }}</span>
                <div class="preview-actions">
                    <button class="btn btn-primary" @click="exportHTML">{{ $t('uni.exportHTML') }}</button>
                    <button class="btn btn-secondary" @click="exportCompatible">{{ $t('uni.exportCompat') }}<span v-if="checkedCount < universalData.items.length" style="opacity:0.7;font-size:11px;"> ({{ checkedCount }}/{{ universalData.items.length }})</span></button>
                    <button class="btn btn-secondary" @click="copyHTML">{{ $t('uni.copyHTML') }}</button>
                    <button class="btn btn-secondary" @click="exportImages">{{ $t('uni.batchExport') }}</button>
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
                        <wechat-preview v-if="item.platform === 'wechat'" :data="item.data"></wechat-preview>
                        <qq-preview v-if="item.platform === 'qq'" :data="item.data"></qq-preview>
                        <wechat-moments-preview v-if="item.platform === 'wechatMoments'" :data="item.data"></wechat-moments-preview>
                        <xiaohongshu-preview v-if="item.platform === 'xiaohongshu'" :data="item.data"></xiaohongshu-preview>
                    </div>
                </div>
                <div class="empty-state" v-else style="padding:80px 20px;">
                    <div style="font-size:64px;opacity:0.15;margin-bottom:16px;">📄</div>
                    <p style="font-size:16px;color:#8e8e93;">{{ $t('uni.emptyPreview') }}</p>
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
            sectionRefs: {},
            checkedIds: new Set()
        };
    },
    mounted() {
        this.syncAllChecked();
    },
    computed: {
        checkedCount() {
            return this.universalData.items.filter(item => this.checkedIds.has(item.id)).length;
        }
    },
    watch: {
        'universalData.items': {
            handler(items) {
                const currentIds = new Set(items.map(i => i.id));
                const updated = new Set();
                for (const id of this.checkedIds) {
                    if (currentIds.has(id)) updated.add(id);
                }
                items.forEach(item => updated.add(item.id));
                this.checkedIds = updated;
            },
            deep: true
        }
    },
    methods: {
        getPlatformIcon(platformId) {
            const map = {
                xiaohongshu: '📕', instagram: '📸', twitter: '🐦', reddit: '🔴',
                youtube: '▶️', imessage: '💬', whatsapp: '📱', wechat: '💚',
                qq: '🐧', wechatMoments: '🔄'
            };
            return map[platformId] || '📱';
        },
        getPlatformName(platformId) {
            return this.$t('platform.' + platformId);
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
        toggleCheck(id) {
            if (this.checkedIds.has(id)) {
                this.checkedIds.delete(id);
            } else {
                this.checkedIds.add(id);
            }
            this.checkedIds = new Set(this.checkedIds);
        },
        syncAllChecked() {
            this.checkedIds = new Set((this.universalData.items || []).map(i => i.id));
        },
        checkAll() {
            this.syncAllChecked();
        },
        uncheckAll() {
            this.checkedIds = new Set();
        },
        clearAll() {
            if (confirm(this.$t('uni.confirmClear'))) {
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
                this.$emit('export-complete', this.$t('uni.noExportContent'));
                return;
            }
            try {
                const html = ExporterUtil.exportHTML(previewEl, 'universal');
                ExporterUtil.downloadHTML(html, 'social-media-universal.html');
                this.$emit('export-complete', this.$t('uni.exportSuccess'));
            } catch (e) {
                console.error('导出失败:', e);
                this.$emit('export-complete', this.$t('uni.exportFailed') + e.message);
            }
        },
        exportCompatible() {
            const previewEl = this.$refs.universalPreview;
            if (!previewEl) {
                this.$emit('export-complete', this.$t('uni.noExportContent'));
                return;
            }
            try {
                const excludeIndices = [];
                this.universalData.items.forEach((item, idx) => {
                    if (!this.checkedIds.has(item.id)) excludeIndices.push(idx);
                });
                const html = ExporterUtil.exportCompatibleHTML(previewEl, 'universal', { excludeIndices });
                ExporterUtil.downloadText(html, 'social-media-universal-compatible.html');
                this.$emit('export-complete', this.$t('uni.exportSuccess'));
            } catch (e) {
                console.error('导出失败:', e);
                this.$emit('export-complete', this.$t('uni.exportFailed') + e.message);
            }
        },
        async copyHTML() {
            const previewEl = this.$refs.universalPreview;
            if (!previewEl) {
                this.$emit('export-complete', this.$t('uni.noCopyContent'));
                return;
            }
            try {
                const html = ExporterUtil.copyHTMLFragment(previewEl, 'universal');
                await navigator.clipboard.writeText(html);
                this.$emit('export-complete', this.$t('uni.copySuccess'));
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
                    this.$emit('export-complete', this.$t('uni.copySuccess'));
                } catch (e2) {
                    this.$emit('export-complete', this.$t('uni.copyFailed'));
                }
            }
        },
        async exportImages() {
            if (typeof html2canvas === 'undefined') {
                this.$emit('export-complete', this.$t('uni.noHtml2canvas'));
                return;
            }
            const items = this.universalData.items;
            if (!items || items.length === 0) {
                this.$emit('export-complete', this.$t('uni.noExportContent'));
                return;
            }
            this.$emit('export-complete', this.$t('uni.generating') + ' (0/' + items.length + ')...');
            const pad = String(items.length).length;
            for (let i = 0; i < items.length; i++) {
                const sectionEl = this.sectionRefs[i];
                if (!sectionEl) continue;
                this.$emit('export-complete', this.$t('uni.generating') + ' (' + (i + 1) + '/' + items.length + ')...');
                try {
                    const wasHd = sectionEl.classList.contains('preview-hd');
                    if (!wasHd) sectionEl.classList.add('preview-hd');

                    // Expand chat containers to show all messages
                    const scrollContainers = sectionEl.querySelectorAll('.msg-messages, .wa-messages, .qq-messages, .wx-messages');
                    const savedStyles = [];
                    scrollContainers.forEach(el => {
                        savedStyles.push({
                            el,
                            maxHeight: el.style.maxHeight,
                            overflow: el.style.overflow
                        });
                        el.style.maxHeight = 'none';
                        el.style.overflow = 'visible';
                    });

                    const canvas = await html2canvas(sectionEl, {
                        backgroundColor: null,
                        scale: 2,
                        useCORS: true,
                        logging: false
                    });

                    // Restore chat container styles
                    savedStyles.forEach(({ el, maxHeight, overflow }) => {
                        el.style.maxHeight = maxHeight;
                        el.style.overflow = overflow;
                    });

                    if (!wasHd) sectionEl.classList.remove('preview-hd');

                    const platformName = this.getPlatformName(items[i].platform);
                    const num = String(i + 1).padStart(pad, '0');
                    const link = document.createElement('a');
                    link.download = num + '-' + platformName + '.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                } catch (e) {
                    console.error('导出图片失败:', e);
                    if (sectionEl.classList.contains('preview-hd') && !sectionEl.dataset.wasHd) {
                        sectionEl.classList.remove('preview-hd');
                    }
                }
            }
            this.$emit('export-complete', this.$t('uni.exported') + ' ' + items.length + ' ' + this.$t('uni.images') + '!');
        }
    }
};
