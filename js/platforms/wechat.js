/**
 * 微信 平台模块
 */

const WeChatDefaults = {
    contactName: '张三',
    contactAvatar: '',
    contactAvatarUrl: '',
    isGroup: false,
    groupName: '好友群',
    groupMembers: [
        { name: '张三', avatar: '', avatarUrl: '', color: '#576b95' },
        { name: '李四', avatar: '', avatarUrl: '', color: '#fa5151' },
        { name: '王五', avatar: '', avatarUrl: '', color: '#07c160' }
    ],
    dateSeparator: '昨天',
    showTyping: false,
    messages: [
        { id: 1, type: 'received', text: '在吗？', image: '', imageUrl: '', time: '14:30', sender: 0, isVoice: false, voiceDuration: '', isCall: false, callType: '', callDuration: '', callStatus: '' },
        { id: 2, type: 'sent', text: '在的，怎么了？', image: '', imageUrl: '', time: '14:31', sender: -1, isVoice: false, voiceDuration: '', isCall: false, callType: '', callDuration: '', callStatus: '' },
        { id: 3, type: 'received', text: '周末有空一起吃饭吗 🍜', image: '', imageUrl: '', time: '14:32', sender: 1, isVoice: false, voiceDuration: '', isCall: false, callType: '', callDuration: '', callStatus: '' },
        { id: 4, type: 'sent', text: '好啊！去哪里吃？', image: '', imageUrl: '', time: '14:33', sender: -1, isVoice: false, voiceDuration: '', isCall: false, callType: '', callDuration: '', callStatus: '' },
        { id: 5, type: 'system', systemType: 'custom', systemActor: -1, systemTarget: 0, systemText: '你 邀请 赵六 加入群聊' },
        { id: 6, type: 'timeSeparator', text: '下午 5:20' },
        { id: 7, type: 'received', text: '', image: '', imageUrl: '', time: '17:20', sender: 0, isVoice: true, voiceDuration: '0:05', isCall: false, callType: '', callDuration: '', callStatus: '' }
    ]
};

