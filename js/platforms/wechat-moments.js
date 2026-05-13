/**
 * 微信朋友圈 平台模块（完整页面模式：封面 + 多条动态）
 */

const WeChatMomentsDefaults = {
    ownerName: '张三',
    ownerAvatar: '',
    ownerAvatarUrl: '',
    coverImage: '',
    coverImageUrl: '',
    posts: [
        {
            id: 1,
            authorName: '李四',
            authorAvatar: '',
            authorAvatarUrl: '',
            text: '今天天气真好，出去走走～ 🌞',
            images: [{ image: '', imageUrl: '' }],
            location: '北京市·朝阳区',
            timestamp: '2小时前',
            likes: [{ name: '王五' }, { name: '赵六' }],
            comments: [
                { username: '王五', replyTo: '', text: '好看！' },
                { username: '赵六', replyTo: '李四', text: '在哪里呀？' }
            ]
        },
        {
            id: 2,
            authorName: '张三',
            authorAvatar: '',
            authorAvatarUrl: '',
            text: '刚吃了一碗超好吃的牛肉面 🍜\n推荐给大家！',
            images: [],
            location: '',
            timestamp: '5小时前',
            likes: [{ name: '李四' }],
            comments: [
                { username: '李四', replyTo: '', text: '哪家店？' }
            ]
        }
    ]
};

