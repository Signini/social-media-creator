/**
 * WhatsApp 平台模块
 */

const WhatsAppThemes = [
    { id: 'whatsapp', name: '经典', bg: '#efeae2', header: '#075e54' },
    { id: 'dark', name: '深色', bg: '#0b141a', header: '#1f2c34' },
    { id: 'ocean', name: '海洋', bg: '#1a2732', header: '#0d2137' },
    { id: 'lavender', name: '薰衣草', bg: '#e8dff5', header: '#5c4b8a' },
    { id: 'rose', name: '玫瑰', bg: '#fce4ec', header: '#b04060' },
    { id: 'mint', name: '薄荷', bg: '#e0f2f1', header: '#1b7a6e' },
    { id: 'sunset', name: '日落', bg: '#fff3e0', header: '#c75b12' },
    { id: 'custom', name: '自定义', bg: '#efeae2', header: '#075e54' }
];

const WhatsAppDefaults = {
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
        { id: 5, type: 'system', systemType: 'addMember', systemActor: 0, systemTarget: 2, systemText: '' },
        { id: 6, type: 'received', text: '', image: '', imageUrl: '', time: '下午 2:35', reaction: '', ticks: '', sender: 0, isVoice: true, voiceDuration: '0:08', voiceTranscription: '好的，那我们周末见！' },
        { id: 7, type: 'sent', text: '', image: '', imageUrl: '', time: '下午 2:36', reaction: '', ticks: 'read', sender: -1, isVoice: true, voiceDuration: '0:03', voiceTranscription: '' },
        { id: 8, type: 'sent', text: '', image: '', imageUrl: '', time: '下午 2:37', reaction: '', ticks: '', sender: -1, isVoice: false, voiceDuration: '0:01', voiceTranscription: '', isCall: true, callType: 'voice', callDuration: '5:23', callStatus: 'answered' }
    ]
};

