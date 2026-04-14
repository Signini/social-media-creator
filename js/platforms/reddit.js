/**
 * Reddit 平台模块
 */

const RedditDefaults = {
    subreddit: 'r/Beijing',
    author: 'zhangsan_design',
    flair: '',
    flairColor: '#ff4500',
    title: '今天在三里屯拍到了绝美日落，分享给大家！',
    body: '如题，今天下午路过三里屯，正好赶上日落时分。整个天空都被染成了金色，太壮观了。\n\n用手机随手拍的，感觉效果还不错，大家觉得呢？',
    imageUrl: '',
    imageUrlExt: '',
    upvotes: 1523,
    downvotes: 47,
    commentCount: 89,
    awards: [],
    timeAgo: '3 小时前',
    comments: [
        { author: 'lisi_photo', text: '太美了！请问是用什么手机拍的？', upvotes: 234, timeAgo: '2 小时前', replies: [
            { author: 'zhangsan_design', text: 'iPhone 15 Pro Max', upvotes: 89, timeAgo: '1 小时前' }
        ]},
        { author: 'wangwu_art', text: '三里屯的日落确实很美，下次我也去拍', upvotes: 56, timeAgo: '1 小时前', replies: [] }
    ]
};

const RedditEditor = {
    name: 'reddit-editor',
    props: ['data'],
    emits: ['update'],
    template: `
    <div class="reddit-editor">
        <div class="sub-title">📌 帖子信息</div>
        <div class="form-row">
            <div class="form-group">
                <label>Subreddit</label>
                <input class="form-input" :value="data.subreddit" @input="updateField('subreddit', $event.target.value)" placeholder="r/...">
            </div>
            <div class="form-group">
                <label>作者</label>
                <input class="form-input" :value="data.author" @input="updateField('author', $event.target.value)" placeholder="u/...">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>FLAIR 标签</label>
                <input class="form-input" :value="data.flair" @input="updateField('flair', $event.target.value)" placeholder="如: 图片/讨论/新闻">
            </div>
            <div class="form-group">
                <label>FLAIR 颜色</label>
                <input class="form-input" type="color" :value="data.flairColor" @input="updateField('flairColor', $event.target.value)" style="height:36px;padding:2px;">
            </div>
        </div>

        <div class="section-divider"></div>

        <div class="sub-title">📝 内容</div>
        <div class="form-group">
            <label>标题</label>
            <input class="form-input" :value="data.title" @input="updateField('title', $event.target.value)" placeholder="帖子标题">
        </div>
        <div class="form-group">
            <label>正文</label>
            <textarea class="form-input" :value="data.body" @input="updateField('body', $event.target.value)" rows="5" placeholder="正文内容..."></textarea>
        </div>

        <div class="sub-title">🖼️ 图片</div>
        <div class="form-group">
            <div class="image-upload" :class="{ 'has-image': data.imageUrl }" @click="$refs.imageInput.click()">
                <template v-if="data.imageUrl">
                    <img :src="data.imageUrl" alt="image">
                    <button class="remove-image" @click.stop="updateField('imageUrl', '')">✕</button>
                </template>
                <div v-else class="upload-placeholder">
                    <span>📷</span><small>点击上传图片</small>
                </div>
            </div>
            <input type="file" ref="imageInput" accept="image/*" @change="handleUpload($event)" hidden>
            <div class="ext-url-row">
                <span class="ext-url-label">🔗</span>
                <input class="form-input ext-url-input" :value="data.imageUrlExt" @input="updateField('imageUrlExt', $event.target.value)" placeholder="外部图片链接（AO3导出用）">
            </div>
        </div>

        <div class="section-divider"></div>

        <div class="sub-title">📊 数据</div>
        <div class="form-row">
            <div class="form-group">
                <label>👍 赞</label>
                <input class="form-input" type="number" :value="data.upvotes" @input="updateField('upvotes', parseInt($event.target.value)||0)" min="0">
            </div>
            <div class="form-group">
                <label>👎 踩</label>
                <input class="form-input" type="number" :value="data.downvotes" @input="updateField('downvotes', parseInt($event.target.value)||0)" min="0">
            </div>
        </div>
        <div class="form-group">
            <label>时间</label>
            <input class="form-input" :value="data.timeAgo" @input="updateField('timeAgo', $event.target.value)" placeholder="如: 3 小时前">
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
                    <span>评论 #{{ idx + 1 }}</span>
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
                        <input class="form-input" type="number" :value="comment.upvotes" @input="updateComment(idx, 'upvotes', parseInt($event.target.value)||0)" min="0" style="font-size:13px;">
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                        <label style="font-size:12px;">时间</label>
                        <input class="form-input" :value="comment.timeAgo" @input="updateComment(idx, 'timeAgo', $event.target.value)" placeholder="时间" style="font-size:13px;">
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
                        <div class="form-row" style="margin-bottom:0;">
                            <div class="form-group" style="margin-bottom:0;">
                                <label style="font-size:11px;">赞</label>
                                <input class="form-input" type="number" :value="reply.upvotes" @input="updateReply(idx, rIdx, 'upvotes', parseInt($event.target.value)||0)" min="0" style="font-size:12px;padding:4px 8px;">
                            </div>
                            <div class="form-group" style="margin-bottom:0;">
                                <label style="font-size:11px;">时间</label>
                                <input class="form-input" :value="reply.timeAgo" @input="updateReply(idx, rIdx, 'timeAgo', $event.target.value)" placeholder="时间" style="font-size:12px;padding:4px 8px;">
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
        updateField(field, value) { this.$emit('update', { ...this.data, [field]: value }); },
        async handleUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            try {
                const base64 = await ImageUtil.fileToBase64(file);
                const compressed = await ImageUtil.compressImage(base64);
                this.updateField('imageUrl', compressed);
            } catch (e) { console.error('图片上传失败:', e.message); }
        },
        addComment() {
            const comments = [...this.data.comments, { author: 'user_' + Math.floor(Math.random()*999), text: '', upvotes: 0, timeAgo: '刚刚', replies: [] }];
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
            const replies = [...(comments[commentIdx].replies || []), { author: 'user_' + Math.floor(Math.random()*999), text: '', upvotes: 0, timeAgo: '刚刚' }];
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

const RedditPreview = {
    name: 'reddit-preview',
    props: ['data'],
    template: `
    <div class="rd-post">
        <div class="rd-post-card">
            <!-- Vote Column -->
            <div class="rd-vote-col">
                <div class="rd-vote-btn up">
                    <svg viewBox="0 0 24 24"><path d="M12 4L4 12h5v8h6v-8h5z"/></svg>
                </div>
                <span class="rd-vote-count">{{ formatVotes(data.upvotes - data.downvotes) }}</span>
                <div class="rd-vote-btn down">
                    <svg viewBox="0 0 24 24"><path d="M12 20l8-8h-5V4H9v8H4z"/></svg>
                </div>
            </div>

            <!-- Content -->
            <div class="rd-post-content">
                <div class="rd-post-meta">
                    <span class="rd-subreddit">{{ data.subreddit || 'r/all' }}</span>
                    <span>·</span>
                    <span>发布者 <span class="rd-post-author">u/{{ data.author || 'username' }}</span></span>
                    <span>·</span>
                    <span>{{ data.timeAgo || '刚刚' }}</span>
                    <span v-if="data.flair" class="rd-flair" :style="{ background: data.flairColor || '#ff4500' }">{{ data.flair }}</span>
                </div>
                <div class="rd-post-title">{{ data.title || '帖子标题' }}</div>
                <div class="rd-post-body" v-if="data.body">{{ data.body }}</div>
                <div class="rd-post-image" v-if="data.imageUrl || data.imageUrlExt">
                    <img :src="data.imageUrl || data.imageUrlExt" alt="post image">
                </div>
                <div class="rd-post-actions">
                    <div class="rd-action-btn">
                        <svg viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
                        {{ data.comments ? data.comments.length : 0 }} 评论
                    </div>
                    <div class="rd-action-btn">
                        <svg viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
                        分享
                    </div>
                    <div class="rd-action-btn">
                        <svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
                        保存
                    </div>
                </div>

                <!-- Comments -->
                <div class="rd-comments" v-if="data.comments && data.comments.length > 0">
                    <div class="rd-comments-header">
                        <span class="rd-comments-title">{{ data.comments.length }} 条评论</span>
                    </div>
                    <div v-for="(comment, idx) in data.comments" :key="idx" class="rd-comment">
                        <div class="rd-comment-header">
                            <div class="rd-comment-avatar">{{ (comment.author || 'U')[0].toUpperCase() }}</div>
                            <span class="rd-comment-author">u/{{ comment.author }}</span>
                            <span class="rd-comment-time">{{ comment.timeAgo || '刚刚' }}</span>
                        </div>
                        <div class="rd-comment-body">{{ comment.text }}</div>
                        <div class="rd-comment-actions">
                            <span class="rd-comment-action">👍 {{ comment.upvotes || 0 }}</span>
                            <span class="rd-comment-action">👎</span>
                            <span class="rd-comment-action">回复</span>
                        </div>
                        <!-- Nested Replies -->
                        <template v-if="(comment.replies || []).length > 0">
                            <div v-for="(reply, rIdx) in (comment.replies || [])" :key="rIdx" class="rd-comment rd-comment-nested">
                                <div class="rd-comment-header">
                                    <div class="rd-comment-avatar" style="width:16px;height:16px;font-size:8px;">{{ (reply.author || 'U')[0].toUpperCase() }}</div>
                                    <span class="rd-comment-author">u/{{ reply.author }}</span>
                                    <span class="rd-comment-time">{{ reply.timeAgo || '刚刚' }}</span>
                                </div>
                                <div class="rd-comment-body">{{ reply.text }}</div>
                                <div class="rd-comment-actions">
                                    <span class="rd-comment-action">👍 {{ reply.upvotes || 0 }}</span>
                                    <span class="rd-comment-action">回复</span>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {
        formatVotes(n) {
            if (!n) return '0';
            if (n >= 10000) return (n / 10000).toFixed(1) + '万';
            if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
            return String(n);
        }
    }
};
