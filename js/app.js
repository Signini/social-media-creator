/**
 * 社交媒体内容创作器 - 主应用
 */
// 确保Vue已经加载
if (typeof Vue === 'undefined') {
    console.error('❌ Vue 3 未加载，请检查网络连接');
} else {
    console.log('✅ Vue 3 已加载');
    const { createApp, ref, reactive, computed, watch, onMounted, nextTick } = Vue;
    
    const app = createApp({
    data() {
        return {
            currentPlatform: 'xiaohongshu',
            deviceMode: 'phone',
            platformRegion: 'domestic',
            showLoadModal: false,
            showSaveModal: false,
            saveProjectName: '',
            projectId: null,
            toast: { visible: false, message: '' },
            platforms: [
                { id: 'xiaohongshu', name: '小红书', icon: '📕', status: 'ready', region: 'domestic' },
                { id: 'instagram', name: 'Instagram', icon: '📸', status: 'ready', region: 'international' },
                { id: 'twitter', name: 'X', icon: '🐦', status: 'ready', region: 'international' },
                { id: 'reddit', name: 'Reddit', icon: '🔴', status: 'ready', region: 'international' },
                { id: 'youtube', name: 'YouTube', icon: '▶️', status: 'ready', region: 'international' },
                { id: 'imessage', name: 'iMessage', icon: '💬', status: 'ready', region: 'international' },
                { id: 'whatsapp', name: 'WhatsApp', icon: '📱', status: 'ready', region: 'international' }
            ],
            projectData: {
                instagram: {
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
                },
                twitter: {
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
                    quoteTweet: null,
                    isThread: false,
                    threadTweets: [],
                    comments: [
                        { username: '李四', text: '太美了！在哪里拍的？', likes: 5, avatar: '', avatarUrl: '', replies: [] },
                        { username: '王五', text: '求拍照参数！📸', likes: 3, avatar: '', avatarUrl: '', replies: [] },
                        { username: '赵六', text: '这个角度绝了 🔥', likes: 2, avatar: '', avatarUrl: '', replies: [] }
                    ]
                },
                reddit: {
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
                },
                youtube: {
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
                },
                imessage: {
                    contactName: '李四',
                    contactAvatar: '',
                    contactAvatarUrl: '',
                    showTyping: false,
                    showReadReceipt: true,
                    readReceiptText: '已读',
                    timeSeparator: '下午 3:24',
                    dateSeparator: '今天',
                    messages: [
                        { id: 1, type: 'received', text: '在吗？想问你个事 😊', image: '', imageUrl: '', time: '下午 3:20', reaction: '' },
                        { id: 2, type: 'sent', text: '在的，你说', image: '', imageUrl: '', time: '下午 3:21', reaction: '' },
                        { id: 3, type: 'received', text: '周末要不要一起去三里屯拍照？听说那边新开了一家咖啡馆，装修特别好看', image: '', imageUrl: '', time: '下午 3:22', reaction: '' },
                        { id: 4, type: 'received', text: '', image: '', imageUrl: '', time: '下午 3:23', reaction: '' },
                        { id: 5, type: 'sent', text: '好啊！我正好想去！几点？', image: '', imageUrl: '', time: '下午 3:24', reaction: '❤️' },
                        { id: 6, type: 'sent', text: '', image: '', imageUrl: '', time: '', reaction: '' },
                        { id: 7, type: 'received', text: '', image: '', imageUrl: '', time: '下午 3:25', reaction: '', isCall: true, callType: 'voice', callDuration: '5:23', callStatus: 'answered' }
                    ]
                },
                whatsapp: {
                    contactName: '张三',
                    contactAvatar: '',
                    contactAvatarUrl: '',
                    contactStatus: '在线',
                    dateSeparator: '今天',
                    showTyping: false,
                    showReadReceipt: true,
                    readReceiptText: '已读',
                    theme: 'whatsapp',
                    customBgColor: '#efeae2',
                    customHeaderColor: '#075e54',
                    isGroup: false,
                    groupName: '好友群',
                    groupMembers: [
                        { name: '张三', avatar: '', avatarUrl: '', color: '#25d366' },
                        { name: '李四', avatar: '', avatarUrl: '', color: '#ff6b6b' },
                        { name: '王五', avatar: '', avatarUrl: '', color: '#4ecdc4' }
                    ],
                    messages: [
                        { id: 1, type: 'received', text: '嗨！最近怎么样？', image: '', imageUrl: '', time: '下午 2:30', reaction: '', ticks: '', sender: 0 },
                        { id: 2, type: 'sent', text: '挺好的！你呢？', image: '', imageUrl: '', time: '下午 2:31', reaction: '', ticks: 'read', sender: -1 },
                        { id: 3, type: 'received', text: '我也不错 😊 周末有空一起吃饭吗？', image: '', imageUrl: '', time: '下午 2:32', reaction: '', ticks: '', sender: 1 },
                        { id: 4, type: 'sent', text: '好啊！去哪里？', image: '', imageUrl: '', time: '下午 2:33', reaction: '❤️', ticks: 'read', sender: -1 },
                        { id: 5, type: 'received', text: '', image: '', imageUrl: '', time: '下午 2:35', reaction: '', ticks: '', sender: 0, isVoice: true, voiceDuration: '0:08', voiceTranscription: '好的，那我们周末见！' },
                        { id: 6, type: 'sent', text: '', image: '', imageUrl: '', time: '下午 2:36', reaction: '', ticks: 'read', sender: -1, isVoice: true, voiceDuration: '0:03', voiceTranscription: '' },
                        { id: 7, type: 'sent', text: '', image: '', imageUrl: '', time: '下午 2:37', reaction: '', ticks: '', sender: -1, isVoice: false, voiceDuration: '0:01', voiceTranscription: '', isCall: true, callType: 'voice', callDuration: '5:23', callStatus: 'answered' }
                    ]
                },
                xiaohongshu: {
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
                    comments: [
                        { username: '摄影爱好者小李', text: '太好看了吧！请问用什么手机拍的？', likes: 23, avatar: '', avatarUrl: '', replies: [
                            { username: '生活记录者小张', text: 'iPhone 15 Pro Max～', avatar: '', avatarUrl: '' }
                        ]},
                        { username: '旅行达人小王', text: '三里屯的日落确实很绝 🔥', likes: 8, avatar: '', avatarUrl: '', replies: [] }
                    ],
                    timestamp: '2小时前',
                    showFollowBtn: true
                }
            },
            currentView: 'single',
            universalData: { items: [] },
            editingUniversalIndex: -1,
            savedProjects: []
        };
    },

    computed: {
        filteredPlatforms() {
            return this.platforms.filter(p => p.region === this.platformRegion);
        }
    },

    mounted() {
        console.log('🔧 Vue 应用已挂载，开始初始化...');

        // 先关闭所有弹窗，避免加载项目列表时触发
        this.showLoadModal = false;
        this.showSaveModal = false;

        // 检查 localStorage 中的数据
        const savedData = localStorage.getItem(StorageUtil.STORAGE_KEY);
        console.log('📦 localStorage 数据:', savedData ? JSON.parse(savedData) : '无数据');

        // 加载项目列表
        this.loadSavedProjectsList();

        // 数据迁移：为旧数据补充 replies 字段
        this._migrateData();

        // 再次确保所有弹窗关闭（防止加载项目列表时触发）
        this.$nextTick(() => {
            this.showLoadModal = false;
            this.showSaveModal = false;
            console.log('✅ 弹窗状态已确认:', {
                showLoadModal: this.showLoadModal,
                showSaveModal: this.showSaveModal
            });
        });

        // 检查数据是否正确加载
        console.log('📊 当前平台:', this.currentPlatform);
        console.log('📊 Instagram 数据:', this.projectData.instagram);

        // 显示欢迎信息
        this.showToast('🎉 社交媒体创作器已就绪！');
    },

    methods: {
        _migrateData() {
            const platforms = ['instagram', 'twitter', 'youtube', 'xiaohongshu'];
            for (const p of platforms) {
                const comments = this.projectData[p] && this.projectData[p].comments;
                if (Array.isArray(comments)) {
                    for (let i = 0; i < comments.length; i++) {
                        if (!comments[i].replies) {
                            comments[i] = { ...comments[i], replies: [] };
                        }
                    }
                }
            }
        },
        /**
         * 切换平台
         */
        switchPlatform(platformId) {
            this.currentPlatform = platformId;
            this.editingUniversalIndex = -1;
            const p = this.platforms.find(p => p.id === platformId);
            if (p && p.region !== this.platformRegion) {
                this.platformRegion = p.region;
            }
        },

        resetCurrentPlatform() {
            this.editingUniversalIndex = -1;
            const platform = this.currentPlatform;
            const methodName = 'getDefault' + platform.charAt(0).toUpperCase() + platform.slice(1) + 'Data';
            if (this[methodName]) {
                this.projectData[platform] = this[methodName]();
                const name = this.platforms.find(p => p.id === platform)?.name || platform;
                this.showToast('🔄 ' + name + ' 已重置为空白内容');
            }
        },

        switchView(view) {
            this.currentView = view;
            if (view !== 'single') {
                this.editingUniversalIndex = -1;
            }
        },

        addToUniversal() {
            const platform = this.currentPlatform;
            const data = JSON.parse(JSON.stringify(this.projectData[platform]));
            this.universalData.items.push({
                id: 'uni_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
                platform,
                data,
                addedAt: new Date().toLocaleString('zh-CN')
            });
            this.editingUniversalIndex = -1;
            const platformName = this.platforms.find(p => p.id === platform)?.name || platform;
            this.showToast('✅ ' + platformName + ' 已添加到综合页面（共 ' + this.universalData.items.length + ' 个模块）');
        },

        updateUniversalItem() {
            const idx = this.editingUniversalIndex;
            if (idx < 0 || idx >= this.universalData.items.length) return;
            const item = this.universalData.items[idx];
            const platform = item.platform;
            this.universalData.items[idx] = {
                ...item,
                data: JSON.parse(JSON.stringify(this.projectData[platform])),
                addedAt: new Date().toLocaleString('zh-CN')
            };
            this.universalData = { ...this.universalData };
            this.editingUniversalIndex = -1;
            const platformName = this.platforms.find(p => p.id === platform)?.name || platform;
            this.showToast('✅ ' + platformName + ' 已更新到综合页面');
        },

        updateUniversalData(newData) {
            this.universalData = { ...this.universalData, ...newData };
        },

        editUniversalItem(idx) {
            const item = this.universalData.items[idx];
            if (!item) return;
            this.projectData[item.platform] = JSON.parse(JSON.stringify(item.data));
            this.currentPlatform = item.platform;
            this.editingUniversalIndex = idx;
            this.currentView = 'single';
            this.showToast('✏️ 已加载模块到编辑器，编辑完点击「更新综合页面」');
        },

        /**
         * 更新平台数据
         */
        updatePlatformData(platform, data) {
            this.projectData[platform] = { ...data };
        },

        /**
         * 显示 Toast 提示
         */
        showToast(message, duration = 2500) {
            this.toast = { visible: true, message };
            setTimeout(() => {
                this.toast.visible = false;
            }, duration);
        },

        // ========== 项目管理 ==========

        /**
         * 保存项目
         */
        saveProject() {
            this.saveProjectName = '';
            this.showSaveModal = true;
        },

        confirmSaveProject() {
            const project = {
                id: this.projectId || StorageUtil.generateId(),
                name: this.saveProjectName || '未命名项目',
                platform: this.currentPlatform,
                data: this.projectData,
                universalData: this.universalData,
                savedAt: new Date().toLocaleString('zh-CN')
            };

            if (StorageUtil.save(project)) {
                this.projectId = project.id;
                this.showSaveModal = false;
                this.loadSavedProjectsList();
                this.showToast('✅ 项目保存成功！');
            } else {
                this.showToast('❌ 保存失败，请重试');
            }
        },

        /**
         * 加载项目列表
         */
        loadSavedProjectsList() {
            this.savedProjects = StorageUtil.getAll();
        },

        /**
         * 加载项目
         */
        loadProject(project) {
            try {
                this.projectData = { ...this.getDefaultData(), ...project.data };
                this.currentPlatform = project.platform || 'instagram';
                this.projectId = project.id;
                this.universalData = project.universalData || { items: [] };
                this._migrateData();
                this.showLoadModal = false;
                this.showToast('✅ 项目加载成功！');
            } catch (e) {
                this.showToast('❌ 加载失败：数据格式错误');
            }
        },

        /**
         * 删除项目
         */
        deleteProject(index) {
            if (confirm('确定删除这个项目吗？')) {
                StorageUtil.delete(index);
                this.loadSavedProjectsList();
                this.showToast('🗑️ 项目已删除');
            }
        },

        /**
         * 清除所有数据
         */
        clearAllData() {
            if (confirm('⚠️ 确定清除所有保存的数据吗？此操作不可恢复！')) {
                localStorage.removeItem(StorageUtil.STORAGE_KEY);
                this.savedProjects = [];
                this.projectId = null;
                this.projectData = this.getDefaultData();
                this.universalData = { items: [] };
                this.showToast('✅ 所有数据已清除');
                console.log('🗑️ 已清除所有数据');
            }
        },

        /**
         * 获取默认数据
         */
        getDefaultData() {
            return {
                instagram: this.getDefaultInstagramData(),
                twitter: this.getDefaultTwitterData(),
                reddit: this.getDefaultRedditData(),
                youtube: this.getDefaultYoutubeData(),
                imessage: this.getDefaultImessageData(),
                whatsapp: this.getDefaultWhatsAppData(),
                xiaohongshu: this.getDefaultXiaohongshuData()
            };
        },

        /**
         * Instagram 默认数据
         */
        getDefaultInstagramData() {
            return {
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
        },

        /**
         * Twitter 默认数据
         */
        getDefaultTwitterData() {
            return {
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
                quoteTweet: null,
                isThread: false,
                threadTweets: [],
                comments: [
                    { username: '李四', text: '太美了！在哪里拍的？', likes: 5, avatar: '', avatarUrl: '', replies: [] },
                    { username: '王五', text: '求拍照参数！📸', likes: 3, avatar: '', avatarUrl: '', replies: [] },
                    { username: '赵六', text: '这个角度绝了 🔥', likes: 2, avatar: '', avatarUrl: '', replies: [] }
                ]
            };
        },

        /**
         * Reddit 默认数据
         */
        getDefaultRedditData() {
            return {
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
        },

        /**
         * YouTube 默认数据
         */
        getDefaultYoutubeData() {
            return {
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
        },

        /**
         * iMessage 默认数据
         */
        getDefaultImessageData() {
            return {
                contactName: '李四',
                contactAvatar: '',
                contactAvatarUrl: '',
                showTyping: false,
                showReadReceipt: true,
                readReceiptText: '已读',
                timeSeparator: '下午 3:24',
                dateSeparator: '今天',
                messages: [
                    { id: 1, type: 'received', text: '在吗？想问你个事 😊', image: '', imageUrl: '', time: '下午 3:20', reaction: '' },
                    { id: 2, type: 'sent', text: '在的，你说', image: '', imageUrl: '', time: '下午 3:21', reaction: '' },
                    { id: 3, type: 'received', text: '周末要不要一起去三里屯拍照？听说那边新开了一家咖啡馆，装修特别好看', image: '', imageUrl: '', time: '下午 3:22', reaction: '' },
                    { id: 4, type: 'received', text: '', image: '', imageUrl: '', time: '下午 3:23', reaction: '' },
                    { id: 5, type: 'sent', text: '好啊！我正好想去！几点？', image: '', imageUrl: '', time: '下午 3:24', reaction: '❤️' },
                    { id: 6, type: 'sent', text: '', image: '', imageUrl: '', time: '', reaction: '' },
                    { id: 7, type: 'received', text: '', image: '', imageUrl: '', time: '下午 3:25', reaction: '', isCall: true, callType: 'voice', callDuration: '5:23', callStatus: 'answered' }
                ]
            };
        },

        /**
         * WhatsApp 默认数据
         */
        getDefaultWhatsAppData() {
            return {
                contactName: '张三',
                contactAvatar: '',
                contactAvatarUrl: '',
                contactStatus: '在线',
                dateSeparator: '今天',
                showTyping: false,
                showReadReceipt: true,
                readReceiptText: '已读',
                theme: 'whatsapp',
                customBgColor: '#efeae2',
                customHeaderColor: '#075e54',
                isGroup: false,
                groupName: '好友群',
                groupMembers: [
                    { name: '张三', avatar: '', avatarUrl: '', color: '#25d366' },
                    { name: '李四', avatar: '', avatarUrl: '', color: '#ff6b6b' },
                    { name: '王五', avatar: '', avatarUrl: '', color: '#4ecdc4' }
                ],
                messages: [
                    { id: 1, type: 'received', text: '嗨！最近怎么样？', image: '', imageUrl: '', time: '下午 2:30', reaction: '', ticks: '', sender: 0 },
                    { id: 2, type: 'sent', text: '挺好的！你呢？', image: '', imageUrl: '', time: '下午 2:31', reaction: '', ticks: 'read', sender: -1 },
                    { id: 3, type: 'received', text: '我也不错 😊 周末有空一起吃饭吗？', image: '', imageUrl: '', time: '下午 2:32', reaction: '', ticks: '', sender: 1 },
                    { id: 4, type: 'sent', text: '好啊！去哪里？', image: '', imageUrl: '', time: '下午 2:33', reaction: '❤️', ticks: 'read', sender: -1 },
                    { id: 5, type: 'received', text: '', image: '', imageUrl: '', time: '下午 2:35', reaction: '', ticks: '', sender: 0, isVoice: true, voiceDuration: '0:08', voiceTranscription: '好的，那我们周末见！' },
                    { id: 6, type: 'sent', text: '', image: '', imageUrl: '', time: '下午 2:36', reaction: '', ticks: 'read', sender: -1, isVoice: true, voiceDuration: '0:03', voiceTranscription: '' },
                    { id: 7, type: 'sent', text: '', image: '', imageUrl: '', time: '下午 2:37', reaction: '', ticks: '', sender: -1, isVoice: false, voiceDuration: '0:01', voiceTranscription: '', isCall: true, callType: 'voice', callDuration: '5:23', callStatus: 'answered' }
                ]
            };
        },

        getDefaultXiaohongshuData() {
            return {
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
                comments: [
                    { username: '摄影爱好者小李', text: '太好看了吧！请问用什么手机拍的？', likes: 23, avatar: '', avatarUrl: '', replies: [
                        { username: '生活记录者小张', text: 'iPhone 15 Pro Max～' }
                    ]},
                    { username: '旅行达人小王', text: '三里屯的日落确实很绝 🔥', likes: 8, avatar: '', avatarUrl: '', replies: [] }
                ],
                timestamp: '2小时前',
                showFollowBtn: true
            };
        },

        // ========== 导入导出 ==========

        /**
         * 导出 JSON 配置
         */
        exportJSON() {
            const config = {
                version: '2.0',
                data: this.projectData,
                universalData: this.universalData,
                exportedAt: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `social-media-project-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.showToast('📤 配置文件已导出');
        },

        /**
         * 导入 JSON 配置
         */
        importJSON(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const config = JSON.parse(e.target.result);
                    if (config.data) {
                        this.projectData = { ...this.getDefaultData(), ...config.data };
                        this.currentPlatform = config.platform || 'instagram';
                        this.universalData = config.universalData || { items: [] };
                        this.showToast('📥 配置导入成功！');
                    } else {
                        this.showToast('❌ 配置文件格式错误');
                    }
                } catch (err) {
                    this.showToast('❌ 文件解析失败');
                }
            };
            reader.readAsText(file);
            // 重置 input 以允许再次选择同一文件
            event.target.value = '';
        },

        // ========== HTML 导出 ==========

        /**
         * 导出 HTML 文件
         */
        exportHTML() {
            const previewEl = this.$refs.previewContent;
            if (!previewEl) {
                this.showToast('❌ 没有可导出的内容');
                return;
            }

            try {
                const html = ExporterUtil.exportHTML(previewEl, this.currentPlatform);
                const platformName = this.platforms.find(p => p.id === this.currentPlatform)?.name || 'social';
                ExporterUtil.downloadHTML(html, `${platformName}-content.html`);
                this.showToast('📥 HTML 文件已下载！');
            } catch (e) {
                console.error('导出失败:', e);
                this.showToast('❌ 导出失败：' + e.message);
            }
        },

        /**
         * 复制 HTML 到剪贴板
         */
        async copyHTML() {
            const previewEl = this.$refs.previewContent;
            if (!previewEl) {
                this.showToast('❌ 没有可复制的内容');
                return;
            }

            try {
                const html = ExporterUtil.copyHTMLFragment(previewEl, this.currentPlatform);
                await navigator.clipboard.writeText(html);
                this.showToast('📋 HTML 已复制到剪贴板！');
            } catch (e) {
                try {
                    const html = ExporterUtil.copyHTMLFragment(previewEl, this.currentPlatform);
                    const textarea = document.createElement('textarea');
                    textarea.value = html;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    this.showToast('📋 HTML 已复制到剪贴板！');
                } catch (e2) {
                    this.showToast('❌ 复制失败，请手动导出 HTML');
                }
            }
        },

        exportCompatible() {
            const previewEl = this.$refs.previewContent;
            if (!previewEl) {
                this.showToast('❌ 没有可导出的内容');
                return;
            }

            try {
                const platformName = this.platforms.find(p => p.id === this.currentPlatform)?.name || 'social';
                const html = ExporterUtil.exportCompatibleHTML(previewEl, this.currentPlatform);
                ExporterUtil.downloadText(html, `${platformName}-compatible.html`);
                this.showToast('📥 兼容 HTML 已下载！');
            } catch (e) {
                console.error('导出失败:', e);
                this.showToast('❌ 导出失败：' + e.message);
            }
        }
    }
});

// 检查组件是否已加载
const componentCheck = {
    'InstagramEditor': !!InstagramEditor,
    'InstagramPreview': !!InstagramPreview,
    'TwitterEditor': !!TwitterEditor,
    'TwitterPreview': !!TwitterPreview,
    'RedditEditor': !!RedditEditor,
    'RedditPreview': !!RedditPreview,
    'YouTubeEditor': !!YouTubeEditor,
    'YouTubePreview': !!YouTubePreview,
    'iMessageEditor': !!iMessageEditor,
    'iMessagePreview': !!iMessagePreview,
    'WhatsAppEditor': !!WhatsAppEditor,
    'WhatsAppPreview': !!WhatsAppPreview,
    'XiaohongshuEditor': !!XiaohongshuEditor,
    'XiaohongshuPreview': !!XiaohongshuPreview
};

console.log('📦 组件检查:', componentCheck);

// 注册组件
if (InstagramEditor) {
    app.component('instagram-editor', InstagramEditor);
    console.log('✅ InstagramEditor 已注册');
} else {
    console.error('❌ InstagramEditor 未加载，无法注册');
}

if (InstagramPreview) {
    app.component('instagram-preview', InstagramPreview);
    console.log('✅ InstagramPreview 已注册');
} else {
    console.error('❌ InstagramPreview 未加载，无法注册');
}

if (TwitterEditor) {
    app.component('twitter-editor', TwitterEditor);
    console.log('✅ TwitterEditor 已注册');
} else {
    console.error('❌ TwitterEditor 未加载，无法注册');
}

if (TwitterPreview) {
    app.component('twitter-preview', TwitterPreview);
    console.log('✅ TwitterPreview 已注册');
} else {
    console.error('❌ TwitterPreview 未加载，无法注册');
}

if (RedditEditor) {
    app.component('reddit-editor', RedditEditor);
    console.log('✅ RedditEditor 已注册');
} else {
    console.error('❌ RedditEditor 未加载，无法注册');
}

if (RedditPreview) {
    app.component('reddit-preview', RedditPreview);
    console.log('✅ RedditPreview 已注册');
} else {
    console.error('❌ RedditPreview 未加载，无法注册');
}

if (YouTubeEditor) {
    app.component('youtube-editor', YouTubeEditor);
    console.log('✅ YouTubeEditor 已注册');
} else {
    console.error('❌ YouTubeEditor 未加载，无法注册');
}

if (YouTubePreview) {
    app.component('youtube-preview', YouTubePreview);
    console.log('✅ YouTubePreview 已注册');
} else {
    console.error('❌ YouTubePreview 未加载，无法注册');
}

if (iMessageEditor) {
    app.component('imessage-editor', iMessageEditor);
    console.log('✅ iMessageEditor 已注册');
} else {
    console.error('❌ iMessageEditor 未加载，无法注册');
}

if (iMessagePreview) {
    app.component('imessage-preview', iMessagePreview);
    console.log('✅ iMessagePreview 已注册');
} else {
    console.error('❌ iMessagePreview 未加载，无法注册');
}

if (WhatsAppEditor) {
    app.component('whatsapp-editor', WhatsAppEditor);
    console.log('✅ WhatsAppEditor 已注册');
} else {
    console.error('❌ WhatsAppEditor 未加载，无法注册');
}

if (WhatsAppPreview) {
    app.component('whatsapp-preview', WhatsAppPreview);
    console.log('✅ WhatsAppPreview 已注册');
} else {
    console.error('❌ WhatsAppPreview 未加载，无法注册');
}

if (XiaohongshuEditor) {
    app.component('xiaohongshu-editor', XiaohongshuEditor);
    console.log('✅ XiaohongshuEditor 已注册');
} else {
    console.error('❌ XiaohongshuEditor 未加载，无法注册');
}

if (XiaohongshuPreview) {
    app.component('xiaohongshu-preview', XiaohongshuPreview);
    console.log('✅ XiaohongshuPreview 已注册');
} else {
    console.error('❌ XiaohongshuPreview 未加载，无法注册');
}

if (UniversalEditor) {
    app.component('universal-editor', UniversalEditor);
    console.log('✅ UniversalEditor 已注册');
} else {
    console.error('❌ UniversalEditor 未加载，无法注册');
}

// 挂载
try {
    app.mount('#app');
    console.log('✅ Vue 应用已成功挂载');
} catch (e) {
    console.error('❌ Vue 应用挂载失败:', e);
}

} // 闭合 else (typeof Vue !== 'undefined') 块