const WhatsAppEditor = {
    name: 'whatsapp-editor',
    props: ['data'],
    emits: ['update'],
    template: `
    <div class="whatsapp-editor">
        <!-- 对话信息 -->
        <div class="sub-title">👤 对话信息</div>
        <div class="form-group">
            <div class="toggle-group">
                <label class="toggle">
                    <input type="checkbox" :checked="data.isGroup" @change="updateField('isGroup', $event.target.checked)">
                    <span class="toggle-slider"></span>
                </label>
                <span style="font-size:13px;">群聊模式</span>
            </div>
        </div>

        <!-- 群聊设置 -->
        <template v-if="data.isGroup">
            <div class="form-group">
                <label>群名称</label>
                <input class="form-input" :value="data.groupName" @input="updateField('groupName', $event.target.value)" placeholder="群名称">
            </div>
            <div class="sub-title" style="margin-top:12px;">👥 群成员 <span class="hint">({{ (data.groupMembers || []).length }}人)</span></div>
            <div class="comment-list">
                <div class="comment-item" v-for="(m, idx) in (data.groupMembers || [])" :key="idx"
                    :style="{ borderLeft: '3px solid ' + (m.color || '#25d366') }">
                    <div class="comment-header">
                        <span><strong>{{ m.name }}</strong></span>
                        <button class="remove-comment" @click="removeMember(idx)">✕</button>
                    </div>
                    <div class="form-row" style="margin-bottom:0;">
                        <div class="form-group" style="margin-bottom:0;">
                            <input class="form-input" :value="m.name" @input="updateMember(idx, 'name', $event.target.value)" placeholder="名称" style="font-size:12px;">
                        </div>
                        <div class="form-group" style="margin-bottom:0;">
                            <label style="font-size:11px;">头像色</label>
                            <input type="color" :value="m.color || '#25d366'" @input="updateMember(idx, 'color', $event.target.value)" style="width:30px;height:24px;padding:0;border:none;">
                        </div>
                        <div class="form-group" style="margin-bottom:0;">
                            <label style="font-size:11px;">头像</label>
                            <label class="btn btn-small btn-outline" style="cursor:pointer;font-size:10px;padding:1px 6px;">
                                📷
                                <input type="file" accept="image/*" @change="handleMemberAvatar(idx, $event)" hidden>
                            </label>
                        </div>
                    </div>
                    <div class="ext-url-row" style="margin-top:4px;">
                        <span class="ext-url-label">🔗</span>
                        <input class="form-input ext-url-input" :value="m.avatarUrl" @input="updateMember(idx, 'avatarUrl', $event.target.value)" placeholder="外部头像链接（AO3用）" style="font-size:11px;">
                    </div>
                </div>
                <button class="add-comment-btn" @click="addMember">➕ 添加成员</button>
            </div>
        </template>

        <!-- 单聊设置 -->
        <template v-else>
            <div class="form-group">
                <label>联系人头像</label>
                <div class="image-upload" :class="{ 'has-image': data.contactAvatar }" @click="$refs.avatarInput.click()" style="width:80px;height:80px;border-radius:50%;">
                    <template v-if="data.contactAvatar">
                        <img :src="data.contactAvatar" alt="avatar" style="border-radius:50%;">
                        <button class="remove-image" @click.stop="updateField('contactAvatar', '')">✕</button>
                    </template>
                    <div v-else class="upload-placeholder">
                        <span>📷</span><small>头像</small>
                    </div>
                </div>
                <input type="file" ref="avatarInput" accept="image/*" @change="handleUpload($event, 'contactAvatar')" hidden>
                <div class="ext-url-row">
                    <span class="ext-url-label">🔗</span>
                    <input class="form-input ext-url-input" :value="data.contactAvatarUrl" @input="updateField('contactAvatarUrl', $event.target.value)" placeholder="外部图片链接（AO3导出用）">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>联系人名称</label>
                    <input class="form-input" :value="data.contactName" @input="updateField('contactName', $event.target.value)" placeholder="联系人名称">
                </div>
                <div class="form-group">
                    <label>在线状态</label>
                    <input class="form-input" :value="data.contactStatus" @input="updateField('contactStatus', $event.target.value)" placeholder="如: 在线">
                </div>
            </div>
        </template>

        <div class="section-divider"></div>

        <!-- 皮肤选择 -->
        <div class="sub-title">🎨 聊天皮肤</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
            <div v-for="t in themes" :key="t.id"
                @click="selectTheme(t.id)"
                :style="{ background: t.bg, border: data.theme === t.id ? '3px solid #007aff' : '3px solid #e0e0e0', borderRadius: '8px', padding: '8px 12px', width: '70px', textAlign: 'center', fontSize: '11px', lineHeight: 1.3 }">
                <div :style="{ width: '100%', height: '6px', borderRadius: '3px', background: t.header, marginBottom: '4px' }"></div>
                {{ t.name }}
            </div>
        </div>
        <div v-if="data.theme === 'custom'" class="form-row">
            <div class="form-group">
                <label>背景色</label>
                <input type="color" :value="data.customBgColor || '#efeae2'" @input="updateField('customBgColor', $event.target.value)" style="width:100%;height:32px;">
            </div>
            <div class="form-group">
                <label>头部色</label>
                <input type="color" :value="data.customHeaderColor || '#075e54'" @input="updateField('customHeaderColor', $event.target.value)" style="width:100%;height:32px;">
            </div>
        </div>

        <div class="section-divider"></div>

        <!-- 其他设置 -->
        <div class="form-row">
            <div class="form-group">
                <label>日期标签</label>
                <input class="form-input" :value="data.dateSeparator" @input="updateField('dateSeparator', $event.target.value)" placeholder="如: 今天">
            </div>
        </div>
        <div class="form-group">
            <div class="toggle-group">
                <label class="toggle">
                    <input type="checkbox" :checked="data.showReadReceipt" @change="updateField('showReadReceipt', $event.target.checked)">
                    <span class="toggle-slider"></span>
                </label>
                <span style="font-size:13px;">显示已读回执</span>
            </div>
        </div>
        <div class="form-group" v-if="data.showReadReceipt">
            <label>回执文字</label>
            <input class="form-input" :value="data.readReceiptText" @input="updateField('readReceiptText', $event.target.value)" placeholder="如: 已读">
        </div>
        <div class="form-group">
            <div class="toggle-group">
                <label class="toggle">
                    <input type="checkbox" :checked="data.showTyping" @change="updateField('showTyping', $event.target.checked)">
                    <span class="toggle-slider"></span>
                </label>
                <span style="font-size:13px;">显示正在输入...</span>
            </div>
        </div>

        <div class="section-divider"></div>

        <!-- 消息列表 -->
        <div class="sub-title">💬 消息 <span class="hint">({{ data.messages.length }}条)</span></div>
        <div class="comment-list">
            <div class="comment-item" v-for="(msg, idx) in data.messages" :key="idx"
                draggable="true"
                @dragstart="onDragStart(msg, idx, $event)"
                @dragover.prevent="onDragOver(msg, idx, $event)"
                @dragleave="onDragLeave(msg, idx, $event)"
                @drop="onDrop(msg, idx, $event)"
                :style="{ borderLeft: msg.type === 'sent' ? '3px solid #25d366' : msg.type === 'system' ? '3px solid #ff9500' : msg.type === 'timeSeparator' ? '3px solid #007aff' : '3px solid #fff' }">
                <div class="drag-handle">⋮⋮</div>
                <div class="comment-header">
                    <span>
                        <strong :style="{ color: msg.type === 'sent' ? '#075e54' : msg.type === 'system' ? '#ff9500' : msg.type === 'timeSeparator' ? '#007aff' : '#333' }">
                            {{ msg.type === 'sent' ? '→ 发送' : msg.type === 'received' ? '← 收到' : msg.type === 'system' ? '🔔 系统' : '🕐 时间' }}
                        </strong>
                    </span>
                    <div style="display:flex;gap:4px;align-items:center;">
                        <button class="remove-comment" style="width:20px;height:20px;font-size:11px;" title="在下方插入消息"
                            @click="insertMessage(idx)">⬇</button>
                        <button class="remove-comment" style="width:20px;height:20px;font-size:11px;"
                            @click="toggleType(idx)">⇄</button>
                        <button class="remove-comment" @click="removeMessage(idx)">✕</button>
                    </div>
                </div>

                <!-- System Message Editor -->
                <template v-if="msg.type === 'system'">
                    <div class="form-group" style="margin-bottom:8px;">
                        <label style="font-size:12px;">模板类型</label>
                        <select class="form-input" :value="msg.systemType || 'custom'" @change="updateMessage(idx, 'systemType', $event.target.value)" style="font-size:12px;">
                            <option value="addMember">➕ 添加成员</option>
                            <option value="join">🔗 通过链接加入</option>
                            <option value="leave">🚪 退出群聊</option>
                            <option value="remove">❌ 移出群聊</option>
                            <option value="changeName">✏️ 修改群名</option>
                            <option value="changeDesc">📝 修改群描述</option>
                            <option value="setAdmin">👑 设为管理员</option>
                            <option value="revokeAdmin">👤 撤销管理员</option>
                            <option value="custom">💬 自定义</option>
                        </select>
                    </div>
                    <template v-if="msg.systemType === 'custom'">
                        <div class="form-group" style="margin-bottom:8px;">
                            <label style="font-size:12px;">自定义内容</label>
                            <textarea class="form-input" :value="msg.systemText || ''"
                                @input="updateMessage(idx, 'systemText', $event.target.value)"
                                placeholder="输入自定义系统消息" rows="2"
                                style="font-size:13px;min-height:36px;"></textarea>
                        </div>
                    </template>
                    <template v-else>
                        <div v-if="needsActor(msg.systemType)" class="form-group" style="margin-bottom:8px;">
                            <label style="font-size:12px;">操作者</label>
                            <select class="form-input" :value="msg.systemActor !== undefined ? msg.systemActor : -1" @change="updateMessage(idx, 'systemActor', parseInt($event.target.value))" style="font-size:12px;">
                                <option value="-1">我</option>
                                <option v-for="(m, mi) in (data.groupMembers || [])" :key="mi" :value="mi">{{ m.name }}</option>
                            </select>
                        </div>
                        <div v-if="needsTarget(msg.systemType)" class="form-group" style="margin-bottom:8px;">
                            <label style="font-size:12px;">目标成员</label>
                            <select class="form-input" :value="msg.systemTarget || 0" @change="updateMessage(idx, 'systemTarget', parseInt($event.target.value))" style="font-size:12px;">
                                <option v-for="(m, mi) in (data.groupMembers || [])" :key="mi" :value="mi">{{ m.name }}</option>
                            </select>
                        </div>
                        <div v-if="needsText(msg.systemType)" class="form-group" style="margin-bottom:8px;">
                            <label style="font-size:12px;">{{ msg.systemType === 'changeName' ? '新群名' : '内容' }}</label>
                            <input class="form-input" :value="msg.systemText || ''" @input="updateMessage(idx, 'systemText', $event.target.value)" :placeholder="msg.systemType === 'changeName' ? '输入新群名' : '输入内容'" style="font-size:12px;">
                        </div>
                    </template>
                    <div style="font-size:11px;color:#888;margin-top:4px;padding:4px 8px;background:#f5f5f5;border-radius:4px;">
                        预览：{{ getSystemPreview(msg) }}
                    </div>
                </template>

                <!-- Time Separator Editor -->
                <template v-else-if="msg.type === 'timeSeparator'">
                    <div class="form-group" style="margin-bottom:8px;">
                        <label style="font-size:12px;">时间文字</label>
                        <input class="form-input" :value="msg.text || ''"
                            @input="updateMessage(idx, 'text', $event.target.value)"
                            placeholder="如：上午 11:00" style="font-size:13px;">
                    </div>
                </template>

                <!-- Normal Message Editor (sent/received) -->
                <template v-else>
                    <div v-if="data.isGroup && msg.type === 'received'" class="form-group" style="margin-bottom:8px;">
                        <label style="font-size:12px;">发送者</label>
                        <select class="form-input" :value="msg.sender || 0" @change="updateMessage(idx, 'sender', parseInt($event.target.value))" style="font-size:12px;">
                            <option v-for="(m, mi) in (data.groupMembers || [])" :key="mi" :value="mi">{{ m.name }}</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom:8px;">
                        <textarea class="form-input" :value="msg.text"
                            @input="updateMessage(idx, 'text', $event.target.value)"
                            placeholder="消息内容" rows="2"
                            style="font-size:13px;min-height:36px;"></textarea>
                    </div>
                    <div class="form-group" style="margin-bottom:8px;">
                        <label style="font-size:12px;">图片</label>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <div v-if="msg.image" style="position:relative;">
                                <img :src="msg.image" style="width:60px;height:40px;border-radius:4px;object-fit:cover;">
                                <button style="position:absolute;top:-4px;right:-4px;width:14px;height:14px;border-radius:50%;background:#ff3b30;color:#fff;border:none;font-size:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;" @click.stop="updateMessage(idx, 'image', '')">✕</button>
                            </div>
                            <label v-else class="btn btn-small btn-outline" style="cursor:pointer;">
                                📷
                                <input type="file" accept="image/*" @change="handleMsgImage(idx, $event)" hidden>
                            </label>
                        </div>
                        <div class="ext-url-row" style="margin-top:4px;">
                            <span class="ext-url-label">🔗</span>
                            <input class="form-input ext-url-input" :value="msg.imageUrl" @input="updateMessage(idx, 'imageUrl', $event.target.value)" placeholder="外部图片链接（AO3导出用）" style="font-size:11px;">
                        </div>
                    </div>
                            <div class="form-group" style="margin-bottom:8px;">
                                <div class="toggle-group" style="margin-bottom:0;">
                                    <label class="toggle">
                                        <input type="checkbox" :checked="msg.isVoice" @change="updateMessage(idx, 'isVoice', $event.target.checked)">
                                        <span class="toggle-slider"></span>
                                    </label>
                                    <span style="font-size:12px;">语音消息</span>
                                </div>
                            </div>
                            <template v-if="msg.isVoice">
                                <div class="form-group" style="margin-bottom:8px;">
                                    <label style="font-size:12px;">⏱ 时长</label>
                                    <input class="form-input" :value="msg.voiceDuration" @input="updateMessage(idx, 'voiceDuration', $event.target.value)" placeholder="0:05" style="font-size:12px;">
                                </div>
                                <div class="form-group" style="margin-bottom:8px;">
                                    <label style="font-size:12px;">📝 转文字内容</label>
                                    <input class="form-input" :value="msg.voiceTranscription" @input="updateMessage(idx, 'voiceTranscription', $event.target.value)" placeholder="语音转文字内容（可选）" style="font-size:12px;">
                                </div>
                            </template>
                    <div class="form-group" style="margin-bottom:8px;">
                        <div class="toggle-group" style="margin-bottom:0;">
                            <label class="toggle">
                                <input type="checkbox" :checked="msg.isCall" @change="updateMessage(idx, 'isCall', $event.target.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                            <span style="font-size:12px;">通话记录</span>
                        </div>
                    </div>
                    <template v-if="msg.isCall">
                        <div class="form-group" style="margin-bottom:8px;">
                            <label style="font-size:12px;">通话类型</label>
                            <select class="form-input" :value="msg.callType || 'voice'" @change="updateMessage(idx, 'callType', $event.target.value)" style="font-size:12px;">
                                <option value="voice">📞 语音通话</option>
                                <option value="video">📹 视频通话</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom:8px;">
                            <label style="font-size:12px;">通话状态</label>
                            <select class="form-input" :value="msg.callStatus || 'answered'" @change="updateMessage(idx, 'callStatus', $event.target.value)" style="font-size:12px;">
                                <option value="answered">✅ 已接听</option>
                                <option value="missed">❌ 未接听</option>
                                <option value="declined">🚫 已拒绝</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom:8px;">
                            <label style="font-size:12px;">⏱ 通话时长</label>
                            <input class="form-input" :value="msg.callDuration" @input="updateMessage(idx, 'callDuration', $event.target.value)" placeholder="5:23" style="font-size:12px;">
                        </div>
                    </template>
                    <div class="form-row" style="margin-bottom:0;">
                        <div class="form-group" style="margin-bottom:0;">
                            <label style="font-size:12px;">时间</label>
                            <input class="form-input" :value="msg.time" @input="updateMessage(idx, 'time', $event.target.value)" placeholder="时间" style="font-size:12px;">
                        </div>
                        <div class="form-group" style="margin-bottom:0;">
                            <label style="font-size:12px;">表情回应</label>
                            <input class="form-input" :value="msg.reaction" @input="updateMessage(idx, 'reaction', $event.target.value)" placeholder="如: ❤️" style="font-size:12px;">
                        </div>
                        <div v-if="msg.type === 'sent'" class="form-group" style="margin-bottom:0;">
                            <label style="font-size:12px;">已读状态</label>
                            <select class="form-input" :value="msg.ticks || 'sent'" @change="updateMessage(idx, 'ticks', $event.target.value)" style="font-size:12px;">
                                <option value="sent">已发送 ✓</option>
                                <option value="delivered">已送达 ✓✓</option>
                                <option value="read">已读 ✓✓</option>
                            </select>
                        </div>
                    </div>
                </template>
            </div>
            <button class="add-comment-btn" @click="addMessage">➕ 添加消息</button>
            <div style="display:flex;gap:6px;margin-top:4px;">
                <button class="add-comment-btn" style="background:#ff9500;" @click="addSystemMessage">🔔 系统消息</button>
                <button class="add-comment-btn" style="background:#007aff;" @click="addTimeSeparator">🕐 时间标签</button>
            </div>
        </div>
    </div>
    `,
    data() {
        return { themes: WhatsAppThemes };
    },
    methods: {
        updateField(field, value) {
            this.$emit('update', { ...this.data, [field]: value });
        },
        selectTheme(id) {
            this.updateField('theme', id);
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
        async handleMsgImage(idx, event) {
            const file = event.target.files[0];
            if (!file) return;
            try {
                const base64 = await ImageUtil.fileToBase64(file);
                const compressed = await ImageUtil.compressImage(base64);
                this.updateMessage(idx, 'image', compressed);
            } catch (e) { console.error('图片上传失败:', e.message); }
            event.target.value = '';
        },
        async handleMemberAvatar(idx, event) {
            const file = event.target.files[0];
            if (!file) return;
            try {
                const base64 = await ImageUtil.fileToBase64(file);
                const compressed = await ImageUtil.compressImage(base64);
                this.updateMember(idx, 'avatar', compressed);
            } catch (e) { console.error('头像上传失败:', e.message); }
            event.target.value = '';
        },
        addMember() {
            const members = [...(this.data.groupMembers || []), { name: '新成员', avatar: '', avatarUrl: '', color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0') }];
            this.updateField('groupMembers', members);
        },
        removeMember(idx) {
            const members = [...(this.data.groupMembers || [])];
            members.splice(idx, 1);
            this.updateField('groupMembers', members);
        },
        updateMember(idx, field, value) {
            const members = [...(this.data.groupMembers || [])];
            members[idx] = { ...members[idx], [field]: value };
            this.updateField('groupMembers', members);
        },
        addMessage() {
            const messages = [...this.data.messages, { id: Date.now(), type: 'sent', text: '', image: '', imageUrl: '', time: '', reaction: '', ticks: 'sent', sender: -1, isVoice: false, voiceDuration: '0:01', voiceTranscription: '', isCall: false, callType: 'voice', callDuration: '', callStatus: 'answered' }];
            this.updateField('messages', messages);
        },
        addSystemMessage() {
            const messages = [...this.data.messages, { id: Date.now(), type: 'system', systemType: 'addMember', systemActor: -1, systemTarget: 0, systemText: '' }];
            this.updateField('messages', messages);
        },
        addTimeSeparator() {
            const messages = [...this.data.messages, { id: Date.now(), type: 'timeSeparator', text: '' }];
            this.updateField('messages', messages);
        },
        insertMessage(idx) {
            const newMsg = { id: Date.now(), type: 'sent', text: '', image: '', imageUrl: '', time: '', reaction: '', ticks: 'sent', sender: -1, isVoice: false, voiceDuration: '0:01', voiceTranscription: '', isCall: false, callType: 'voice', callDuration: '', callStatus: 'answered' };
            const messages = [...this.data.messages];
            messages.splice(idx + 1, 0, newMsg);
            this.updateField('messages', messages);
        },
        removeMessage(idx) {
            const messages = [...this.data.messages];
            messages.splice(idx, 1);
            this.updateField('messages', messages);
        },
        toggleType(idx) {
            const messages = [...this.data.messages];
            const msg = messages[idx];
            const typeOrder = ['sent', 'received', 'system', 'timeSeparator'];
            const currentIdx = typeOrder.indexOf(msg.type);
            const newType = typeOrder[(currentIdx + 1) % typeOrder.length];
            if (newType === 'system') {
                messages[idx] = { ...msg, type: 'system', systemType: msg.systemType || 'addMember', systemActor: msg.systemActor !== undefined ? msg.systemActor : -1, systemTarget: msg.systemTarget || 0, systemText: msg.systemText || '' };
            } else if (newType === 'timeSeparator') {
                messages[idx] = { ...msg, type: 'timeSeparator', text: msg.text || '' };
            } else {
                messages[idx] = { ...msg, type: newType, sender: newType === 'sent' ? -1 : (this.data.isGroup ? 0 : 0) };
            }
            this.updateField('messages', messages);
        },
        needsActor(systemType) {
            return ['addMember', 'leave', 'remove', 'changeName', 'changeDesc', 'setAdmin', 'revokeAdmin'].includes(systemType);
        },
        needsTarget(systemType) {
            return ['addMember', 'remove', 'setAdmin', 'revokeAdmin'].includes(systemType);
        },
        needsText(systemType) {
            return ['changeName', 'custom'].includes(systemType);
        },
        getMemberName(index) {
            if (index === -1) return '我';
            const members = this.data.groupMembers || [];
            return members[index] ? members[index].name : '未知';
        },
        getSystemPreview(msg) {
            if (msg.systemType === 'custom') return msg.systemText || '（自定义内容）';
            return this.generateSystemText(msg);
        },
        generateSystemText(msg) {
            const actor = this.getMemberName(msg.systemActor !== undefined ? msg.systemActor : -1);
            const target = this.getMemberName(msg.systemTarget || 0);
            const text = msg.systemText || '';
            switch (msg.systemType) {
                case 'addMember': return actor + ' 将 ' + target + ' 添加到群聊';
                case 'join': return target + ' 通过邀请链接加入群聊';
                case 'leave': return actor + ' 退出群聊';
                case 'remove': return actor + ' 将 ' + target + ' 移出群聊';
                case 'changeName': return actor + ' 将群名称更改为「' + text + '」';
                case 'changeDesc': return actor + ' 更改了群描述';
                case 'setAdmin': return actor + ' 将 ' + target + ' 设为管理员';
                case 'revokeAdmin': return actor + ' 撤销了 ' + target + ' 的管理员身份';
                default: return text || '（系统消息）';
            }
        },
        updateMessage(idx, field, value) {
            const messages = [...this.data.messages];
            messages[idx] = { ...messages[idx], [field]: value };
            this.updateField('messages', messages);
        },
        onDragStart(msg, idx, event) {
            event.dataTransfer.setData('text/plain', String(idx));
            const el = event.target.closest('.comment-item');
            if (el) el.classList.add('dragging');
        },
        onDragOver(msg, idx, event) {
            event.preventDefault();
            const el = event.target.closest('.comment-item');
            if (!el) return;
            el.classList.remove('drag-over', 'drag-over-bottom');
            el.classList.add(event.clientY < el.getBoundingClientRect().top + el.getBoundingClientRect().height / 2 ? 'drag-over' : 'drag-over-bottom');
        },
        onDragLeave(msg, idx, event) {
            const el = event.target.closest('.comment-item');
            if (el) el.classList.remove('drag-over', 'drag-over-bottom');
        },
        onDrop(msg, idx, event) {
            event.preventDefault();
            const data = [...this.data.messages];
            const dragIdx = data.findIndex(m => m.id === msg.id);
            if (dragIdx === -1) return;
            const [removed] = data.splice(dragIdx, 1);
            const targetIdx = dragIdx < idx ? idx : idx;
            data.splice(targetIdx, 0, removed);
            this.updateField('messages', data);
            document.querySelectorAll('.comment-item').forEach(el => el.classList.remove('dragging', 'drag-over', 'drag-over-bottom'));
        }
    }
};

const WhatsAppPreview = {
    name: 'whatsapp-preview',
    props: ['data'],
    template: `
    <div :class="['wa-chat', 'wa-theme-' + (data.theme || 'whatsapp')]" :style="data.theme === 'custom' ? { background: data.customBgColor } : {}">
        <!-- Header -->
        <div class="wa-header" :style="data.theme === 'custom' ? { background: data.customHeaderColor } : {}">
            <span class="wa-header-back">←</span>
            <template v-if="data.isGroup">
                <div class="wa-header-avatars">
                    <div v-for="(m, mi) in (data.groupMembers || []).slice(0, 3)" :key="mi"
                        :class="['wa-header-avatar-item']"
                        :style="{ background: (m.avatar || m.avatarUrl) ? 'transparent' : (m.color || '#ccc'), borderColor: data.theme === 'custom' ? data.customHeaderColor : '#075e54' }">
                        <img v-if="m.avatar || m.avatarUrl" :src="m.avatar || m.avatarUrl" style="width:28px;height:28px;border-radius:50%;">
                        <span v-else>{{ (m.name || 'U')[0].toUpperCase() }}</span>
                    </div>
                </div>
            </template>
            <template v-else>
                <div v-if="data.contactAvatar || data.contactAvatarUrl" class="wa-header-avatar"><img :src="data.contactAvatar || data.contactAvatarUrl" alt=""></div>
                <div v-else class="wa-header-avatar">{{ (data.contactName || 'U')[0].toUpperCase() }}</div>
            </template>
            <div class="wa-header-info">
                <div class="wa-header-name">{{ data.isGroup ? (data.groupName || '群聊') : (data.contactName || '联系人') }}</div>
                <div class="wa-header-status">{{ data.isGroup ? groupMembersText : (data.contactStatus || '在线') }}</div>
            </div>
            <div class="wa-header-actions">
                <span class="wa-header-action">📹</span>
                <span class="wa-header-action">📞</span>
                <span class="wa-header-action">⋯</span>
            </div>
        </div>

        <!-- Messages -->
        <div class="wa-messages">
            <div class="wa-date-separator" v-if="data.dateSeparator">
                <span class="wa-date-label">{{ data.dateSeparator }}</span>
            </div>

            <div v-if="data.isGroup && (data.groupMembers || []).length > 0" class="wa-group-members">
                <span class="wa-group-members-text">{{ groupMembersText }}</span>
            </div>

            <template v-for="(msg, idx) in data.messages" :key="idx">
                <!-- Time Separator -->
                <div v-if="msg.type === 'timeSeparator'" class="wa-time-separator">
                    <span class="wa-time-separator-label">{{ msg.text || '' }}</span>
                </div>

                <!-- System Message -->
                <div v-else-if="msg.type === 'system'" class="wa-system-message">
                    <span class="wa-system-message-inner" v-html="renderSystemText(msg)"></span>
                </div>

                <!-- Call Record -->
                <div v-else-if="msg.isCall" :class="['wa-call-record', 'wa-call-' + (msg.callStatus || 'answered')]">
                    <span class="wa-call-icon">{{ msg.callType === 'video' ? '📹' : '📞' }}</span>
                    <span class="wa-call-text">
                        <template v-if="msg.callStatus === 'missed'">未接听</template>
                        <template v-else-if="msg.callStatus === 'declined'">已拒绝</template>
                        <template v-else>已接听</template>
                    </span>
                    <span v-if="msg.callDuration && msg.callStatus !== 'missed' && msg.callStatus !== 'declined'" class="wa-call-duration">{{ msg.callDuration }}</span>
                </div>

                <!-- Normal Message Bubble -->
                <div v-else :class="['wa-bubble', msg.type === 'sent' ? 'wa-bubble-sent' : 'wa-bubble-received']">
                    <div v-if="data.isGroup && msg.type === 'received' && getSender(msg)" class="wa-sender-name" :class="'wa-sc-' + (msg.sender || 0)">{{ getSender(msg).name }}</div>
                    <div v-if="msg.isVoice" class="wa-voice-msg">
                        <div class="wa-voice-play">▶</div>
                        <div class="wa-voice-waveform">
                            <div class="wa-voice-bar" v-for="i in 20" :key="i" :style="{ height: (Math.sin(i * 0.8) * 8 + 10) + 'px' }"></div>
                        </div>
                        <div class="wa-voice-duration">{{ msg.voiceDuration || '0:01' }}</div>
                    </div>
                    <div v-if="msg.isVoice && msg.voiceTranscription" class="wa-voice-transcription">
                        {{ msg.voiceTranscription }}
                    </div>
                    <div v-if="!msg.isVoice && (msg.image || msg.imageUrl)" class="wa-bubble-image">
                        <img :src="msg.image || msg.imageUrl" alt="">
                    </div>
                    <div v-if="!msg.isVoice && msg.text" class="wa-bubble-text">{{ msg.text }}</div>
                    <div v-if="!msg.isVoice && !msg.text && !msg.image && !msg.imageUrl" class="wa-bubble-empty">（空消息）</div>
                    <div class="wa-bubble-meta">
                        <span class="wa-bubble-time">{{ msg.time }}</span>
                        <span v-if="msg.type === 'sent' && msg.ticks" :class="['wa-bubble-ticks', msg.ticks === 'read' ? 'wa-ticks-read' : 'wa-ticks-sent']">
                            {{ msg.ticks === 'sent' ? '✓' : '✓✓' }}
                        </span>
                    </div>
                </div>
                <div v-if="msg.reaction && !msg.isCall && msg.type !== 'system' && msg.type !== 'timeSeparator'" class="wa-reaction">
                    {{ msg.reaction }}
                </div>
            </template>

            <!-- Typing -->
            <div v-if="data.showTyping" class="wa-typing">
                <div class="wa-typing-dot"></div>
                <div class="wa-typing-dot"></div>
                <div class="wa-typing-dot"></div>
            </div>
        </div>

        <!-- Read Receipt -->
        <div v-if="data.showReadReceipt" class="wa-read-receipt">{{ data.readReceiptText || '已读' }}</div>

        <!-- Input Bar -->
        <div class="wa-input-bar">
            <span class="wa-input-emoji">😀</span>
            <div class="wa-input-field">
                <span class="wa-input-placeholder">输入消息</span>
            </div>
            <span class="wa-input-attach">📎</span>
            <span class="wa-send-btn">➤</span>
        </div>
    </div>
    `,
    computed: {
        groupMembersText() {
            const members = this.data.groupMembers || [];
            return members.map(m => m.name).join('、');
        },
        memberColorCSS() {
            const members = this.data.groupMembers || [];
            if (!this.data.isGroup || members.length === 0) return '';
            let css = '';
            for (let i = 0; i < members.length; i++) {
                css += '.wa-sc-' + i + ' { color: ' + (members[i].color || '#075e54') + ' !important; }\n';
            }
            return css;
        }
    },
    mounted() {
        this._injectMemberColors();
    },
    updated() {
        this._injectMemberColors();
    },
    methods: {
        getSender(msg) {
            if (!this.data.isGroup || msg.type === 'sent') return null;
            const members = this.data.groupMembers || [];
            return members[msg.sender] || null;
        },
        getMemberName(index) {
            if (index === -1) return '我';
            const members = this.data.groupMembers || [];
            return members[index] ? members[index].name : '未知';
        },
        renderSystemText(msg) {
            if (msg.systemType === 'custom') {
                return this.escapeHtml(msg.systemText || '');
            }
            const actor = this.escapeHtml(this.getMemberName(msg.systemActor !== undefined ? msg.systemActor : -1));
            const target = this.escapeHtml(this.getMemberName(msg.systemTarget || 0));
            const text = this.escapeHtml(msg.systemText || '');
            switch (msg.systemType) {
                case 'addMember': return '<span class="wa-system-highlight">' + actor + '</span> 将 <span class="wa-system-highlight">' + target + '</span> 添加到群聊';
                case 'join': return '<span class="wa-system-highlight">' + target + '</span> 通过邀请链接加入群聊';
                case 'leave': return '<span class="wa-system-highlight">' + actor + '</span> 退出群聊';
                case 'remove': return '<span class="wa-system-highlight">' + actor + '</span> 将 <span class="wa-system-highlight">' + target + '</span> 移出群聊';
                case 'changeName': return '<span class="wa-system-highlight">' + actor + '</span> 将群名称更改为「' + text + '」';
                case 'changeDesc': return '<span class="wa-system-highlight">' + actor + '</span> 更改了群描述';
                case 'setAdmin': return '<span class="wa-system-highlight">' + actor + '</span> 将 <span class="wa-system-highlight">' + target + '</span> 设为管理员';
                case 'revokeAdmin': return '<span class="wa-system-highlight">' + actor + '</span> 撤销了 <span class="wa-system-highlight">' + target + '</span> 的管理员身份';
                default: return text || '（系统消息）';
            }
        },
        escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },
        _injectMemberColors() {
            if (!this.data.isGroup) return;
            const el = this.$el;
            if (!el) return;
            let styleEl = el.querySelector(':scope > style.wa-member-colors');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.className = 'wa-member-colors';
                el.insertBefore(styleEl, el.firstChild);
            }
            styleEl.textContent = this.memberColorCSS;
        }
    }
};
