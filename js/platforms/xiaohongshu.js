const XiaohongshuDefaults = {
    username: '生活记录者小张',
    avatar: '',
    avatarUrl: '',
    imageUrl: '',
    imageUrlExt: '',
    title: '北京三里屯日落打卡 🌇 太美了！',
    content: '今天路过三里屯正好赶上日落，整个天空都变成金色了✨\n\n随手拿手机拍了几张，感觉每一张都可以当壁纸！\n\n#北京 #三里屯 #日落 #手机摄影 #日常分享',
    location: '北京·三里屯太古里',
    likes: 2048,
    favorites: 856,
    commentCount: 2,
    comments: [
        { username: '摄影爱好者小李', text: '太好看了吧！请问用什么手机拍的？', likes: 23, avatar: '', avatarUrl: '', time: '1小时前', replies: [
            { username: '生活记录者小张', text: 'iPhone 15 Pro Max～', avatar: '', avatarUrl: '', time: '45分钟前' }
        ]},
        { username: '旅行达人小王', text: '三里屯的日落确实很绝 🔥', likes: 8, avatar: '', avatarUrl: '', time: '30分钟前', replies: [] }
    ],
    timestamp: '2小时前',
    showFollowBtn: true
};

const XiaohongshuEditor = {
    name: 'xiaohongshu-editor',
    props: ['data'],
    emits: ['update'],
    template: `
    <div class="xiaohongshu-editor">
        <div class="sub-title">👤 用户信息</div>
        <div class="form-group">
            <label>头像</label>
            <div class="image-upload" :class="{ 'has-image': data.avatar }" @click="$refs.avatarInput.click()">
                <template v-if="data.avatar">
                    <img :src="data.avatar" alt="avatar">
                    <button class="remove-image" @click.stop="updateField('avatar', '')">✕</button>
                </template>
                <div v-else class="upload-placeholder">
                    <span>📷</span><small>点击上传头像</small>
                </div>
            </div>
            <input type="file" ref="avatarInput" accept="image/*" @change="handleUpload($event, 'avatar')" hidden>
            <div class="ext-url-row">
                <span class="ext-url-label">🔗</span>
                <input class="form-input ext-url-input" :value="data.avatarUrl" @input="updateField('avatarUrl', $event.target.value)" placeholder="外部图片链接（AO3导出用）">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group" style="flex:2;">
                <label>用户名</label>
                <input class="form-input" :value="data.username" @input="updateField('username', $event.target.value)" placeholder="用户名">
            </div>
            <div class="form-group" style="flex:0;">
                <label>关注按钮</label>
                <div class="toggle-group" style="margin-top:6px;">
                    <label class="toggle">
                        <input type="checkbox" :checked="data.showFollowBtn" @change="updateField('showFollowBtn', $event.target.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                    <span style="font-size:13px;">显示</span>
                </div>
            </div>
        </div>

        <div class="section-divider"></div>

        <div class="sub-title">🖼️ 笔记图片</div>
        <div class="form-group">
            <div class="image-upload" :class="{ 'has-image': data.imageUrl }" @click="$refs.imageInput.click()">
                <template v-if="data.imageUrl">
                    <img :src="data.imageUrl" alt="image">
                    <button class="remove-image" @click.stop="updateField('imageUrl', '')">✕</button>
                </template>
                <div v-else class="upload-placeholder">
                    <span>📷</span><small>点击上传图片（建议 3:4 竖图）</small>
                </div>
            </div>
            <input type="file" ref="imageInput" accept="image/*" @change="handleUpload($event, 'imageUrl')" hidden>
            <div class="ext-url-row">
                <span class="ext-url-label">🔗</span>
                <input class="form-input ext-url-input" :value="data.imageUrlExt" @input="updateField('imageUrlExt', $event.target.value)" placeholder="外部图片链接（AO3导出用）">
            </div>
        </div>

        <div class="section-divider"></div>

        <div class="sub-title">📝 笔记内容</div>
        <div class="form-group">
            <label>标题 <span class="hint">({{ (data.title || '').length }}/20)</span></label>
            <input class="form-input" :value="data.title" @input="updateField('title', $event.target.value)" placeholder="笔记标题" maxlength="20">
        </div>
        <div class="form-group">
            <label>正文 <span class="hint">({{ (data.content || '').length }}/1000)</span></label>
            <textarea class="form-input" :value="data.content" @input="updateField('content', $event.target.value)" rows="6" placeholder="分享你的生活..." maxlength="1000"></textarea>
        </div>
        <div class="form-group">
            <label>📍 位置</label>
            <input class="form-input" :value="data.location" @input="updateField('location', $event.target.value)" placeholder="添加位置（可选）">
        </div>
        <div class="form-group">
            <label>🕐 发布时间</label>
            <input class="form-input" :value="data.timestamp" @input="updateField('timestamp', $event.target.value)" placeholder="如: 2小时前、03-15 18:30">
        </div>

        <div class="section-divider"></div>

        <div class="sub-title">📊 互动数据</div>
        <div class="form-row">
            <div class="form-group">
                <label>❤️ 点赞</label>
                <div class="number-input-group">
                    <button @click="adjustNumber('likes', -1)">−</button>
                    <input :value="data.likes" @input="updateField('likes', parseInt($event.target.value)||0)">
                    <button @click="adjustNumber('likes', 1)">+</button>
                </div>
            </div>
            <div class="form-group">
                <label>⭐ 收藏</label>
                <div class="number-input-group">
                    <button @click="adjustNumber('favorites', -1)">−</button>
                    <input :value="data.favorites" @input="updateField('favorites', parseInt($event.target.value)||0)">
                    <button @click="adjustNumber('favorites', 1)">+</button>
                </div>
            </div>
        </div>

        <div class="section-divider"></div>

        <div class="sub-title">💬 评论区 <span class="hint">({{ (data.comments || []).length }}条)</span></div>
        <div class="form-row" style="margin-bottom:8px;">
            <div class="form-group" style="margin-bottom:0;">
                <label style="font-size:12px;">显示评论数</label>
                <input class="form-input" type="number" min="0" :value="data.commentCount || (data.comments || []).length" @input="updateField('commentCount', parseInt($event.target.value)||0)" style="font-size:12px;width:80px;">
            </div>
        </div>
        <div class="comment-list">
            <div class="comment-item" v-for="(comment, idx) in (data.comments || [])" :key="idx">
                <div class="comment-header">
                    <span>@{{ comment.username }}</span>
                    <button class="remove-comment" @click="removeComment(idx)">✕</button>
                </div>
                <div class="form-group" style="margin-bottom:8px;">
                    <label style="font-size:12px;">头像</label>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div v-if="comment.avatar" style="position:relative;width:28px;height:28px;">
                            <img :src="comment.avatar" style="width:28px;height:28px;border-radius:50%;object-fit:cover;">
                            <button style="position:absolute;top:-4px;right:-4px;width:14px;height:14px;border-radius:50%;background:#ff3b30;color:#fff;border:none;font-size:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;" @click.stop="updateComment(idx, 'avatar', '')">✕</button>
                        </div>
                        <div v-else style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#ff2442,#ff6b81);display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:700;">{{ (comment.username || 'U')[0].toUpperCase() }}</div>
                        <label class="btn btn-small btn-outline" style="font-size:11px;padding:2px 8px;cursor:pointer;">
                            📷
                            <input type="file" accept="image/*" @change="handleCommentAvatar(idx, $event)" hidden style="display:none;">
                        </label>
                    </div>
                </div>
                <div class="form-group" style="margin-bottom:8px;">
                    <label style="font-size:12px;">🔗 头像链接</label>
                    <input class="form-input" :value="comment.avatarUrl" @input="updateComment(idx, 'avatarUrl', $event.target.value)" placeholder="外部链接（AO3用）" style="font-size:11px;">
                </div>
                <div class="form-group" style="margin-bottom:8px;">
                    <input class="form-input" :value="comment.username" @input="updateComment(idx, 'username', $event.target.value)" placeholder="用户名" style="font-size:13px;">
                </div>
                <div class="form-group" style="margin-bottom:8px;">
                    <input class="form-input" :value="comment.text" @input="updateComment(idx, 'text', $event.target.value)" placeholder="评论内容" style="font-size:13px;">
                </div>
                <div class="form-group" style="margin-bottom:8px;">
                    <label style="font-size:12px;">🕐 时间</label>
                    <input class="form-input" :value="comment.time" @input="updateComment(idx, 'time', $event.target.value)" placeholder="如: 1小时前" style="font-size:12px;">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size:12px;">喜欢</label>
                    <div class="number-input-group">
                        <button @click="adjustCommentLikes(idx, -1)">−</button>
                        <input :value="comment.likes" @input="updateComment(idx, 'likes', parseInt($event.target.value)||0)">
                        <button @click="adjustCommentLikes(idx, 1)">+</button>
                    </div>
                    <div style="margin-top:10px;padding-left:14px;border-left:2px solid #eee;">
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                            <span style="font-size:12px;font-weight:600;color:#8e8e93;">↳ 回复 ({{ (comment.replies || []).length }})</span>
                            <button style="font-size:11px;color:#ff2442;background:none;border:none;cursor:pointer;padding:2px 6px;" @click="addReply(idx)">+ 添加回复</button>
                        </div>
                        <div v-for="(reply, rIdx) in (comment.replies || [])" :key="rIdx"
                            style="background:#fff5f5;border-radius:6px;padding:8px 10px;margin-bottom:6px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                                <span style="font-size:11px;color:#8e8e93;">回复 #{{ rIdx + 1 }}</span>
                                <button style="font-size:11px;color:#ff3b30;background:none;border:none;cursor:pointer;" @click="removeReply(idx, rIdx)">✕</button>
                            </div>
                            <div class="form-group" style="margin-bottom:4px;">
                                <label style="font-size:11px;">头像</label>
                                <div style="display:flex;align-items:center;gap:6px;">
                                    <div v-if="reply.avatar" style="position:relative;width:22px;height:22px;">
                                        <img :src="reply.avatar" style="width:22px;height:22px;border-radius:50%;object-fit:cover;">
                                        <button style="position:absolute;top:-3px;right:-3px;width:12px;height:12px;border-radius:50%;background:#ff3b30;color:#fff;border:none;font-size:7px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;" @click.stop="updateReply(idx, rIdx, 'avatar', '')">✕</button>
                                    </div>
                                    <div v-else style="width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#ff2442,#ff6b81);display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-weight:700;">{{ (reply.username || 'U')[0].toUpperCase() }}</div>
                                    <label class="btn btn-small btn-outline" style="font-size:10px;padding:1px 6px;cursor:pointer;">
                                        📷
                                        <input type="file" accept="image/*" @change="handleReplyAvatar(idx, rIdx, $event)" hidden style="display:none;">
                                    </label>
                                </div>
                            </div>
                            <div class="form-group" style="margin-bottom:4px;">
                                <input class="form-input" :value="reply.avatarUrl" @input="updateReply(idx, rIdx, 'avatarUrl', $event.target.value)" placeholder="🔗 头像外链（AO3用）" style="font-size:11px;padding:3px 6px;">
                            </div>
                            <div class="form-group" style="margin-bottom:4px;">
                                <input class="form-input" :value="reply.username" @input="updateReply(idx, rIdx, 'username', $event.target.value)" placeholder="用户名" style="font-size:12px;padding:4px 8px;">
                            </div>
                            <div class="form-group" style="margin-bottom:4px;">
                                <input class="form-input" :value="reply.text" @input="updateReply(idx, rIdx, 'text', $event.target.value)" placeholder="回复内容" style="font-size:12px;padding:4px 8px;">
                            </div>
                            <div class="form-group" style="margin-bottom:4px;">
                                <input class="form-input" :value="reply.time" @input="updateReply(idx, rIdx, 'time', $event.target.value)" placeholder="🕐 时间" style="font-size:11px;padding:3px 6px;">
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
        async handleCommentAvatar(idx, event) {
            const file = event.target.files[0];
            if (!file) return;
            try {
                const base64 = await ImageUtil.fileToBase64(file);
                const compressed = await ImageUtil.compressImage(base64);
                this.updateComment(idx, 'avatar', compressed);
            } catch (e) { console.error('头像上传失败:', e.message); }
            event.target.value = '';
        },
        async handleReplyAvatar(commentIdx, replyIdx, event) {
            const file = event.target.files[0];
            if (!file) return;
            try {
                const base64 = await ImageUtil.fileToBase64(file);
                const compressed = await ImageUtil.compressImage(base64);
                this.updateReply(commentIdx, replyIdx, 'avatar', compressed);
            } catch (e) { console.error('头像上传失败:', e.message); }
            event.target.value = '';
        },
        adjustNumber(field, delta) {
            const current = typeof this.data[field] === 'number' ? this.data[field] : 0;
            this.updateField(field, Math.max(0, current + delta));
        },
        addComment() {
            const comments = [...(this.data.comments || []), { username: 'user_' + Math.floor(Math.random() * 999), text: '', likes: 0, avatar: '', avatarUrl: '', time: '', replies: [] }];
            this.$emit('update', { ...this.data, comments, commentCount: comments.length });
        },
        removeComment(idx) {
            const comments = [...(this.data.comments || [])];
            comments.splice(idx, 1);
            this.$emit('update', { ...this.data, comments, commentCount: comments.length });
        },
        updateComment(idx, field, value) {
            const comments = [...(this.data.comments || [])];
            comments[idx] = { ...comments[idx], [field]: value };
            this.updateField('comments', comments);
        },
        adjustCommentLikes(idx, delta) {
            const comments = [...(this.data.comments || [])];
            comments[idx] = { ...comments[idx], likes: Math.max(0, comments[idx].likes + delta) };
            this.updateField('comments', comments);
        },
        addReply(commentIdx) {
            const comments = [...(this.data.comments || [])];
            const replies = [...(comments[commentIdx].replies || []), { username: 'user_' + Math.floor(Math.random()*999), text: '', avatar: '', avatarUrl: '', time: '' }];
            comments[commentIdx] = { ...comments[commentIdx], replies };
            this.updateField('comments', comments);
        },
        removeReply(commentIdx, replyIdx) {
            const comments = [...(this.data.comments || [])];
            const replies = [...(comments[commentIdx].replies || [])];
            replies.splice(replyIdx, 1);
            comments[commentIdx] = { ...comments[commentIdx], replies };
            this.updateField('comments', comments);
        },
        updateReply(commentIdx, replyIdx, field, value) {
            const comments = [...(this.data.comments || [])];
            const replies = [...(comments[commentIdx].replies || [])];
            replies[replyIdx] = { ...replies[replyIdx], [field]: value };
            comments[commentIdx] = { ...comments[commentIdx], replies };
            this.updateField('comments', comments);
        }
    }
};

const XiaohongshuPreview = {
    name: 'xiaohongshu-preview',
    props: ['data'],
    template: `
    <div class="xhs-post">
        <div class="xhs-image-area">
            <template v-if="data.imageUrl || data.imageUrlExt">
                <img :src="data.imageUrl || data.imageUrlExt" alt="post">
            </template>
            <template v-else>
                <div class="xhs-image-placeholder">
                    <span>📷</span>
                    <small>图片区域</small>
                </div>
            </template>
        </div>
        <div class="xhs-content-area">
            <div class="xhs-author-row">
                <div class="xhs-author-left">
                    <template v-if="data.avatar || data.avatarUrl">
                        <img class="xhs-avatar" :src="data.avatar || data.avatarUrl" :alt="data.username">
                    </template>
                    <template v-else>
                        <div class="xhs-avatar-placeholder">{{ (data.username || '用')[0] }}</div>
                    </template>
                    <span class="xhs-author-name">{{ data.username || '用户名' }}</span>
                </div>
                <button v-if="data.showFollowBtn" class="xhs-follow-btn">关注</button>
            </div>
            <div class="xhs-title" v-if="data.title">{{ data.title }}</div>
            <div class="xhs-desc" v-html="renderContent(data.content)"></div>
            <div class="xhs-location-row" v-if="data.location">
                <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <span>{{ data.location }}</span>
            </div>
            <div class="xhs-interact-row">
                <div class="xhs-interact-item liked">
                    <svg viewBox="0 0 24 24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.725-2.96 7.098-6.378 9.566a.998.998 0 0 1-1.244 0C10.46 16.22 7.5 12.847 7.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 .679-.938z"/></svg>
                    <span>{{ formatCount(data.likes) }}</span>
                </div>
                <div class="xhs-interact-item">
                    <svg viewBox="0 0 24 24"><path d="M17.5 3H6.5C5.12 3 4 4.12 4 5.5v13l4-3h9.5c1.38 0 2.5-1.12 2.5-2.5v-7.5C20 4.12 18.88 3 17.5 3z" stroke-linejoin="round"/></svg>
                    <span>{{ data.commentCount || (data.comments || []).length }}</span>
                </div>
                <div class="xhs-interact-item">
                    <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span>{{ formatCount(data.favorites) }}</span>
                </div>
            </div>
        </div>
        <div class="xhs-comment-section" v-if="(data.comments || []).length > 0">
            <div class="xhs-comment-header">共 {{ data.commentCount || (data.comments || []).length }} 条评论</div>
            <div v-for="(comment, idx) in (data.comments || [])" :key="idx" class="xhs-comment-item">
                <template v-if="comment.avatar || comment.avatarUrl">
                    <img class="xhs-comment-avatar" :src="comment.avatar || comment.avatarUrl" :alt="comment.username">
                </template>
                <template v-else>
                    <div class="xhs-comment-avatar-placeholder">{{ (comment.username || 'U')[0].toUpperCase() }}</div>
                </template>
                <div class="xhs-comment-body">
                    <div class="xhs-comment-name">{{ comment.username }}</div>
                    <div class="xhs-comment-text">{{ comment.text }}</div>
                    <div class="xhs-comment-meta">
                        <span>{{ comment.time || '刚刚' }}</span>
                        <span class="xhs-comment-like">
                            <svg viewBox="0 0 24 24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.725-2.96 7.098-6.378 9.566a.998.998 0 0 1-1.244 0C10.46 16.22 7.5 12.847 7.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 .679-.938z"/></svg>
                            {{ comment.likes > 0 ? comment.likes : '' }}
                        </span>
                    </div>
                    <div v-if="(comment.replies || []).length > 0" class="xhs-comment-replies">
                        <div v-for="(reply, rIdx) in (comment.replies || [])" :key="rIdx" class="xhs-reply-item">
                            <template v-if="reply.avatar || reply.avatarUrl">
                                <img class="xhs-reply-avatar" :src="reply.avatar || reply.avatarUrl" :alt="reply.username">
                            </template>
                            <template v-else>
                                <div class="xhs-reply-avatar-placeholder">{{ (reply.username || 'U')[0].toUpperCase() }}</div>
                            </template>
                            <div class="xhs-reply-body">
                                <span class="xhs-reply-name">{{ reply.username }}</span>
                                <span class="xhs-reply-text">{{ reply.text }}</span>
                                <span v-if="reply.time" class="xhs-reply-time">{{ reply.time }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="xhs-date">{{ data.timestamp || '刚刚' }}</div>
    </div>
    `,
    methods: {
        formatCount(n) {
            if (!n) return '0';
            if (typeof n === 'string') return n;
            if (n >= 10000) return (n / 10000).toFixed(1) + '万';
            if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
            return n.toLocaleString('zh-CN');
        },
        renderContent(text) {
            if (!text) return '';
            return text
                .replace(/#(\S+)/g, '<span class="xhs-tag">#$1</span>')
                .replace(/\n/g, '<br>');
        }
    }
};