const WeChatEditor = {
    name: 'wechat-editor',
    props: ['data'],
    emits: ['update'],
    template: `
    <div class="wechat-editor">
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
                    :style="{ borderLeft: '3px solid ' + (m.color || '#07c160') }">
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
                            <input type="color" :value="m.color || '#07c160'" @input="updateMember(idx, 'color', $event.target.value)" style="width:30px;height:24px;padding:0;border:none;">
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
                        <input class="form-input ext-url-input" :value="m.avatarUrl" @input="updateMember(idx, 'avatarUrl', $event.target.value)" placeholder="外部头像链接" style="font-size:11px;">
                    </div>
                </div>
                <button class="add-comment-btn" @click="addMember">➕ 添加成员</button>
            </div>
        </template>

        <!-- 单聊设置 -->
        <template v-else>
            <div class="form-group">
                <label>联系人头像</label>
                <div class="image-upload" :class="{ 'has-image': data.contactAvatar }" @click="$refs.avatarInput.click()" style="width:80px;height:80px;border-radius:6px;">
                    <template v-if="data.contactAvatar">
                        <img :src="data.contactAvatar" alt="avatar" style="border-radius:6px;">
                        <button class="remove-image" @click.stop="updateField('contactAvatar', '')">✕</button>
                    </template>
                    <div v-else class="upload-placeholder">
                        <span>📷</span><small>头像</small>
                    </div>
                </div>
                <input type="file" ref="avatarInput" accept="image/*" @change="handleUpload($event, 'contactAvatar')" hidden>
                <div class="ext-url-row">
                    <span class="ext-url-label">🔗</span>
                    <input class="form-input ext-url-input" :value="data.contactAvatarUrl" @input="updateField('contactAvatarUrl', $event.target.value)" placeholder="外部图片链接">
                </div>
            </div>
            <div class="form-group">
                <label>联系人名称</label>
                <input class="form-input" :value="data.contactName" @input="updateField('contactName', $event.target.value)" placeholder="联系人名称">
            </div>
        </template>

        <div class="section-divider"></div>

        <!-- 其他设置 -->
        <div class="form-row">
            <div class="form-group">
                <label>日期标签</label>
                <input class="form-input" :value="data.dateSeparator" @input="updateField('dateSeparator', $event.target.value)" placeholder="如: 昨天">
            </div>
        </div>
        <div class="form-group">
            <div class="toggle-group">
                <label class="toggle">
                    <input type="checkbox" :checked="data.showTyping" @change="updateField('showTyping', $event.target.checked)">
                    <span class="toggle-slider"></span>
                </label>
                <span style="font-size:13px;">显示对方正在输入...</span>
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
                :style="{ borderLeft: msg.type === 'sent' ? '3px solid #07c160' : msg.type === 'system' ? '3px solid #fa9d3b' : msg.type === 'timeSeparator' ? '3px solid #576b95' : '3px solid #fff' }">
                <div class="drag-handle">⋮⋮</div>
                <div class="comment-header">
                    <span>
                        <strong :style="{ color: msg.type === 'sent' ? '#07c160' : msg.type === 'system' ? '#fa9d3b' : msg.type === 'timeSeparator' ? '#576b95' : '#333' }">
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
                        <label style="font-size:12px;">内容</label>
                        <textarea class="form-input" :value="msg.systemText || ''"
                            @input="updateMessage(idx, 'systemText', $event.target.value)"
                            placeholder="如: 你 邀请 赵六 加入群聊" rows="2"
                            style="font-size:13px;min-height:36px;"></textarea>
                    </div>
                </template>

                <!-- Time Separator Editor -->
                <template v-else-if="msg.type === 'timeSeparator'">
                    <div class="form-group" style="margin-bottom:8px;">
                        <label style="font-size:12px;">时间文字</label>
                        <input class="form-input" :value="msg.text || ''"
                            @input="updateMessage(idx, 'text', $event.target.value)"
                            placeholder="如：下午 5:20" style="font-size:13px;">
                    </div>
                </template>

                <!-- Normal Message Editor -->
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
                            <input class="form-input ext-url-input" :value="msg.imageUrl" @input="updateMessage(idx, 'imageUrl', $event.target.value)" placeholder="外部图片链接" style="font-size:11px;">
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
                    </div>
                </template>
            </div>
            <button class="add-comment-btn" @click="addMessage">➕ 添加消息</button>
            <div style="display:flex;gap:6px;margin-top:4px;">
                <button class="add-comment-btn" style="background:#fa9d3b;" @click="addSystemMessage">🔔 系统消息</button>
                <button class="add-comment-btn" style="background:#576b95;" @click="addTimeSeparator">🕐 时间标签</button>
            </div>
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
            const messages = [...this.data.messages, { id: Date.now(), type: 'sent', text: '', image: '', imageUrl: '', time: '', sender: -1, isVoice: false, voiceDuration: '', isCall: false, callType: '', callDuration: '', callStatus: '' }];
            this.updateField('messages', messages);
        },
        addSystemMessage() {
            const messages = [...this.data.messages, { id: Date.now(), type: 'system', systemType: 'custom', systemActor: -1, systemTarget: 0, systemText: '' }];
            this.updateField('messages', messages);
        },
        addTimeSeparator() {
            const messages = [...this.data.messages, { id: Date.now(), type: 'timeSeparator', text: '' }];
            this.updateField('messages', messages);
        },
        insertMessage(idx) {
            const newMsg = { id: Date.now(), type: 'sent', text: '', image: '', imageUrl: '', time: '', sender: -1, isVoice: false, voiceDuration: '', isCall: false, callType: '', callDuration: '', callStatus: '' };
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
                messages[idx] = { ...msg, type: 'system', systemType: 'custom', systemActor: -1, systemTarget: 0, systemText: msg.systemText || '' };
            } else if (newType === 'timeSeparator') {
                messages[idx] = { ...msg, type: 'timeSeparator', text: msg.text || '' };
            } else {
                messages[idx] = { ...msg, type: newType, sender: newType === 'sent' ? -1 : 0 };
            }
            this.updateField('messages', messages);
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
            const dragIdx = parseInt(event.dataTransfer.getData('text/plain'));
            if (isNaN(dragIdx) || dragIdx === idx) return;
            const [removed] = data.splice(dragIdx, 1);
            data.splice(idx, 0, removed);
            this.updateField('messages', data);
            document.querySelectorAll('.comment-item').forEach(el => el.classList.remove('dragging', 'drag-over', 'drag-over-bottom'));
        }
    }
};

const WeChatPreview = {
    name: 'wechat-preview',
    props: ['data'],
    template: `
    <div class="wx-chat">
        <!-- Header -->
        <div class="wx-header">
            <span class="wx-header-back">‹</span>
            <template v-if="data.isGroup">
                <div class="wx-header-avatars">
                    <div v-for="(m, mi) in (data.groupMembers || []).slice(0, 3)" :key="mi"
                        class="wx-header-avatar-item"
                        :style="{ background: (m.avatar || m.avatarUrl) ? 'transparent' : (m.color || '#ccc') }">
                        <img v-if="m.avatar || m.avatarUrl" :src="m.avatar || m.avatarUrl" style="width:28px;height:28px;">
                        <span v-else>{{ (m.name || 'U')[0] }}</span>
                    </div>
                </div>
            </template>
            <template v-else>
                <div v-if="data.contactAvatar || data.contactAvatarUrl" class="wx-header-avatar"><img :src="data.contactAvatar || data.contactAvatarUrl" alt=""></div>
                <div v-else class="wx-header-avatar">{{ (data.contactName || 'U')[0] }}</div>
            </template>
            <div class="wx-header-info">
                <div class="wx-header-name">{{ data.isGroup ? (data.groupName || '群聊') : (data.contactName || '联系人') }}</div>
                <div v-if="data.isGroup" class="wx-header-status">{{ (data.groupMembers || []).length }}位联系人</div>
            </div>
            <div class="wx-header-actions">
                <span class="wx-header-action">⋯</span>
            </div>
        </div>

        <!-- Messages -->
        <div class="wx-messages">
            <div class="wx-date-separator" v-if="data.dateSeparator">
                <span class="wx-date-label">{{ data.dateSeparator }}</span>
            </div>

            <div v-if="data.isGroup && (data.groupMembers || []).length > 0" class="wx-group-members">
                <span class="wx-group-members-text">{{ groupMembersText }}</span>
            </div>

            <template v-for="(msg, idx) in data.messages" :key="idx">
                <!-- Time Separator -->
                <div v-if="msg.type === 'timeSeparator'" class="wx-time-separator">
                    <span class="wx-time-separator-label">{{ msg.text || '' }}</span>
                </div>

                <!-- System Message -->
                <div v-else-if="msg.type === 'system'" class="wx-system-message">
                    <span class="wx-system-message-inner">{{ msg.systemText || '' }}</span>
                </div>

                <!-- Call Record -->
                <div v-else-if="msg.isCall" :class="['wx-call-record', 'wx-call-' + (msg.callStatus || 'answered')]">
                    <span class="wx-call-icon">{{ msg.callType === 'video' ? '📹' : '📞' }}</span>
                    <span class="wx-call-text">
                        <template v-if="msg.callStatus === 'missed'">未接听</template>
                        <template v-else>已接听</template>
                    </span>
                    <span v-if="msg.callDuration && msg.callStatus !== 'missed'" class="wx-call-duration">{{ msg.callDuration }}</span>
                </div>

                <!-- Normal Message -->
                <div v-else :class="['wx-msg-row', msg.type === 'sent' ? 'wx-msg-row-sent' : '']">
                    <!-- Avatar -->
                    <div v-if="msg.type === 'sent'" class="wx-msg-avatar" :style="{ background: '#07c160' }">我</div>
                    <div v-else class="wx-msg-avatar" :style="getAvatarStyle(msg)">
                        <img v-if="getAvatarSrc(msg)" :src="getAvatarSrc(msg)">
                        <span v-else>{{ getAvatarLetter(msg) }}</span>
                    </div>
                    <div style="display:flex;flex-direction:column;">
                        <div v-if="data.isGroup && msg.type === 'received' && getSender(msg)" class="wx-sender-name" :style="{ color: getSender(msg).color || '#888' }">{{ getSender(msg).name }}</div>
                        <div :class="['wx-bubble', msg.type === 'sent' ? 'wx-bubble-sent' : 'wx-bubble-received']">
                            <div v-if="msg.isVoice" :class="['wx-voice-msg', msg.type === 'sent' ? 'wx-voice-sent' : '']">
                                <span class="wx-voice-icon">{{ msg.type === 'sent' ? '🎤' : '🎙️' }}</span>
                                <div class="wx-voice-bars">
                                    <div class="wx-voice-bar" v-for="i in 12" :key="i" :style="{ height: (Math.sin(i * 0.9) * 5 + 7) + 'px' }"></div>
                                </div>
                                <span class="wx-voice-duration">{{ msg.voiceDuration || '0:01' }}</span>
                            </div>
                            <div v-if="!msg.isVoice && (msg.image || msg.imageUrl)" class="wx-bubble-image">
                                <img :src="msg.image || msg.imageUrl" alt="">
                            </div>
                            <div v-if="!msg.isVoice && msg.text" class="wx-bubble-text">{{ msg.text }}</div>
                            <div v-if="!msg.isVoice && !msg.text && !msg.image && !msg.imageUrl" class="wx-bubble-empty">（空消息）</div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Typing -->
            <div v-if="data.showTyping" class="wx-typing">
                <div class="wx-typing-dot"></div>
                <div class="wx-typing-dot"></div>
                <div class="wx-typing-dot"></div>
            </div>
        </div>

        <!-- Input Bar -->
        <div class="wx-input-bar">
            <span class="wx-input-voice">🎙️</span>
            <div class="wx-input-field">
                <span class="wx-input-placeholder">输入消息...</span>
            </div>
            <div class="wx-input-actions">
                <span class="wx-input-action">😊</span>
                <span class="wx-input-action">➕</span>
            </div>
        </div>
    </div>
    `,
    computed: {
        groupMembersText() {
            const members = this.data.groupMembers || [];
            return members.map(m => m.name).join('、');
        }
    },
    methods: {
        getSender(msg) {
            if (!this.data.isGroup || msg.type === 'sent') return null;
            const members = this.data.groupMembers || [];
            return members[msg.sender] || null;
        },
        getAvatarSrc(msg) {
            if (msg.type === 'sent') return '';
            if (!this.data.isGroup) return this.data.contactAvatar || this.data.contactAvatarUrl || '';
            const members = this.data.groupMembers || [];
            const member = members[msg.sender];
            return member ? (member.avatar || member.avatarUrl || '') : '';
        },
        getAvatarLetter(msg) {
            if (msg.type === 'sent') return '我';
            if (!this.data.isGroup) return (this.data.contactName || 'U')[0];
            const members = this.data.groupMembers || [];
            const member = members[msg.sender];
            return member ? (member.name || 'U')[0] : 'U';
        },
        getAvatarStyle(msg) {
            if (msg.type === 'sent') return {};
            if (!this.data.isGroup) return { background: '#576b95' };
            const members = this.data.groupMembers || [];
            const member = members[msg.sender];
            const hasImg = member && (member.avatar || member.avatarUrl);
            return { background: hasImg ? 'transparent' : (member ? member.color || '#ccc' : '#ccc') };
        }
    }
};
