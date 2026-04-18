/**
 * X (Twitter) 平台模块
 */

const TwitterDefaults = {
    displayName: '张三',
    username: 'zhangsan_design',
    verified: true,
    avatar: '',
    avatarUrl: '',
    content: '今天去了三里屯拍照 📷 感觉整个城市都在发光\n\n#北京 #摄影日常 #街拍',
    imageUrl: '',
    imageUrlExt: '',
    timestamp: '下午3:24 · 2024年3月15日',
    replies: 24,
    retweets: 128,
    likes: 1024,
    views: 28600,
    bookmarks: 56,
    isThread: false,
    threadTweets: [],
    quoteTweet: null,
    comments: [
        { username: '李四', text: '太美了！在哪里拍的？', likes: 5, replies: [] },
        { username: '王五', text: '求拍照参数！📸', likes: 3, replies: [] },
        { username: '赵六', text: '这个角度绝了 🔥', likes: 2, replies: [] }
    ]
};

const TwitterEditor = {
    name: 'twitter-editor',
    props: ['data'],
    emits: ['update'],
    template: `
    <div class="twitter-editor">
        <!-- 用户信息 -->
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
            <div class="form-group">
                <label>显示名</label>
                <input class="form-input" :value="data.displayName" @input="updateField('displayName', $event.target.value)" placeholder="显示名称">
            </div>
            <div class="form-group">
                <label>@用户名</label>
                <input class="form-input" :value="data.username" @input="updateField('username', $event.target.value)" placeholder="username">
            </div>
        </div>
        <div class="form-group">
            <label>认证标记</label>
            <div class="toggle-group" style="margin-top:4px;">
                <label class="toggle">
                    <input type="checkbox" :checked="data.verified" @change="updateField('verified', $event.target.checked)">
                    <span class="toggle-slider"></span>
                </label>
                <span style="font-size:13px;">蓝标认证</span>
            </div>
        </div>

        <div class="section-divider"></div>

        <!-- 推文内容 -->
        <div class="sub-title">📝 推文内容</div>
        <div class="form-group">
            <label>正文 <span class="hint">({{ (data.content || '').length }}/280)</span></label>
            <textarea class="form-input" :value="data.content" @input="updateField('content', $event.target.value)" rows="5" placeholder="有什么新鲜事？" maxlength="280"></textarea>
        </div>

        <!-- 图片 -->
        <div class="sub-title">🖼️ 配图</div>
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
            <input type="file" ref="imageInput" accept="image/*" @change="handleUpload($event, 'imageUrl')" hidden>
            <div class="ext-url-row">
                <span class="ext-url-label">🔗</span>
                <input class="form-input ext-url-input" :value="data.imageUrlExt" @input="updateField('imageUrlExt', $event.target.value)" placeholder="外部图片链接（AO3导出用）">
            </div>
        </div>

        <div class="section-divider"></div>

        <div class="sub-title">🔄 引用转发</div>
        <div class="form-group">
            <div class="toggle-group">
                <label class="toggle">
                    <input type="checkbox" :checked="!!data.quoteTweet" @change="toggleQuote">
                    <span class="toggle-slider"></span>
                </label>
                <span style="font-size:13px;">引用转发</span>
            </div>
        </div>
        <template v-if="data.quoteTweet">
            <div class="form-group">
                <label>原推作者</label>
                <input class="form-input" :value="data.quoteTweet.displayName" @input="updateQuote('displayName', $event.target.value)" placeholder="显示名称">
            </div>
            <div class="form-group">
                <label>@用户名</label>
                <input class="form-input" :value="data.quoteTweet.username" @input="updateQuote('username', $event.target.value)" placeholder="username">
            </div>
            <div class="form-group">
                <label>认证</label>
                <div class="toggle-group" style="margin-top:4px;">
                    <label class="toggle">
                        <input type="checkbox" :checked="data.quoteTweet.verified" @change="updateQuote('verified', $event.target.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                    <span style="font-size:13px;">蓝标</span>
                </div>
            </div>
            <div class="form-group">
                <label>原推内容</label>
                <textarea class="form-input" :value="data.quoteTweet.content" @input="updateQuote('content', $event.target.value)" rows="3" placeholder="原推文内容"></textarea>
            </div>
            <div class="form-group">
                <label>原推图片链接</label>
                <input class="form-input ext-url-input" :value="data.quoteTweet.imageUrlExt" @input="updateQuote('imageUrlExt', $event.target.value)" placeholder="外部图片链接">
            </div>
        </template>

        <div class="section-divider"></div>

        <!-- 时间 -->
        <div class="sub-title">🕐 时间</div>
        <div class="form-group">
            <label>时间戳</label>
            <input class="form-input" :value="data.timestamp" @input="updateField('timestamp', $event.target.value)" placeholder="如: 下午3:24 · 2024年3月15日">
        </div>

        <div class="section-divider"></div>

        <!-- 互动数据 -->
        <div class="sub-title">📊 互动数据</div>
        <div class="form-row">
            <div class="form-group">
                <label>回复</label>
                <input class="form-input" type="number" :value="data.replies" @input="updateField('replies', parseInt($event.target.value)||0)" min="0">
            </div>
            <div class="form-group">
                <label>转推</label>
                <input class="form-input" type="number" :value="data.retweets" @input="updateField('retweets', parseInt($event.target.value)||0)" min="0">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>喜欢</label>
                <input class="form-input" type="number" :value="data.likes" @input="updateField('likes', parseInt($event.target.value)||0)" min="0">
            </div>
            <div class="form-group">
                <label>浏览量</label>
                <input class="form-input" type="number" :value="data.views" @input="updateField('views', parseInt($event.target.value)||0)" min="0">
            </div>
        </div>
        <div class="form-group">
            <label>书签</label>
            <input class="form-input" type="number" :value="data.bookmarks" @input="updateField('bookmarks', parseInt($event.target.value)||0)" min="0">
        </div>

        <div class="section-divider"></div>

        <!-- 评论 -->
        <div class="sub-title">💬 评论区 <span class="hint">({{ (data.comments || []).length }}条)</span></div>
        <div class="comment-list">
            <div class="comment-item" v-for="(comment, idx) in (data.comments || [])" :key="idx"
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
                    <label style="font-size:12px;">头像</label>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div v-if="comment.avatar" style="position:relative;width:28px;height:28px;">
                            <img :src="comment.avatar" style="width:28px;height:28px;border-radius:50%;object-fit:cover;">
                            <button style="position:absolute;top:-4px;right:-4px;width:14px;height:14px;border-radius:50%;background:#ff3b30;color:#fff;border:none;font-size:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;" @click.stop="updateComment(idx, 'avatar', '')">✕</button>
                        </div>
                        <div v-else style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#1da1f2,#0d8bd9);display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:700;">{{ (comment.username || 'U')[0].toUpperCase() }}</div>
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
                <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size:12px;">喜欢</label>
                    <div class="number-input-group">
                        <button @click="adjustCommentLikes(idx, -1)">−</button>
                        <input :value="comment.likes" @input="updateComment(idx, 'likes', parseInt($event.target.value)||0)">
                        <button @click="adjustCommentLikes(idx, 1)">+</button>
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
                            <input class="form-input" :value="reply.username" @input="updateReply(idx, rIdx, 'username', $event.target.value)" placeholder="用户名" style="font-size:12px;padding:4px 8px;">
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
        updateField(field, value) {
            this.$emit('update', { ...this.data, [field]: value });
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
        async handleUpload(event, field) {
            const file = event.target.files[0];
            if (!file) return;
            try {
                const base64 = await ImageUtil.fileToBase64(file);
                const compressed = await ImageUtil.compressImage(base64);
                this.updateField(field, compressed);
            } catch (e) { console.error('图片上传失败:', e.message); }
        },
        toggleQuote() {
            if (this.data.quoteTweet) {
                this.updateField('quoteTweet', null);
            } else {
                this.updateField('quoteTweet', {
                    displayName: '原推作者',
                    username: 'original_user',
                    verified: false,
                    content: '',
                    imageUrl: '',
                    imageUrlExt: ''
                });
            }
        },
        updateQuote(field, value) {
            const qt = { ...this.data.quoteTweet, [field]: value };
            this.updateField('quoteTweet', qt);
        },
        addComment() {
            const comments = [...(this.data.comments || []), { username: 'user_' + Math.floor(Math.random() * 999), text: '', likes: 0, avatar: '', avatarUrl: '', replies: [] }];
            this.updateField('comments', comments);
        },
        removeComment(idx) {
            const comments = [...(this.data.comments || [])];
            comments.splice(idx, 1);
            this.updateField('comments', comments);
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
            const replies = [...(comments[commentIdx].replies || []), { username: 'user_' + Math.floor(Math.random()*999), text: '' }];
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
            
            const data = [...(this.data.comments || [])];
            const dragIndex = data.findIndex(c => c === (this.data.comments || [])[data.indexOf(comment)]);
            
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

const TwitterPreview = {
    name: 'twitter-preview',
    props: ['data'],
    template: `
    <div class="tw-tweet">
        <div class="tw-tweet-inner">
            <!-- Header -->
            <div class="tw-header">
                <template v-if="data.avatar || data.avatarUrl">
                    <img class="tw-avatar" :src="data.avatar || data.avatarUrl" :alt="data.displayName">
                </template>
                <template v-else>
                    <div class="tw-avatar-placeholder">{{ (data.displayName || 'U')[0] }}</div>
                </template>
                <div class="tw-header-info">
                    <div class="tw-header-names">
                        <span class="tw-display-name">{{ data.displayName || '用户名' }}</span>
                        <span v-if="data.verified" class="tw-verified-badge">
                            <svg viewBox="0 0 22 22"><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.635-.08 1.293.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.604-.274 1.26-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.143.271.586.702 1.084 1.24 1.438.54.354 1.167.551 1.813.568.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.225 1.261.276 1.894.146.634-.13 1.22-.435 1.69-.88.445-.47.75-1.055.88-1.69.131-.634.084-1.292-.139-1.896.584-.273 1.084-.704 1.438-1.244.355-.54.553-1.17.57-1.817zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"/></svg>
                        </span>
                        <span class="tw-handle">@{{ data.username || 'username' }}</span>
                        <span class="tw-timestamp">·</span>
                    </div>
                </div>
                <div class="tw-more-btn">
                    <svg viewBox="0 0 24 24" width="18" height="18"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
                </div>
            </div>

            <!-- Content -->
            <div class="tw-content" v-html="renderContent(data.content)"></div>

            <!-- Image -->
            <div class="tw-image-container" v-if="data.imageUrl || data.imageUrlExt">
                <img :src="data.imageUrl || data.imageUrlExt" alt="tweet image">
            </div>

            <!-- Quote Tweet Card -->
            <div v-if="data.quoteTweet" class="tw-quote-card">
                <div class="tw-quote-header">
                    <div class="tw-quote-avatar">{{ (data.quoteTweet.displayName || 'U')[0] }}</div>
                    <span class="tw-quote-name">{{ data.quoteTweet.displayName }}</span>
                    <span v-if="data.quoteTweet.verified" class="tw-verified-badge" style="width:14px;height:14px;">
                        <svg viewBox="0 0 22 22"><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.635-.08 1.293.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.604-.274 1.26-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.143.271.586.702 1.084 1.24 1.438.54.354 1.167.551 1.813.568.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.225 1.261.276 1.894.146.634-.13 1.22-.435 1.69-.88.445-.47.75-1.055.88-1.69.131-.634.084-1.292-.139-1.896.584-.273 1.084-.704 1.438-1.244.355-.54.553-1.17.57-1.817zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"/></svg>
                    </span>
                    <span class="tw-quote-handle">@{{ data.quoteTweet.username }}</span>
                </div>
                <div class="tw-quote-content" v-html="renderContent(data.quoteTweet.content)"></div>
                <div v-if="data.quoteTweet.imageUrlExt" class="tw-quote-image">
                    <img :src="data.quoteTweet.imageUrlExt" alt="">
                </div>
            </div>

            <!-- Timestamp -->
            <div class="tw-views" v-if="data.timestamp">
                {{ data.timestamp }}
                <span v-if="data.views"> · </span>
                <span v-if="data.views" style="font-weight:600;">{{ formatCount(data.views) }}</span> 次查看
            </div>

            <!-- Actions -->
            <div class="tw-action-row">
                <div class="tw-action-row-item" title="回复">
                    <svg viewBox="0 0 24 24"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.26-.88 4.27-2.37 5.77l-5.47 5.47c-.29.29-.77.29-1.06 0l-5.47-5.47c-1.5-1.5-2.37-3.52-2.37-5.77z"/></svg>
                </div>
                <div class="tw-action-row-item" title="转推">
                    <svg viewBox="0 0 24 24"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/></svg>
                </div>
                <div class="tw-action-row-item" title="喜欢">
                    <svg viewBox="0 0 24 24"><path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.45-4.92-.32-6.64C4.05 8.49 5.96 7.5 7.91 7.5c1.57 0 3.09.69 4.08 1.83.99-1.14 2.51-1.83 4.08-1.83 1.96 0 3.87.99 5.12 3.05 1.13 1.72 1.04 4.14-.32 6.64z"/></svg>
                </div>
                <div class="tw-action-row-item" title="浏览量">
                    <svg viewBox="0 0 24 24"><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/></svg>
                </div>
                <div class="tw-action-row-item" title="分享">
                    <svg viewBox="0 0 24 24"><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 14l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 20 3 18.88 3 17.5V14h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 14h2z"/></svg>
                </div>
            </div>

            <!-- Comments -->
            <template v-if="data.comments && data.comments.length > 0">
                <div style="border-top:1px solid #e6ecf0; margin-top:12px; padding-top:12px;">
                    <div style="font-size:13px; color:#536471; margin-bottom:8px;">查看全部 {{ data.comments.length }} 条评论</div>
                    <div class="tw-comments">
                        <div class="tw-comment" v-for="(comment, idx) in data.comments" :key="idx">
                            <img v-if="comment.avatar || comment.avatarUrl" class="tw-comment-avatar" :src="comment.avatar || comment.avatarUrl" :alt="comment.username">
                            <div v-else class="tw-comment-avatar">{{ (comment.username || 'U')[0].toUpperCase() }}</div>
                            <div class="tw-comment-content">
                                <div class="tw-comment-header">
                                    <span class="tw-comment-username">{{ comment.username }}</span>
                                    <span class="tw-comment-text">{{ comment.text }}</span>
                                </div>
                                <div class="tw-comment-actions">
                                    <span class="tw-comment-action" title="喜欢">
                                        <svg viewBox="0 0 24 24"><path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.45-4.92-.32-6.64C4.05 8.49 5.96 7.5 7.91 7.5c1.57 0 3.09.69 4.08 1.83.99-1.14 2.51-1.83 4.08-1.83 1.96 0 3.87.99 5.12 3.05 1.13 1.72 1.04 4.14-.32 6.64z"/></svg>
                                    </span>
                                    <span class="tw-comment-action" title="回复">
                                        <svg viewBox="0 0 24 24"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.26-.88 4.27-2.37 5.77l-5.47 5.47c-.29.29-.77.29-1.06 0l-5.47-5.47c-1.5-1.5-2.37-3.52-2.37-5.77z"/></svg>
                                    </span>
                                    <span class="tw-comment-like-count">{{ comment.likes > 0 ? comment.likes : '' }}</span>
                                </div>
                                <div v-if="(comment.replies || []).length > 0" class="tw-comment-replies">
                                    <div v-for="(reply, rIdx) in (comment.replies || [])" :key="rIdx" class="tw-comment-reply">
                                        <span class="tw-comment-username" style="font-size:12px;">{{ reply.username }}</span>
                                        <span class="tw-comment-text" style="font-size:12px;">{{ reply.text }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Stats -->
            <div style="display:flex; justify-content:space-between; padding:4px 16px 12px; font-size:13px; color:#536471;">
                <span><strong style="color:#0f1419;">{{ formatCount(data.retweets) }}</strong> 转推</span>
                <span><strong style="color:#0f1419;">{{ formatCount(data.likes) }}</strong> 喜欢</span>
                <span v-if="data.bookmarks"><strong style="color:#0f1419;">{{ formatCount(data.bookmarks) }}</strong> 书签</span>
            </div>
        </div>
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
                .replace(/#(\S+)/g, '<span class="tw-hashtag">#$1</span>')
                .replace(/@(\S+)/g, '<span class="tw-mention">@$1</span>')
                .replace(/\n/g, '<br>');
        }
    }
};