/* ======================== 编辑器 ======================== */
const WeChatMomentsEditor = {
    name: 'wechat-moments-editor',
    props: ['data'],
    emits: ['update'],
    template: `
    <div class="wechat-moments-editor">
        <!-- 页面设置 -->
        <div class="sub-title">🏠 {{ $t('wm.pageSettings') }}</div>
        <div class="form-group">
            <label>{{ $t('wm.coverImage') }}</label>
            <div class="image-upload" :class="{ 'has-image': data.coverImage }" @click="$refs.coverInput.click()" style="width:100%;height:80px;border-radius:6px;">
                <template v-if="data.coverImage">
                    <img :src="data.coverImage" alt="cover" style="border-radius:6px;">
                    <button class="remove-image" @click.stop="updateField('coverImage', '')">✕</button>
                </template>
                <div v-else class="upload-placeholder">
                    <span>📷</span><small>{{ $t('wm.uploadCover') }}</small>
                </div>
            </div>
            <input type="file" ref="coverInput" accept="image/*" @change="handleUpload($event, 'coverImage')" hidden>
            <div class="ext-url-row">
                <span class="ext-url-label">🔗</span>
                <input class="form-input ext-url-input" :value="data.coverImageUrl" @input="updateField('coverImageUrl', $event.target.value)" :placeholder="$t('wm.externalCoverLink')">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>{{ $t('wm.ownerAvatar') }}</label>
                <div class="image-upload" :class="{ 'has-image': data.ownerAvatar }" @click="$refs.ownerAvatarInput.click()" style="width:60px;height:60px;border-radius:6px;">
                    <template v-if="data.ownerAvatar">
                        <img :src="data.ownerAvatar" alt="avatar" style="border-radius:6px;">
                        <button class="remove-image" @click.stop="updateField('ownerAvatar', '')">✕</button>
                    </template>
                    <div v-else class="upload-placeholder"><span>📷</span><small>{{ $t('common.avatar') }}</small></div>
                </div>
                <input type="file" ref="ownerAvatarInput" accept="image/*" @change="handleUpload($event, 'ownerAvatar')" hidden>
                <div class="ext-url-row">
                    <span class="ext-url-label">🔗</span>
                    <input class="form-input ext-url-input" :value="data.ownerAvatarUrl" @input="updateField('ownerAvatarUrl', $event.target.value)" :placeholder="$t('common.externalAvatarLink')">
                </div>
            </div>
            <div class="form-group">
                <label>{{ $t('wm.ownerName') }}</label>
                <input class="form-input" :value="data.ownerName" @input="updateField('ownerName', $event.target.value)" :placeholder="$t('wm.phOwnerName')">
            </div>
        </div>

        <div class="section-divider"></div>

        <!-- 动态列表 -->
        <div class="sub-title">📋 {{ $t('wm.momentsList') }} <span class="hint">({{ (data.posts || []).length }}{{ $t('common.count') }})</span></div>
        <div class="comment-list">
            <div class="comment-item" v-for="(post, pidx) in (data.posts || [])" :key="pidx"
                draggable="true"
                @dragstart="onPostDragStart(pidx, $event)"
                @dragover.prevent="onPostDragOver(pidx, $event)"
                @dragleave="onPostDragLeave(pidx, $event)"
                @drop="onPostDrop(pidx, $event)"
                :style="{ borderLeft: '3px solid #576b95' }">
                <div class="drag-handle">⋮⋮</div>
                <div class="comment-header">
                    <span><strong :style="{ color: '#576b95' }">{{ $t('wm.moment') }} {{ pidx + 1 }}</strong> <span class="hint">{{ post.authorName || $t('wm.unnamed') }}</span></span>
                    <div style="display:flex;gap:4px;">
                        <button class="remove-comment" style="width:20px;height:20px;font-size:11px;" @click="removePost(pidx)">✕</button>
                    </div>
                </div>

                <!-- 帖子编辑区 -->
                <div class="form-row" style="margin-bottom:0;">
                    <div class="form-group" style="margin-bottom:0;">
                        <label style="font-size:11px;">{{ $t('common.avatar') }}</label>
                        <label class="btn btn-small btn-outline" style="cursor:pointer;font-size:10px;padding:1px 6px;">
                            📷<input type="file" accept="image/*" @change="handlePostAvatar(pidx, $event)" hidden>
                        </label>
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                        <label style="font-size:11px;">{{ $t('wm.nickname') }}</label>
                        <input class="form-input" :value="post.authorName" @input="updatePost(pidx, 'authorName', $event.target.value)" :placeholder="$t('wm.phAuthorName')" style="font-size:12px;">
                    </div>
                </div>
                <div class="ext-url-row" style="margin-top:2px;">
                    <span class="ext-url-label">🔗</span>
                    <input class="form-input ext-url-input" :value="post.authorAvatarUrl" @input="updatePost(pidx, 'authorAvatarUrl', $event.target.value)" :placeholder="$t('common.externalAvatarLink')" style="font-size:11px;">
                </div>

                <div class="form-group" style="margin-bottom:6px;margin-top:6px;">
                    <textarea class="form-input" :value="post.text" @input="updatePost(pidx, 'text', $event.target.value)" :placeholder="$t('wm.phMomentContent')" rows="2" style="font-size:12px;min-height:40px;"></textarea>
                </div>

                <!-- 图片管理 -->
                <div style="margin-bottom:6px;">
                    <label style="font-size:11px;">{{ $t('wm.images') }} ({{ (post.images || []).filter(i => i.image || i.imageUrl).length }}/9)</label>
                    <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;">
                        <div v-for="(img, iidx) in (post.images || [])" :key="iidx" style="position:relative;width:44px;height:44px;">
                            <img v-if="img.image || img.imageUrl" :src="img.image || img.imageUrl" style="width:44px;height:44px;border-radius:3px;object-fit:cover;">
                            <div v-else style="width:44px;height:44px;border-radius:3px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;color:#bbb;font-size:10px;">{{ $t('wm.empty') }}</div>
                            <button style="position:absolute;top:-3px;right:-3px;width:12px;height:12px;border-radius:50%;background:#ff3b30;color:#fff;border:none;font-size:7px;cursor:pointer;line-height:1;" @click="removePostImage(pidx, iidx)">✕</button>
                        </div>
                        <label v-if="(post.images || []).length < 9" class="btn btn-small btn-outline" style="cursor:pointer;width:44px;height:44px;display:flex;align-items:center;justify-content:center;font-size:14px;border-radius:3px;">
                            +<input type="file" accept="image/*" @change="handlePostImage(pidx, $event)" hidden>
                        </label>
                    </div>
                </div>

                <div class="form-row" style="margin-bottom:0;">
                    <div class="form-group" style="margin-bottom:0;">
                        <label style="font-size:11px;">{{ $t('wm.momentLocation') }}</label>
                        <input class="form-input" :value="post.location" @input="updatePost(pidx, 'location', $event.target.value)" :placeholder="$t('wm.momentLocation')" style="font-size:11px;">
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                        <label style="font-size:11px;">{{ $t('wm.momentTime') }}</label>
                        <input class="form-input" :value="post.timestamp" @input="updatePost(pidx, 'timestamp', $event.target.value)" placeholder="2小时前" style="font-size:11px;">
                    </div>
                </div>

                <!-- 点赞 -->
                <div style="margin-top:6px;">
                    <label style="font-size:11px;">{{ $t('wm.momentLikes') }}</label>
                    <div style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;">
                        <input v-for="(like, lidx) in (post.likes || [])" :key="lidx" class="form-input" :value="like.name" @input="updatePostLike(pidx, lidx, $event.target.value)" :placeholder="$t('wm.phName')" style="font-size:11px;width:70px;padding:2px 6px;">
                        <button class="remove-comment" style="width:16px;height:16px;font-size:9px;" @click="removePostLike(pidx, lidx)">✕</button>
                        <button style="font-size:11px;color:#576b95;background:none;border:none;cursor:pointer;" @click="addPostLike(pidx)">{{ $t('wm.addLike') }}</button>
                    </div>
                </div>

                <!-- 评论 -->
                <div style="margin-top:6px;">
                    <label style="font-size:11px;">{{ $t('wm.momentComments') }} ({{ (post.comments || []).length }})</label>
                    <div v-for="(cmt, cidx) in (post.comments || [])" :key="cidx" style="display:flex;gap:4px;align-items:center;margin-top:2px;">
                        <input class="form-input" :value="cmt.username" @input="updatePostComment(pidx, cidx, 'username', $event.target.value)" :placeholder="$t('wm.phName')" style="font-size:11px;width:55px;padding:2px 4px;">
                        <input class="form-input" :value="cmt.replyTo" @input="updatePostComment(pidx, cidx, 'replyTo', $event.target.value)" :placeholder="$t('wm.phReplyTo')" style="font-size:11px;width:45px;padding:2px 4px;">
                        <input class="form-input" :value="cmt.text" @input="updatePostComment(pidx, cidx, 'text', $event.target.value)" :placeholder="$t('wm.phCommentContent')" style="font-size:11px;flex:1;padding:2px 4px;">
                        <button class="remove-comment" style="width:14px;height:14px;font-size:8px;" @click="removePostComment(pidx, cidx)">✕</button>
                    </div>
                    <button style="font-size:11px;color:#576b95;background:none;border:none;cursor:pointer;margin-top:2px;" @click="addPostComment(pidx)">{{ $t('wm.addComment') }}</button>
                </div>
            </div>
            <button class="add-comment-btn" @click="addPost">{{ $t('wm.addMoment') }}</button>
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
            } catch (e) { console.error('图片上传失败:', e.message); }
            event.target.value = '';
        },
        /* ---- Post CRUD ---- */
        addPost() {
            const posts = [...(this.data.posts || []), {
                id: Date.now(), authorName: this.data.ownerName || '', authorAvatar: '', authorAvatarUrl: '',
                text: '', images: [], location: '', timestamp: '刚刚',
                likes: [], comments: []
            }];
            this.updateField('posts', posts);
        },
        removePost(idx) {
            const posts = [...(this.data.posts || [])];
            posts.splice(idx, 1);
            this.updateField('posts', posts);
        },
        updatePost(idx, field, value) {
            const posts = [...(this.data.posts || [])];
            posts[idx] = { ...posts[idx], [field]: value };
            this.updateField('posts', posts);
        },
        async handlePostAvatar(idx, event) {
            const file = event.target.files[0];
            if (!file) return;
            try {
                const base64 = await ImageUtil.fileToBase64(file);
                const compressed = await ImageUtil.compressImage(base64);
                this.updatePost(idx, 'authorAvatar', compressed);
            } catch (e) { console.error('头像上传失败:', e.message); }
            event.target.value = '';
        },
        async handlePostImage(pidx, event) {
            const file = event.target.files[0];
            if (!file) return;
            try {
                const base64 = await ImageUtil.fileToBase64(file);
                const compressed = await ImageUtil.compressImage(base64);
                const posts = [...(this.data.posts || [])];
                const images = [...(posts[pidx].images || []), { image: compressed, imageUrl: '' }];
                posts[pidx] = { ...posts[pidx], images };
                this.updateField('posts', posts);
            } catch (e) { console.error('图片上传失败:', e.message); }
            event.target.value = '';
        },
        removePostImage(pidx, iidx) {
            const posts = [...(this.data.posts || [])];
            const images = [...(posts[pidx].images || [])];
            images.splice(iidx, 1);
            posts[pidx] = { ...posts[pidx], images };
            this.updateField('posts', posts);
        },
        /* ---- Likes ---- */
        addPostLike(pidx) {
            const posts = [...(this.data.posts || [])];
            const likes = [...(posts[pidx].likes || []), { name: '' }];
            posts[pidx] = { ...posts[pidx], likes };
            this.updateField('posts', posts);
        },
        removePostLike(pidx, lidx) {
            const posts = [...(this.data.posts || [])];
            const likes = [...(posts[pidx].likes || [])];
            likes.splice(lidx, 1);
            posts[pidx] = { ...posts[pidx], likes };
            this.updateField('posts', posts);
        },
        updatePostLike(pidx, lidx, value) {
            const posts = [...(this.data.posts || [])];
            const likes = [...(posts[pidx].likes || [])];
            likes[lidx] = { ...likes[lidx], name: value };
            posts[pidx] = { ...posts[pidx], likes };
            this.updateField('posts', posts);
        },
        /* ---- Comments ---- */
        addPostComment(pidx) {
            const posts = [...(this.data.posts || [])];
            const comments = [...(posts[pidx].comments || []), { username: '', replyTo: '', text: '' }];
            posts[pidx] = { ...posts[pidx], comments };
            this.updateField('posts', posts);
        },
        removePostComment(pidx, cidx) {
            const posts = [...(this.data.posts || [])];
            const comments = [...(posts[pidx].comments || [])];
            comments.splice(cidx, 1);
            posts[pidx] = { ...posts[pidx], comments };
            this.updateField('posts', posts);
        },
        updatePostComment(pidx, cidx, field, value) {
            const posts = [...(this.data.posts || [])];
            const comments = [...(posts[pidx].comments || [])];
            comments[cidx] = { ...comments[cidx], [field]: value };
            posts[pidx] = { ...posts[pidx], comments };
            this.updateField('posts', posts);
        },
        /* ---- Drag posts ---- */
        onPostDragStart(idx, event) {
            event.dataTransfer.setData('text/plain', String(idx));
            const el = event.target.closest('.comment-item');
            if (el) el.classList.add('dragging');
        },
        onPostDragOver(idx, event) {
            event.preventDefault();
            const el = event.target.closest('.comment-item');
            if (!el) return;
            el.classList.remove('drag-over', 'drag-over-bottom');
            el.classList.add(event.clientY < el.getBoundingClientRect().top + el.getBoundingClientRect().height / 2 ? 'drag-over' : 'drag-over-bottom');
        },
        onPostDragLeave(idx, event) {
            const el = event.target.closest('.comment-item');
            if (el) el.classList.remove('drag-over', 'drag-over-bottom');
        },
        onPostDrop(idx, event) {
            event.preventDefault();
            const posts = [...(this.data.posts || [])];
            const dragIdx = parseInt(event.dataTransfer.getData('text/plain'));
            if (isNaN(dragIdx) || dragIdx === idx) return;
            const [removed] = posts.splice(dragIdx, 1);
            posts.splice(idx, 0, removed);
            this.updateField('posts', posts);
            document.querySelectorAll('.comment-item').forEach(el => el.classList.remove('dragging', 'drag-over', 'drag-over-bottom'));
        }
    }
};

/* ======================== 预览 ======================== */
const WeChatMomentsPreview = {
    name: 'wechat-moments-preview',
    props: ['data'],
    template: `
    <div class="wm-feed">
        <!-- 封面区域 -->
        <div class="wm-cover">
            <img v-if="data.coverImage || data.coverImageUrl" :src="data.coverImage || data.coverImageUrl" class="wm-cover-img">
            <div v-else class="wm-cover-placeholder"></div>
            <div class="wm-owner-bar">
                <span class="wm-owner-name">{{ data.ownerName || $t('wm.defaultUser') }}</span>
                <div class="wm-owner-avatar" :style="ownerAvatarStyle">
                    <img v-if="data.ownerAvatar || data.ownerAvatarUrl" :src="data.ownerAvatar || data.ownerAvatarUrl">
                    <span v-else>{{ (data.ownerName || 'U')[0] }}</span>
                </div>
            </div>
        </div>

        <!-- 动态列表 -->
        <div class="wm-timeline">
            <div class="wm-post" v-for="(post, pidx) in (data.posts || [])" :key="pidx">
                <div class="wm-post-body">
                    <div class="wm-avatar-col">
                        <div class="wm-avatar" :style="postAvatarStyle(post)">
                            <img v-if="post.authorAvatar || post.authorAvatarUrl" :src="post.authorAvatar || post.authorAvatarUrl">
                            <span v-else>{{ (post.authorName || 'U')[0] }}</span>
                        </div>
                    </div>
                    <div class="wm-content-col">
                        <div class="wm-username">{{ post.authorName || $t('wm.defaultUser') }}</div>
                        <div v-if="post.text" class="wm-text">{{ post.text }}</div>

                        <!-- 图片 -->
                        <div v-if="hasPostImages(post)" :class="['wm-images', 'wm-images-' + postImageClass(post)]">
                            <div class="wm-img-item" v-for="(img, iidx) in (post.images || [])" :key="iidx" v-show="img.image || img.imageUrl">
                                <img :src="img.image || img.imageUrl">
                            </div>
                        </div>

                        <!-- 位置 + 时间 -->
                        <div class="wm-meta">
                            <span v-if="post.location" class="wm-location">{{ post.location }}</span>
                            <span class="wm-time">{{ post.timestamp || '' }}</span>
                        </div>

                        <!-- 互动 -->
                        <div v-if="hasPostLikes(post) || hasPostComments(post)" class="wm-actions">
                            <div v-if="hasPostLikes(post)" class="wm-likes">
                                <span class="wm-likes-icon">❤</span>
                                <span class="wm-likes-names">{{ postLikesText(post) }}</span>
                            </div>
                            <div v-if="hasPostComments(post)" class="wm-comments">
                                <div class="wm-comment" v-for="(cmt, cidx) in (post.comments || []).filter(c => c.text)" :key="cidx">
                                    <span class="wm-cmt-name">{{ cmt.username || '匿名' }}</span>
                                    <template v-if="cmt.replyTo">
                                        <span class="wm-cmt-reply"> {{ $t('wm.replyLabel') }} </span>
                                        <span class="wm-cmt-name">{{ cmt.replyTo }}</span>
                                    </template>
                                    <span class="wm-cmt-text">: {{ cmt.text }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {
        ownerAvatarStyle() {
            const hasImg = this.data.ownerAvatar || this.data.ownerAvatarUrl;
            return { background: hasImg ? 'transparent' : '#07c160' };
        },
        postAvatarStyle(post) {
            const hasImg = post.authorAvatar || post.authorAvatarUrl;
            return { background: hasImg ? 'transparent' : '#576b95' };
        },
        hasPostImages(post) {
            return (post.images || []).some(i => i.image || i.imageUrl);
        },
        hasPostLikes(post) {
            return (post.likes || []).some(l => l.name);
        },
        hasPostComments(post) {
            return (post.comments || []).some(c => c.text);
        },
        postImageClass(post) {
            const c = (post.images || []).filter(i => i.image || i.imageUrl).length;
            if (c <= 1) return 'single';
            if (c === 2) return 'double';
            return 'grid';
        },
        postLikesText(post) {
            return (post.likes || []).filter(l => l.name).map(l => l.name).join('、');
        }
    }
};
