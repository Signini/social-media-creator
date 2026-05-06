/**
 * Instagram 平台模块 - 编辑器 + 预览组件
 */

// 默认数据模型
const InstagramDefaults = {
    username: 'zhangsan_design',
    verified: true,
    location: '北京·三里屯',
    avatar: '',
    avatarUrl: '',
    imageUrl: '',
    imageUrlExt: '',
    likes: 1024,
    caption: '今天的三里屯太美了 ✨ #北京 #三里屯 #日常分享',
    showAllCaption: false,
    timestamp: '2小时前',
    comments: [
        { username: 'lisi_photo', text: '拍得真好看！', likes: 12, replies: [] },
        { username: 'wangwu_art', text: '这个角度绝了 🔥', likes: 5, replies: [] }
    ],
    imageWidth: 1080,
    imageHeight: 1080
};

// Instagram 编辑器组件
const InstagramEditor = {
    name: 'instagram-editor',
    props: ['data'],
    emits: ['update'],
    template: `
    <div class="instagram-editor">
        <!-- 用户信息 -->
        <div class="sub-title">👤 用户信息</div>
        <div class="form-group">
            <label>头像</label>
            <div class="image-upload" :class="{ 'has-image': data.avatar }" @click="triggerUpload('avatar')">
                <template v-if="data.avatar">
                    <img :src="data.avatar" alt="avatar">
                    <button class="remove-image" @click.stop="removeImage('avatar')">✕</button>
                </template>
                <div v-else class="upload-placeholder">
                    <span>📷</span>
                    <small>点击上传头像</small>
                </div>
            </div>
            <input type="file" ref="avatarInput" accept="image/*" @change="handleUpload($event, 'avatar')" hidden>
            <div class="ext-url-row">
                <span class="ext-url-label">🔗</span>
                <input class="form-input ext-url-input" :value="data.avatarUrl" @input="updateField('avatarUrl', $event.target.value)" placeholder="外部图片链接（AO3导出用）">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>用户名</label>
                <input class="form-input" :value="data.username" @input="updateField('username', $event.target.value)" placeholder="用户名">
            </div>
            <div class="form-group" style="flex: 0 0 auto;">
                <label>认证</label>
                <div class="toggle-group" style="margin-top:6px;">
                    <label class="toggle">
                        <input type="checkbox" :checked="data.verified" @change="updateField('verified', $event.target.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                    <span style="font-size:13px;">蓝V</span>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>位置</label>
            <input class="form-input" :value="data.location" @input="updateField('location', $event.target.value)" placeholder="地理位置（可选）">
        </div>

        <div class="section-divider"></div>

        <!-- 图片 -->
        <div class="sub-title">🖼️ 帖子图片</div>
        <div class="form-group">
            <div class="image-upload" :class="{ 'has-image': data.imageUrl }" @click="triggerUpload('image')">
                <template v-if="data.imageUrl">
                    <img :src="data.imageUrl" alt="post image">
                    <button class="remove-image" @click.stop="removeImage('imageUrl')">✕</button>
                </template>
                <div v-else class="upload-placeholder">
                    <span>📷</span>
                    <small>点击上传图片（建议 1:1 正方形）</small>
                </div>
            </div>
            <input type="file" ref="imageInput" accept="image/*" @change="handleUpload($event, 'imageUrl')" hidden>
            <div class="ext-url-row">
                <span class="ext-url-label">🔗</span>
                <input class="form-input ext-url-input" :value="data.imageUrlExt" @input="updateField('imageUrlExt', $event.target.value)" placeholder="外部图片链接（AO3导出用）">
            </div>
        </div>

        <div class="section-divider"></div>

        <!-- 内容 -->
        <div class="sub-title">📝 帖子内容</div>
        <div class="form-group">
            <label>文案</label>
            <textarea class="form-input" :value="data.caption" @input="updateField('caption', $event.target.value)" rows="4" placeholder="写点什么..."></textarea>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>点赞数</label>
                <div class="number-input-group">
                    <button @click="adjustNumber('likes', -1)">−</button>
                    <input :value="formatNumber(data.likes)" @input="updateField('likes', parseNumber($event.target.value))">
                    <button @click="adjustNumber('likes', 1)">+</button>
                </div>
            </div>
            <div class="form-group">
                <label>时间</label>
                <input class="form-input" :value="data.timestamp" @input="updateField('timestamp', $event.target.value)" placeholder="如: 2小时前">
            </div>
        </div>

        <div class="section-divider"></div>

        <!-- 评论 -->
        <div class="sub-title">💬 评论区 <span class="hint">({{ data.comments.length }}条)</span></div>
        <div class="comment-list">
            <div class="comment-item" v-for="(comment, idx) in data.comments" :key="idx"
                draggable="true"
                @dragstart="onDragStart(comment, idx, $event)"
                @dragover.prevent="onDragOver(comment, idx, $event)"
                @dragleave="onDragLeave(comment, idx, $event)"
                @drop="onDrop(comment, idx, $event)">
                <div class="drag-handle">⋮⋮</div>
                <div class="comment-header">
                    <span>@{{ comment.username }}</span>
                    <button class="remove-comment" @click="removeComment(idx)">✕</button>
                </div>
                <div class="form-group" style="margin-bottom:8px;">
                    <input class="form-input" :value="comment.username" @input="updateComment(idx, 'username', $event.target.value)" placeholder="用户名" style="font-size:13px;">
                </div>
                <div class="form-group" style="margin-bottom:8px;">
                    <input class="form-input" :value="comment.text" @input="updateComment(idx, 'text', $event.target.value)" placeholder="评论内容" style="font-size:13px;">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size:12px;">点赞</label>
                    <div class="number-input-group">
                        <button @click="adjustCommentLikes(idx, -1)">−</button>
                        <input :value="comment.likes" @input="updateComment(idx, 'likes', parseInt($event.target.value)||0)">
                        <button @click="adjustCommentLikes(idx, 1)">+</button>
                    </div>
                    <!-- 嵌套回复 -->
                    <div style="margin-top:10px;padding-left:14px;border-left:2px solid #e9ecef;">
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                            <span style="font-size:12px;font-weight:600;color:#8e8e93;">↳ 回复 ({{ (comment.replies || []).length }})</span>
                            <button style="font-size:11px;color:#007aff;background:none;border:none;cursor:pointer;padding:2px 6px;" @click="addReply(idx)">+ 添加回复</button>
                        </div>
                        <div v-for="(reply, rIdx) in (comment.replies || [])" :key="rIdx" 
                            style="background:#f8f9fa;border-radius:6px;padding:8px 10px;margin-bottom:6px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                                <span style="font-size:11px;color:#8e8e93;">回复 #{{ rIdx + 1 }}</span>
                                <button style="font-size:11px;color:#ff3b30;background:none;border:none;cursor:pointer;" @click="removeReply(idx, rIdx)">✕</button>
                            </div>
                            <div class="form-group" style="margin-bottom:4px;">
                                <input class="form-input" :value="reply.username" @input="updateReply(idx, rIdx, 'username', $event.target.value)" placeholder="用户名" style="font-size:12px;padding:4px 8px;">
                            </div>
                            <div class="form-group" style="margin-bottom:4px;">
                                <input class="form-input" :value="reply.text" @input="updateReply(idx, rIdx, 'text', $event.target.value)" placeholder="回复内容" style="font-size:12px;padding:4px 8px;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button class="add-comment-btn" @click="addComment">➕ 添加评论</button>
        </div>
    </div>
    `,
    methods: {
        updateField(field, value) {
            this.$emit('update', { ...this.data, [field]: value });
        },
        triggerUpload(type) {
            const ref = type === 'avatar' ? 'avatarInput' : 'imageInput';
            this.$refs[ref].click();
        },
        async handleUpload(event, field) {
            const file = event.target.files[0];
            if (!file) return;
            try {
                const base64 = await ImageUtil.fileToBase64(file);
                const compressed = await ImageUtil.compressImage(base64);
                this.updateField(field, compressed);
            } catch (e) {
                console.error('图片上传失败:', e.message);
            }
        },
        removeImage(field) {
            this.updateField(field, '');
        },
        formatNumber(n) {
            if (typeof n === 'string') return n;
            if (n >= 10000) return (n / 10000).toFixed(1) + '万';
            if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
            return String(n);
        },
        parseNumber(str) {
            str = str.trim();
            if (str.endsWith('万')) return Math.round(parseFloat(str) * 10000);
            if (str.endsWith('K') || str.endsWith('k')) return Math.round(parseFloat(str) * 1000);
            return parseInt(str) || 0;
        },
        adjustNumber(field, delta) {
            const current = typeof this.data[field] === 'number' ? this.data[field] : 0;
            this.updateField(field, Math.max(0, current + delta));
        },
        addComment() {
            const comments = [...this.data.comments, { username: 'user_' + Math.floor(Math.random() * 999), text: '', likes: 0, replies: [] }];
            this.updateField('comments', comments);
        },
        removeComment(idx) {
            const comments = [...this.data.comments];
            comments.splice(idx, 1);
            this.updateField('comments', comments);
        },
        updateComment(idx, field, value) {
            const comments = [...this.data.comments];
            comments[idx] = { ...comments[idx], [field]: value };
            this.updateField('comments', comments);
        },
        adjustCommentLikes(idx, delta) {
            const comments = [...this.data.comments];
            comments[idx] = { ...comments[idx], likes: Math.max(0, comments[idx].likes + delta) };
            this.updateField('comments', comments);
        },
        addReply(commentIdx) {
            const comments = [...this.data.comments];
            const replies = [...(comments[commentIdx].replies || []), { username: 'user_' + Math.floor(Math.random()*999), text: '' }];
            comments[commentIdx] = { ...comments[commentIdx], replies };
            this.updateField('comments', comments);
        },
        removeReply(commentIdx, replyIdx) {
            const comments = [...this.data.comments];
            const replies = [...(comments[commentIdx].replies || [])];
            replies.splice(replyIdx, 1);
            comments[commentIdx] = { ...comments[commentIdx], replies };
            this.updateField('comments', comments);
        },
        updateReply(commentIdx, replyIdx, field, value) {
            const comments = [...this.data.comments];
            const replies = [...(comments[commentIdx].replies || [])];
            replies[replyIdx] = { ...replies[replyIdx], [field]: value };
            comments[commentIdx] = { ...comments[commentIdx], replies };
            this.updateField('comments', comments);
        },
        // 拖拽排序方法
        onDragStart(comment, idx, event) {
            event.dataTransfer.setData('text/plain', String(idx));
            const el = event.target.closest('.comment-item');
            if (el) el.classList.add('dragging');
        },
        onDragOver(comment, idx, event) {
            event.preventDefault();
            if (comment === this.data.comments[idx]) return;
            
            const el = event.target.closest('.comment-item');
            if (!el) return;
            
            const rect = el.getBoundingClientRect();
            const mouseY = event.clientY;
            const middleY = rect.top + rect.height / 2;
            
            el.classList.remove('drag-over', 'drag-over-bottom');
            
            if (mouseY < middleY) {
                el.classList.add('drag-over');
            } else {
                el.classList.add('drag-over-bottom');
            }
        },
        onDragLeave(comment, idx, event) {
            const el = event.target.closest('.comment-item');
            if (el) {
                el.classList.remove('drag-over', 'drag-over-bottom');
            }
        },
        onDrop(comment, idx, event) {
            event.preventDefault();
            
            const data = [...this.data.comments];
            const dragIndex = parseInt(event.dataTransfer.getData('text/plain'));
            if (isNaN(dragIndex) || dragIndex === idx) return;
            
            if (dragIndex !== -1) {
                const [removed] = data.splice(dragIndex, 1);
                
                const rect = event.target.closest('.comment-item').getBoundingClientRect();
                const mouseY = event.clientY;
                const middleY = rect.top + rect.height / 2;
                
                let insertIndex = idx;
                if (mouseY > middleY && dragIndex < idx) {
                    insertIndex = idx + 1;
                } else if (mouseY > middleY && dragIndex > idx) {
                    insertIndex = idx;
                } else if (mouseY <= middleY && dragIndex > idx) {
                    insertIndex = idx;
                } else if (mouseY <= middleY && dragIndex < idx) {
                    insertIndex = idx;
                }
                
                data.splice(insertIndex, 0, removed);
                this.updateField('comments', data);
                
                // 清除样式
                const elements = document.querySelectorAll('.comment-item');
                elements.forEach(el => {
                    el.classList.remove('dragging', 'drag-over', 'drag-over-bottom');
                });
            }
        }
    }
};

