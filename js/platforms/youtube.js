/**
 * YouTube 平台模块
 */

const YouTubeDefaults = {
    title: '【北京VLOG】三里屯的日落太美了！手机摄影也能拍大片',
    thumbnail: '',
    thumbnailUrl: '',
    channelName: '张三的频道',
    channelAvatar: '',
    channelAvatarUrl: '',
    subscribers: '12.5万',
    views: 286000,
    dateText: '2024年3月15日',
    likes: 15200,
    dislikes: 89,
    description: '今天在北京三里屯拍到了超美的日落！\n\n设备：iPhone 15 Pro Max\n地点：北京三里屯太古里\n\n#北京 #三里屯 #日落 #手机摄影 #VLOG',
    commentsCount: 89,
    comments: [
        { author: '李四VLOG', text: '拍得真的太好了！请问是什么设备拍的？', likes: 234, timeAgo: '2天前', isPinned: false, replies: [] },
        { author: '摄影小王', text: '三里屯的日落确实很美，下次去北京一定要去看看 😍', likes: 56, timeAgo: '1天前', isPinned: false, replies: [] }
    ]
};

const YouTubeEditor = {
    name: 'youtube-editor',
    props: ['data'],
    emits: ['update'],
    template: `
    <div class="youtube-editor">
        <div class="sub-title">🎬 视频信息</div>
        <div class="form-group">
            <label>视频标题</label>
            <input class="form-input" :value="data.title" @input="updateField('title', $event.target.value)" placeholder="视频标题">
        </div>

        <div class="sub-title">🖼️ 封面图</div>
        <div class="form-group">
            <div class="image-upload" :class="{ 'has-image': data.thumbnail }" @click="$refs.thumbInput.click()" style="aspect-ratio:16/9;">
                <template v-if="data.thumbnail">
                    <img :src="data.thumbnail" alt="thumbnail">
                    <button class="remove-image" @click.stop="updateField('thumbnail', '')">✕</button>
                </template>
                <div v-else class="upload-placeholder">
                    <span>🎬</span><small>点击上传封面图（建议 16:9）</small>
                </div>
            </div>
            <input type="file" ref="thumbInput" accept="image/*" @change="handleUpload($event, 'thumbnail')" hidden>
            <div class="ext-url-row">
                <span class="ext-url-label">🔗</span>
                <input class="form-input ext-url-input" :value="data.thumbnailUrl" @input="updateField('thumbnailUrl', $event.target.value)" placeholder="外部图片链接（AO3导出用）">
            </div>
        </div>

        <div class="section-divider"></div>

        <div class="sub-title">👤 频道信息</div>
        <div class="form-group">
            <label>频道头像</label>
            <div class="image-upload" :class="{ 'has-image': data.channelAvatar }" @click="$refs.avatarInput.click()">
                <template v-if="data.channelAvatar">
                    <img :src="data.channelAvatar" alt="avatar">
                    <button class="remove-image" @click.stop="updateField('channelAvatar', '')">✕</button>
                </template>
                <div v-else class="upload-placeholder">
                    <span>📷</span><small>点击上传头像</small>
                </div>
            </div>
            <input type="file" ref="avatarInput" accept="image/*" @change="handleUpload($event, 'channelAvatar')" hidden>
            <div class="ext-url-row">
                <span class="ext-url-label">🔗</span>
                <input class="form-input ext-url-input" :value="data.channelAvatarUrl" @input="updateField('channelAvatarUrl', $event.target.value)" placeholder="外部图片链接（AO3导出用）">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>频道名</label>
                <input class="form-input" :value="data.channelName" @input="updateField('channelName', $event.target.value)" placeholder="频道名称">
            </div>
            <div class="form-group">
                <label>订阅数</label>
                <input class="form-input" :value="data.subscribers" @input="updateField('subscribers', $event.target.value)" placeholder="如: 12.5万">
            </div>
        </div>

        <div class="section-divider"></div>

        <div class="sub-title">📊 数据</div>
        <div class="form-row">
            <div class="form-group">
                <label>观看量</label>
                <input class="form-input" type="number" :value="data.views" @input="updateField('views', parseInt($event.target.value)||0)" min="0">
            </div>
            <div class="form-group">
                <label>日期</label>
                <input class="form-input" :value="data.dateText" @input="updateField('dateText', $event.target.value)" placeholder="如: 2024年3月15日">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>👍 喜欢</label>
                <input class="form-input" type="number" :value="data.likes" @input="updateField('likes', parseInt($event.target.value)||0)" min="0">
            </div>
            <div class="form-group">
                <label>👎 不喜欢</label>
                <input class="form-input" type="number" :value="data.dislikes" @input="updateField('dislikes', parseInt($event.target.value)||0)" min="0">
            </div>
        </div>

        <div class="section-divider"></div>

        <div class="sub-title">📝 视频描述</div>
        <div class="form-group">
            <textarea class="form-input" :value="data.description" @input="updateField('description', $event.target.value)" rows="4" placeholder="视频描述..."></textarea>
        </div>

        <div class="section-divider"></div>

        <div class="sub-title">💬 评论 <span class="hint">({{ data.comments.length }}条)</span></div>
        <div class="comment-list">
            <div class="comment-item" v-for="(comment, idx) in data.comments" :key="idx"
                draggable="true"
                @dragstart="onDragStart(comment, idx, $event)"
                @dragover.prevent="onDragOver(comment, idx, $event)"
                @dragleave="onDragLeave(comment, idx, $event)"
                @drop="onDrop(comment, idx, $event)">
                <div class="drag-handle">⋮⋮</div>
                <div class="comment-header">
                    <span>
                        评论 #{{ idx + 1 }}
                        <label v-if="idx === 0" style="font-size:11px; color:#606060; margin-left:8px;">
                            <input type="checkbox" :checked="comment.isPinned" @change="updateComment(idx, 'isPinned', $event.target.checked)"> 置顶
                        </label>
                    </span>
                    <button class="remove-comment" @click="removeComment(idx)">✕</button>
                </div>
                <div class="form-group" style="margin-bottom:8px;">
                    <input class="form-input" :value="comment.author" @input="updateComment(idx, 'author', $event.target.value)" placeholder="评论者" style="font-size:13px;">
                </div>
                <div class="form-group" style="margin-bottom:8px;">
                    <textarea class="form-input" :value="comment.text" @input="updateComment(idx, 'text', $event.target.value)" placeholder="评论内容" rows="2" style="font-size:13px;min-height:40px;"></textarea>
                </div>
                <div class="form-row" style="margin-bottom:0;">
                    <div class="form-group" style="margin-bottom:0;">
                        <label style="font-size:12px;">赞</label>
                        <input class="form-input" type="number" :value="comment.likes" @input="updateComment(idx, 'likes', parseInt($event.target.value)||0)" min="0" style="font-size:13px;">
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                        <label style="font-size:12px;">时间</label>
                        <input class="form-input" :value="comment.timeAgo" @input="updateComment(idx, 'timeAgo', $event.target.value)" style="font-size:13px;">
                    </div>
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
                            <input class="form-input" :value="reply.author" @input="updateReply(idx, rIdx, 'author', $event.target.value)" placeholder="回复者" style="font-size:12px;padding:4px 8px;">
                        </div>
                        <div class="form-group" style="margin-bottom:4px;">
                            <input class="form-input" :value="reply.text" @input="updateReply(idx, rIdx, 'text', $event.target.value)" placeholder="回复内容" style="font-size:12px;padding:4px 8px;">
                        </div>
                    </div>
                </div>
            </div>
            <button class="add-comment-btn" @click="addComment">➕ 添加评论</button>
        </div>
    </div>
    `,
    methods: {
        updateField(field, value) { this.$emit('update', { ...this.data, [field]: value }); },
        async handleUpload(event, field) {
            const file = event.target.files[0];
            if (!file) return;
            try {
                const base64 = await ImageUtil.fileToBase64(file);
                const compressed = await ImageUtil.compressImage(base64);
                this.updateField(field, compressed);
            } catch (e) { console.error('图片上传失败:', e.message); }
        },
        addComment() {
            const comments = [...this.data.comments, { author: 'user_' + Math.floor(Math.random()*999), text: '', likes: 0, timeAgo: '刚刚', isPinned: false, replies: [] }];
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
        addReply(commentIdx) {
            const comments = [...this.data.comments];
            const replies = [...(comments[commentIdx].replies || []), { author: 'user_' + Math.floor(Math.random()*999), text: '' }];
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
            const el = event.target.closest('.comment-item');
            if (el) {
                el.classList.add('dragging');
            }
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
            const dragIndex = data.findIndex(c => c === this.data.comments[data.indexOf(comment)]);
            
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

const YouTubePreview = {
    name: 'youtube-preview',
    props: ['data'],
    template: `
    <div class="yt-page">
        <!-- Video Player -->
        <div class="yt-player">
            <template v-if="data.thumbnail || data.thumbnailUrl">
                <img :src="data.thumbnail || data.thumbnailUrl" alt="video thumbnail">
                <div class="yt-play-btn"></div>
            </template>
            <template v-else>
                <div class="yt-player-placeholder">
                    <span>▶</span>
                    <small>视频封面区域</small>
                </div>
            </template>
        </div>
        <div class="yt-progress-bar"><div class="yt-progress"></div></div>

        <!-- Title -->
        <div class="yt-title-area">
            <div class="yt-title">{{ data.title || '视频标题' }}</div>
            <div class="yt-meta-row">
                <div class="yt-view-info">{{ formatViews(data.views) }}次观看 · {{ data.dateText || '今天' }}</div>
                <div class="yt-actions">
                    <div class="yt-action-btn liked">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" stroke-width="2"><path d="M18.77 11h-4.23l1.52-4.94C16.38 5.03 15.54 4 14.38 4c-.58 0-1.14.24-1.52.65L7 11H1v10h6l6.73-1.77c.84-.22 1.57-.67 2.13-1.27L22 12.5c.23-.24.36-.56.36-.9 0-.74-.59-1.35-1.32-1.35h-1.27z"/></svg>
                        {{ formatCount(data.likes) }}
                    </div>
                    <div class="yt-action-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" stroke-width="2" style="transform:rotate(180deg);"><path d="M18.77 11h-4.23l1.52-4.94C16.38 5.03 15.54 4 14.38 4c-.58 0-1.14.24-1.52.65L7 11H1v10h6l6.73-1.77c.84-.22 1.57-.67 2.13-1.27L22 12.5c.23-.24.36-.56.36-.9 0-.74-.59-1.35-1.32-1.35h-1.27z"/></svg>
                    </div>
                    <div class="yt-action-btn">分享</div>
                    <div class="yt-action-btn">下载</div>
                </div>
            </div>
        </div>

        <!-- Channel -->
        <div class="yt-channel-bar">
            <div class="yt-channel-left">
                <template v-if="data.channelAvatar || data.channelAvatarUrl">
                    <img class="yt-channel-avatar" :src="data.channelAvatar || data.channelAvatarUrl" :alt="data.channelName">
                </template>
                <template v-else>
                    <div class="yt-channel-avatar-placeholder">{{ (data.channelName || 'U')[0] }}</div>
                </template>
                <div class="yt-channel-info">
                    <div class="yt-channel-name">{{ data.channelName || '频道名称' }}</div>
                    <div class="yt-channel-subs">{{ data.subscribers || '0' }}位订阅者</div>
                </div>
            </div>
            <button class="yt-subscribe-btn">订阅</button>
        </div>

        <!-- Description -->
        <div class="yt-description" v-if="data.description">
            <div class="yt-description-stats">{{ formatViews(data.views) }}次观看 · {{ data.dateText || '今天' }}</div>
            <div class="yt-description-text" v-html="renderDescription(data.description)"></div>
            <span class="yt-description-expand">展开</span>
        </div>

        <!-- Comments -->
        <div class="yt-comments">
            <div class="yt-comments-header">
                <span class="yt-comments-count">{{ data.comments.length }} 条评论</span>
                <span class="yt-sort-btn">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0f0f0f" stroke-width="2"><path d="M3 4h18M3 12h12M3 20h6"/></svg>
                    排序方式
                </span>
            </div>
            <div v-for="(comment, idx) in data.comments" :key="idx">
                <div class="yt-comment" :class="{ 'yt-comment-pinned': comment.isPinned }">
                    <template v-if="comment.isPinned">
                        <div class="yt-pinned-label">📌 由作者置顶</div>
                    </template>
                    <template v-if="data.channelAvatar || data.channelAvatarUrl">
                        <img class="yt-comment-avatar" :src="data.channelAvatar || data.channelAvatarUrl" alt="">
                    </template>
                    <template v-else>
                        <div class="yt-comment-avatar-placeholder">{{ (comment.author || 'U')[0].toUpperCase() }}</div>
                    </template>
                    <div class="yt-comment-content">
                        <div class="yt-comment-header">
                            <span class="yt-comment-author">@{{ comment.author }}</span>
                            <span class="yt-comment-time">{{ comment.timeAgo || '刚刚' }}</span>
                        </div>
                        <div class="yt-comment-body">{{ comment.text }}</div>
                        <div class="yt-comment-actions">
                            <div class="yt-comment-action">
                                <svg viewBox="0 0 24 24"><path d="M18.77 11h-4.23l1.52-4.94C16.38 5.03 15.54 4 14.38 4c-.58 0-1.14.24-1.52.65L7 11H1v10h6l6.73-1.77c.84-.22 1.57-.67 2.13-1.27L22 12.5c.23-.24.36-.56.36-.9 0-.74-.59-1.35-1.32-1.35h-1.27z"/></svg>
                            </div>
                            <div class="yt-comment-action">
                                <svg viewBox="0 0 24 24" style="transform:rotate(180deg);"><path d="M18.77 11h-4.23l1.52-4.94C16.38 5.03 15.54 4 14.38 4c-.58 0-1.14.24-1.52.65L7 11H1v10h6l6.73-1.77c.84-.22 1.57-.67 2.13-1.27L22 12.5c.23-.24.36-.56.36-.9 0-.74-.59-1.35-1.32-1.35h-1.27z"/></svg>
                            </div>
                            <span class="yt-comment-likes" v-if="comment.likes > 0">{{ comment.likes }}</span>
                            <span class="yt-comment-action" style="margin-left:8px;">回复</span>
                        </div>
                    </div>
                </div>
                <div v-if="(comment.replies || []).length > 0" style="margin-left:52px;padding-left:0;border-left:none;">
                    <div v-for="(reply, rIdx) in (comment.replies || [])" :key="rIdx" class="yt-comment" style="margin-bottom:8px;">
                        <div class="yt-comment-avatar-placeholder" style="width:24px;height:24px;font-size:10px;">{{ (reply.author || 'U')[0].toUpperCase() }}</div>
                        <div class="yt-comment-content">
                            <div class="yt-comment-header">
                                <span class="yt-comment-author">@{{ reply.author }}</span>
                            </div>
                            <div class="yt-comment-body">{{ reply.text }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {
        formatViews(n) {
            if (!n) return '0';
            if (typeof n === 'string') return n;
            if (n >= 100000000) return (n / 100000000).toFixed(1) + '亿';
            if (n >= 10000) return (n / 10000).toFixed(1) + '万';
            return n.toLocaleString('zh-CN');
        },
        formatCount(n) {
            if (!n) return '0';
            if (typeof n === 'string') return n;
            if (n >= 10000) return (n / 10000).toFixed(1) + '万';
            if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
            return String(n);
        },
        renderDescription(text) {
            if (!text) return '';
            return text
                .replace(/#(\S+)/g, '<span style="color:#065fd4;">#$1</span>')
                .replace(/\n/g, '<br>');
        }
    }
};