// Instagram 预览组件
const InstagramPreview = {
    name: 'instagram-preview',
    props: ['data'],
    template: `
    <div class="ig-post">
        <!-- Header -->
        <div class="ig-post-header">
            <div class="ig-post-header-left">
                <template v-if="data.avatar || data.avatarUrl">
                    <img class="ig-avatar" :src="data.avatar || data.avatarUrl" :alt="data.username">
                </template>
                <template v-else>
                    <div class="ig-avatar-placeholder">{{ (data.username || 'U')[0].toUpperCase() }}</div>
                </template>
                <div class="ig-user-info">
                    <span class="ig-username">
                        {{ data.username || 'username' }}
                        <span v-if="data.verified" class="ig-verified">
                            <svg viewBox="0 0 40 40"><path fill="#3897f0" d="M19.998 3.094L14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v6.354h6.234L14.638 40l5.36-3.094L25.358 40l2.973-5.15h6.234v-6.354L40 25.359 36.905 20 40 14.641l-5.435-3.137V5.15h-6.234L25.358 0l-5.36 3.094z"/><path fill="#fff" d="M17.178 26.596l-6.613-6.614 2.243-2.243 4.37 4.37 9.056-9.057 2.243 2.243z"/></svg>
                        </span>
                    </span>
                    <span v-if="data.location" class="ig-location">{{ data.location }}</span>
                </div>
            </div>
            <div class="ig-header-more">
                <svg viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="1.5"/><circle cx="6" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></svg>
            </div>
        </div>

        <!-- Image -->
        <div class="ig-image-container">
            <template v-if="data.imageUrl || data.imageUrlExt">
                <img :src="data.imageUrl || data.imageUrlExt" alt="post">
            </template>
            <template v-else>
                <div class="ig-image-placeholder">
                    <span>📷</span>
                    <small>图片区域</small>
                </div>
            </template>
        </div>

        <!-- Actions -->
        <div class="ig-actions">
            <div class="ig-actions-left">
                <div class="ig-action-btn">
                    <svg viewBox="0 0 24 24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.725-2.96 7.098-6.378 9.566a.998.998 0 0 1-1.244 0C10.46 16.22 7.5 12.847 7.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 .679-.938z" fill="none" stroke="#262626" stroke-width="1.5"/></svg>
                </div>
                <div class="ig-action-btn">
                    <svg viewBox="0 0 24 24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="#262626" stroke-linejoin="round" stroke-width="1.5"/></svg>
                </div>
                <div class="ig-action-btn">
                    <svg viewBox="0 0 24 24"><line fill="none" stroke="#262626" stroke-linejoin="round" stroke-width="1.5" x1="22" x2="9.218" y1="3" y2="10.083"/><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="#262626" stroke-linejoin="round" stroke-width="1.5"/></svg>
                </div>
            </div>
            <div class="ig-actions-right">
                <div class="ig-action-btn">
                    <svg viewBox="0 0 24 24"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="#262626" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
                </div>
            </div>
        </div>

        <!-- Likes -->
        <div class="ig-likes">{{ formatLikes(data.likes) }} 次赞</div>

        <!-- Caption -->
        <div class="ig-caption">
            <span class="ig-caption-username">{{ data.username || 'username' }}</span>
            <span v-html="renderCaption(data.caption)"></span>
        </div>

        <!-- Comments -->
        <template v-if="data.comments && data.comments.length > 0">
            <div class="ig-view-comments" v-if="data.comments.length > 2">
                查看 {{ data.comments.length }} 条评论
            </div>
            <div class="ig-comments">
                <div v-for="(comment, idx) in data.comments" :key="idx" class="ig-comment-group">
                    <div class="ig-comment">
                        <span class="ig-comment-username">{{ comment.username }}</span>
                        <span v-html="renderCaption(comment.text)"></span>
                        <span class="ig-comment-like" v-if="comment.likes > 0">
                            <svg viewBox="0 0 24 24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.725-2.96 7.098-6.378 9.566a.998.998 0 0 1-1.244 0C10.46 16.22 7.5 12.847 7.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 .679-.938z"/></svg>
                        </span>
                    </div>
                    <div v-if="(comment.replies || []).length > 0" class="ig-replies">
                        <div class="ig-reply-thread-line"></div>
                        <div class="ig-reply" v-for="(reply, rIdx) in (comment.replies || [])" :key="rIdx">
                            <span class="ig-comment-username">{{ reply.username }}</span>
                            <span v-html="renderCaption(reply.text)"></span>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- Timestamp -->
        <div class="ig-timestamp">{{ data.timestamp || '刚刚' }}</div>

        <!-- Add Comment -->
        <div class="ig-add-comment">
            <span class="ig-add-comment-placeholder">添加评论...</span>
            <span class="ig-post-btn">发布</span>
        </div>
    </div>
    `,
    methods: {
        formatLikes(n) {
            if (!n) return '0';
            if (typeof n === 'string') return n;
            if (n >= 10000) return (n / 10000).toFixed(1) + '万';
            return n.toLocaleString('zh-CN');
        },
        renderCaption(text) {
            if (!text) return '';
            // 高亮 #标签 和 @提及
            return text
                .replace(/#(\S+)/g, '<span style="color:#00376b;">#$1</span>')
                .replace(/@(\S+)/g, '<span style="color:#00376b;">@$1</span>');
        }
    }
};
