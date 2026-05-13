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
        <div class="sub-title">👤 {{ $t('common.chatInfo') }}</div>
        <div class="form-group">
            <div class="toggle-group">
                <label class="toggle">
                    <input type="checkbox" :checked="data.isGroup" @change="updateField('isGroup', $event.target.checked)">
                    <span class="toggle-slider"></span>
                </label>
                <span style="font-size:13px;">{{ $t('common.groupMode') }}</span>
            </div>
        </div>

        <!-- 群聊设置 -->
        <template v-if="data.isGroup">
            <div class="form-group">
                <label>{{ $t('common.groupName') }}</label>
                <input class="form-input" :value="data.groupName" @input="updateField('groupName', $event.target.value)" :placeholder="$t('common.groupName')">
            </div>
            <div class="sub-title" style="margin-top:12px;">👥 {{ $t('common.groupMembers') }} <span class="hint">({{ (data.groupMembers || []).length }}{{ $t('common.memberCount') }})</span></div>
            <div class="comment-list">
                <div class="comment-item" v-for="(m, idx) in (data.groupMembers || [])" :key="idx"
                    :style="{ borderLeft: '3px solid ' + (m.color || '#25d366') }">
                    <div class="comment-header">
                        <span><strong>{{ m.name }}</strong></span>
                        <button class="remove-comment" @click="removeMember(idx)">✕</button>
                    </div>
                    <div class="form-row" style="margin-bottom:0;">
                        <div class="form-group" style="margin-bottom:0;">
                            <input class="form-input" :value="m.name" @input="updateMember(idx, 'name', $event.target.value)" :placeholder="$t('common.memberName')" style="font-size:12px;">
                        </div>
                        <div class="form-group" style="margin-bottom:0;">
                            <label style="font-size:11px;">{{ $t('common.memberAvatarColor') }}</label>
                            <input type="color" :value="m.color || '#25d366'" @input="updateMember(idx, 'color', $event.target.value)" style="width:30px;height:24px;padding:0;border:none;">
                        </div>
                        <div class="form-group" style="margin-bottom:0;">
                            <label style="font-size:11px;">{{ $t('common.avatar') }}</label>
                            <label class="btn btn-small btn-outline" style="cursor:pointer;font-size:10px;padding:1px 6px;">
                                📷
                                <input type="file" accept="image/*" @change="handleMemberAvatar(idx, $event)" hidden>
                            </label>
                        </div>
                    </div>
                    <div class="ext-url-row" style="margin-top:4px;">
                        <span class="ext-url-label">🔗</span>
                        <input class="form-input ext-url-input" :value="m.avatarUrl" @input="updateMember(idx, 'avatarUrl', $event.target.value)" :placeholder="$t('common.externalLinkShort')" style="font-size:11px;">
                    </div>
                </div>
                <button class="add-comment-btn" @click="addMember">{{ $t('common.addMember') }}</button>
            </div>
        </template>

        <!-- 单聊设置 -->
        <template v-else>
            <div class="form-group">
                <label>{{ $t('common.contactAvatar') }}</label>
                <div class="image-upload" :class="{ 'has-image': data.contactAvatar }" @click="$refs.avatarInput.click()" style="width:80px;height:80px;border-radius:50%;">
                    <template v-if="data.contactAvatar">
                        <img :src="data.contactAvatar" alt="avatar" style="border-radius:50%;">
                        <button class="remove-image" @click.stop="updateField('contactAvatar', '')">✕</button>
                    </template>
                    <div v-else class="upload-placeholder">
                        <span>📷</span><small>{{ $t('common.avatar') }}</small>
                    </div>
                </div>
                <input type="file" ref="avatarInput" accept="image/*" @change="handleUpload($event, 'contactAvatar')" hidden>
                <div class="ext-url-row">
                    <span class="ext-url-label">🔗</span>
                    <input class="form-input ext-url-input" :value="data.contactAvatarUrl" @input="updateField('contactAvatarUrl', $event.target.value)" :placeholder="$t('common.externalLinkShort')">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>{{ $t('common.contactName') }}</label>
                    <input class="form-input" :value="data.contactName" @input="updateField('contactName', $event.target.value)" :placeholder="$t('common.contactName')">
                </div>
                <div class="form-group">
                    <label>{{ $t('wa.contactStatus') }}</label>
                    <input class="form-input" :value="data.contactStatus" @input="updateField('contactStatus', $event.target.value)" :placeholder="$t('wa.phOnline')">
                </div>
            </div>
        </template>

        <div class="section-divider"></div>

        <!-- 皮肤选择 -->
        <div class="sub-title">🎨 {{ $t('common.chatSkin') }}</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
            <div v-for="t in themes" :key="t.id"
                @click="selectTheme(t.id)"
                :style="{ background: t.bg, border: data.theme === t.id ? '3px solid #007aff' : '3px solid #e0e0e0', borderRadius: '8px', padding: '8px 12px', width: '70px', textAlign: 'center', fontSize: '11px', lineHeight: 1.3 }">
                <div :style="{ width: '100%', height: '6px', borderRadius: '3px', background: t.header, marginBottom: '4px' }"></div>
                {{ $t('wa.theme.' + t.id) }}
            </div>
        </div>
        <div v-if="data.theme === 'custom'" class="form-row">
            <div class="form-group">
                <label>{{ $t('wa.bgColor') }}</label>
                <input type="color" :value="data.customBgColor || '#efeae2'" @input="updateField('customBgColor', $event.target.value)" style="width:100%;height:32px;">
            </div>
            <div class="form-group">
                <label>{{ $t('wa.headerColor') }}</label>
                <input type="color" :value="data.customHeaderColor || '#075e54'" @input="updateField('customHeaderColor', $event.target.value)" style="width:100%;height:32px;">
            </div>
        </div>

        <div class="section-divider"></div>

        <!-- 其他设置 -->
        <div class="form-row">
            <div class="form-group">
                <label>{{ $t('common.dateLabel') }}</label>
                <input class="form-input" :value="data.dateSeparator" @input="updateField('dateSeparator', $event.target.value)" :placeholder="$t('common.dateLabel')">
            </div>
        </div>
        <div class="form-group">
            <div class="toggle-group">
                <label class="toggle">
                    <input type="checkbox" :checked="data.showReadReceipt" @change="updateField('showReadReceipt', $event.target.checked)">
                    <span class="toggle-slider"></span>
                </label>
                <span style="font-size:13px;">{{ $t('common.readReceipt') }}</span>
            </div>
        </div>
        <div class="form-group" v-if="data.showReadReceipt">
            <label>{{ $t('common.receiptText') }}</label>
            <input class="form-input" :value="data.readReceiptText" @input="updateField('readReceiptText', $event.target.value)" :placeholder="$t('common.receiptText')">
        </div>
        <div class="form-group">
            <div class="toggle-group">
                <label class="toggle">
                    <input type="checkbox" :checked="data.showTyping" @change="updateField('showTyping', $event.target.checked)">
                    <span class="toggle-slider"></span>
                </label>
                <span style="font-size:13px;">{{ $t('common.showTypingLabel') }}</span>
            </div>
        </div>

        <div class="section-divider"></div>

        <!-- 消息列表 -->
        <div class="sub-title">💬 {{ $t('common.messages') }} <span class="hint">({{ data.messages.length }}{{ $t('common.count') }})</span></div>
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
                            {{ msg.type === 'sent' ? $t('common.msgSent') : msg.type === 'received' ? $t('common.msgReceived') : msg.type === 'system' ? $t('common.msgSystem') : $t('common.msgTime') }}
                        </strong>
                    </span>
                    <div style="display:flex;gap:4px;align-items:center;">
                        <button class="remove-comment" style="width:20px;height:20px;font-size:11px;" :title="$t('common.insertBelow')"
                            @click="insertMessage(idx)">⬇</button>
                        <button class="remove-comment" style="width:20px;height:20px;font-size:11px;"
                            @click="toggleType(idx)">⇄</button>
                        <button class="remove-comment" @click="removeMessage(idx)">✕</button>
                    </div>
                </div>

                <!-- System Message Editor -->
                <template v-if="msg.type === 'system'">
                    <div class="form-group" style="margin-bottom:8px;">
                        <label style="font-size:12px;">{{ $t('wa.templateType') }}</label>
                        <select class="form-input" :value="msg.systemType || 'custom'" @change="updateMessage(idx, 'systemType', $event.target.value)" style="font-size:12px;">
                            <option value="addMember">{{ $t('wa.tmpl.addMember') }}</option>
                            <option value="join">{{ $t('wa.tmpl.joinLink') }}</option>
                            <option value="leave">{{ $t('wa.tmpl.leaveGroup') }}</option>
                            <option value="remove">{{ $t('wa.tmpl.removeMember') }}</option>
                            <option value="changeName">{{ $t('wa.tmpl.renameGroup') }}</option>
                            <option value="changeDesc">{{ $t('wa.tmpl.editDesc') }}</option>
                            <option value="setAdmin">{{ $t('wa.tmpl.setAdmin') }}</option>
                            <option value="revokeAdmin">{{ $t('wa.tmpl.removeAdmin') }}</option>
                            <option value="custom">{{ $t('wa.tmpl.custom') }}</option>
                        </select>
                    </div>
                    <template v-if="msg.systemType === 'custom'">
                        <div class="form-group" style="margin-bottom:8px;">
                            <label style="font-size:12px;">{{ $t('wa.customContent') }}</label>
                            <textarea class="form-input" :value="msg.systemText || ''"
                                @input="updateMessage(idx, 'systemText', $event.target.value)"
                                :placeholder="$t('wa.phCustomMsg')" rows="2"
                                style="font-size:13px;min-height:36px;"></textarea>
                        </div>
                    </template>
                    <template v-else>
                        <div v-if="needsActor(msg.systemType)" class="form-group" style="margin-bottom:8px;">
                            <label style="font-size:12px;">{{ $t('wa.actor') }}</label>
                            <select class="form-input" :value="msg.systemActor !== undefined ? msg.systemActor : -1" @change="updateMessage(idx, 'systemActor', parseInt($event.target.value))" style="font-size:12px;">
                                <option value="-1">{{ $t('wa.me') }}</option>
                                <option v-for="(m, mi) in (data.groupMembers || [])" :key="mi" :value="mi">{{ m.name }}</option>
                            </select>
                        </div>
                        <div v-if="needsTarget(msg.systemType)" class="form-group" style="margin-bottom:8px;">
                            <label style="font-size:12px;">{{ $t('wa.targetMember') }}</label>
                            <select class="form-input" :value="msg.systemTarget || 0" @change="updateMessage(idx, 'systemTarget', parseInt($event.target.value))" style="font-size:12px;">
                                <option v-for="(m, mi) in (data.groupMembers || [])" :key="mi" :value="mi">{{ m.name }}</option>
                            </select>
                        </div>
                        <div v-if="needsText(msg.systemType)" class="form-group" style="margin-bottom:8px;">
                            <label style="font-size:12px;">{{ msg.systemType === 'changeName' ? $t('wa.newGroupName') : $t('wa.customContent') }}</label>
                            <input class="form-input" :value="msg.systemText || ''" @input="updateMessage(idx, 'systemText', $event.target.value)" :placeholder="msg.systemType === 'changeName' ? $t('wa.phNewGroupName') : $t('wa.phContent')" style="font-size:12px;">
                        </div>
                    </template>
                    <div style="font-size:11px;color:#888;margin-top:4px;padding:4px 8px;background:#f5f5f5;border-radius:4px;">
                        {{ $t('wa.preview') }}{{ getSystemPreview(msg) }}
                    </div>
                </template>

                <!-- Time Separator Editor -->
                <template v-else-if="msg.type === 'timeSeparator'">
                    <div class="form-group" style="margin-bottom:8px;">
                        <label style="font-size:12px;">{{ $t('common.msgTime') }}</label>
                        <input class="form-input" :value="msg.text || ''"
                            @input="updateMessage(idx, 'text', $event.target.value)"
                            :placeholder="$t('wa.phTime')" style="font-size:13px;">
                    </div>
                </template>

                <!-- Normal Message Editor (sent/received) -->
                <template v-else>
                    <div v-if="data.isGroup && msg.type === 'received'" class="form-group" style="margin-bottom:8px;">
                        <label style="font-size:12px;">{{ $t('common.sender') }}</label>
                        <select class="form-input" :value="msg.sender || 0" @change="updateMessage(idx, 'sender', parseInt($event.target.value))" style="font-size:12px;">
                            <option v-for="(m, mi) in (data.groupMembers || [])" :key="mi" :value="mi">{{ m.name }}</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom:8px;">
                        <textarea class="form-input" :value="msg.text"
                            @input="updateMessage(idx, 'text', $event.target.value)"
                            :placeholder="$t('common.msgContent')" rows="2"
                            style="font-size:13px;min-height:36px;"></textarea>
                    </div>
                    <div class="form-group" style="margin-bottom:8px;">
                        <label style="font-size:12px;">{{ $t('common.image') }}</label>
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
                            <input class="form-input ext-url-input" :value="msg.imageUrl" @input="updateMessage(idx, 'imageUrl', $event.target.value)" :placeholder="$t('common.externalLinkShort')" style="font-size:11px;">
                        </div>
                    </div>
                            <div class="form-group" style="margin-bottom:8px;">
                                <div class="toggle-group" style="margin-bottom:0;">
                                    <label class="toggle">
                                        <input type="checkbox" :checked="msg.isVoice" @change="updateMessage(idx, 'isVoice', $event.target.checked)">
                                        <span class="toggle-slider"></span>
                                    </label>
                                    <span style="font-size:12px;">{{ $t('common.voiceMsg') }}</span>
                                </div>
                            </div>
                            <template v-if="msg.isVoice">
                                <div class="form-group" style="margin-bottom:8px;">
                                    <label style="font-size:12px;">{{ $t('common.duration') }}</label>
                                    <input class="form-input" :value="msg.voiceDuration" @input="updateMessage(idx, 'voiceDuration', $event.target.value)" placeholder="0:05" style="font-size:12px;">
                                </div>
                                <div class="form-group" style="margin-bottom:8px;">
                                    <label style="font-size:12px;">{{ $t('common.transcription') }}</label>
                                    <input class="form-input" :value="msg.voiceTranscription" @input="updateMessage(idx, 'voiceTranscription', $event.target.value)" :placeholder="$t('common.phTranscription')" style="font-size:12px;">
                                </div>
                            </template>
                    <div class="form-group" style="margin-bottom:8px;">
                        <div class="toggle-group" style="margin-bottom:0;">
                            <label class="toggle">
                                <input type="checkbox" :checked="msg.isCall" @change="updateMessage(idx, 'isCall', $event.target.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                            <span style="font-size:12px;">{{ $t('common.call') }}</span>
                        </div>
                    </div>
                    <template v-if="msg.isCall">
                        <div class="form-group" style="margin-bottom:8px;">
                            <label style="font-size:12px;">{{ $t('common.callType') }}</label>
                            <select class="form-input" :value="msg.callType || 'voice'" @change="updateMessage(idx, 'callType', $event.target.value)" style="font-size:12px;">
                                <option value="voice">{{ $t('common.voiceCall') }}</option>
                                <option value="video">{{ $t('common.videoCall') }}</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom:8px;">
                            <label style="font-size:12px;">{{ $t('common.callStatus') }}</label>
                            <select class="form-input" :value="msg.callStatus || 'answered'" @change="updateMessage(idx, 'callStatus', $event.target.value)" style="font-size:12px;">
                                <option value="answered">{{ $t('common.answered') }}</option>
                                <option value="missed">{{ $t('common.missed') }}</option>
                                <option value="declined">{{ $t('common.declined') }}</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom:8px;">
                            <label style="font-size:12px;">{{ $t('common.callDuration') }}</label>
                            <input class="form-input" :value="msg.callDuration" @input="updateMessage(idx, 'callDuration', $event.target.value)" placeholder="5:23" style="font-size:12px;">
                        </div>
                    </template>
                    <div class="form-row" style="margin-bottom:0;">
                        <div class="form-group" style="margin-bottom:0;">
                            <label style="font-size:12px;">{{ $t('common.msgTime') }}</label>
                            <input class="form-input" :value="msg.time" @input="updateMessage(idx, 'time', $event.target.value)" :placeholder="$t('common.msgTime')" style="font-size:12px;">
                        </div>
                        <div class="form-group" style="margin-bottom:0;">
                            <label style="font-size:12px;">{{ $t('common.reaction') }}</label>
                            <input class="form-input" :value="msg.reaction" @input="updateMessage(idx, 'reaction', $event.target.value)" :placeholder="$t('wa.phReaction')" style="font-size:12px;">
                        </div>
                        <div v-if="msg.type === 'sent'" class="form-group" style="margin-bottom:0;">
                            <label style="font-size:12px;">{{ $t('wa.readStatus') }}</label>
                            <select class="form-input" :value="msg.ticks || 'sent'" @change="updateMessage(idx, 'ticks', $event.target.value)" style="font-size:12px;">
                                <option value="sent">{{ $t('wa.ticksSent') }}</option>
                                <option value="delivered">{{ $t('wa.ticksDelivered') }}</option>
                                <option value="read">{{ $t('wa.ticksRead') }}</option>
                            </select>
                        </div>
                    </div>
                </template>
            </div>
            <button class="add-comment-btn" @click="addMessage">{{ $t('common.addMessage') }}</button>
            <div style="display:flex;gap:6px;margin-top:4px;">
                <button class="add-comment-btn" style="background:#ff9500;" @click="addSystemMessage">{{ $t('common.addSystemMsg') }}</button>
                <button class="add-comment-btn" style="background:#007aff;" @click="addTimeSeparator">{{ $t('common.addTimeLabel') }}</button>
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
            <span class="wa-header-back"><span class="wa-emoji-icon">←</span><svg class="wa-hd-icon" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></span>
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
                <div class="wa-header-name">{{ data.isGroup ? (data.groupName || $t('common.groupChat')) : (data.contactName || $t('common.contact')) }}</div>
                <div class="wa-header-status">{{ data.isGroup ? groupMembersText : (data.contactStatus || $t('common.online')) }}</div>
            </div>
            <div class="wa-header-actions">
                <span class="wa-header-action"><span class="wa-emoji-icon">📹</span><svg class="wa-hd-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg></span>
                <span class="wa-header-action"><span class="wa-emoji-icon">📞</span><svg class="wa-hd-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg></span>
                <span class="wa-header-action"><span class="wa-emoji-icon">⋯</span><svg class="wa-hd-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg></span>
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
                    <span class="wa-call-icon"><template v-if="msg.callType === 'video'"><span class="wa-emoji-icon">📹</span><svg class="wa-hd-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg></template><template v-else><span class="wa-emoji-icon">📞</span><svg class="wa-hd-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg></template></span>
                    <span class="wa-call-text">
                        <template v-if="msg.callStatus === 'missed'">{{ $t('common.missedCall') }}</template>
                        <template v-else-if="msg.callStatus === 'declined'">{{ $t('common.declinedCall') }}</template>
                        <template v-else>{{ $t('common.answeredCall') }}</template>
                    </span>
                    <span v-if="msg.callDuration && msg.callStatus !== 'missed' && msg.callStatus !== 'declined'" class="wa-call-duration">{{ msg.callDuration }}</span>
                </div>

                <!-- Normal Message Bubble -->
                <div v-else :class="['wa-msg-row', msg.type === 'sent' ? 'wa-row-sent' : 'wa-row-received']">
                    <template v-if="msg.type === 'received' && isWaAvatarVisible(idx)">
                        <template v-if="data.isGroup && getSender(msg)">
                            <img v-if="getSender(msg).avatar || getSender(msg).avatarUrl" class="wa-msg-avatar" :src="getSender(msg).avatar || getSender(msg).avatarUrl" alt="">
                            <div v-else class="wa-msg-avatar wa-msg-avatar-placeholder" :style="{ background: getSender(msg).color || '#ccc' }">{{ (getSender(msg).name || 'U')[0].toUpperCase() }}</div>
                        </template>
                        <template v-else>
                            <img v-if="data.contactAvatar || data.contactAvatarUrl" class="wa-msg-avatar" :src="data.contactAvatar || data.contactAvatarUrl" alt="">
                            <div v-else class="wa-msg-avatar wa-msg-avatar-placeholder">{{ (data.contactName || 'U')[0].toUpperCase() }}</div>
                        </template>
                    </template>
                    <div v-if="msg.type === 'received' && !isWaAvatarVisible(idx)" class="wa-msg-avatar-spacer"></div>
                    <div :class="['wa-bubble', msg.type === 'sent' ? 'wa-bubble-sent' : 'wa-bubble-received']">
                    <div v-if="data.isGroup && msg.type === 'received' && getSender(msg)" class="wa-sender-name" :style="{ color: getSender(msg).color || '#075e54' }">{{ getSender(msg).name }}</div>
                    <div v-if="msg.isVoice" class="wa-voice-msg">
                        <div class="wa-voice-play"><span class="wa-emoji-icon">▶</span><svg class="wa-hd-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>
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
                    <div v-if="!msg.isVoice && !msg.text && !msg.image && !msg.imageUrl" class="wa-bubble-empty">{{ $t('common.emptyMsg') }}</div>
                    <div class="wa-bubble-meta">
                        <span class="wa-bubble-time">{{ msg.time }}</span>
                        <span v-if="msg.type === 'sent' && msg.ticks" :class="['wa-bubble-ticks', msg.ticks === 'read' ? 'wa-ticks-read' : 'wa-ticks-sent']">
                            <span class="wa-emoji-icon">{{ msg.ticks === 'sent' ? '✓' : '✓✓' }}</span>
                            <svg v-if="msg.ticks === 'sent'" class="wa-hd-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                            <svg v-else class="wa-hd-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/></svg>
                        </span>
                    </div>
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
        <div v-if="data.showReadReceipt" class="wa-read-receipt">{{ data.readReceiptText || $t('common.read') }}</div>

        <!-- Input Bar -->
        <div class="wa-input-bar">
            <span class="wa-input-emoji"><span class="wa-emoji-icon">😀</span><svg class="wa-hd-icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg></span>
            <div class="wa-input-field">
                <span class="wa-input-placeholder">{{ $t('common.typeMessage') }}</span>
            </div>
            <span class="wa-input-attach"><span class="wa-emoji-icon">📎</span><svg class="wa-hd-icon" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg></span>
            <span class="wa-send-btn"><span class="wa-emoji-icon">➤</span><svg class="wa-hd-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg></span>
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
        isWaAvatarVisible(idx) {
            const msgs = this.data.messages;
            const current = msgs[idx];
            if (!current || current.type !== 'received') return false;
            let prevIdx = idx - 1;
            while (prevIdx >= 0 && (msgs[prevIdx].type === 'system' || msgs[prevIdx].type === 'timeSeparator')) {
                prevIdx--;
            }
            if (prevIdx < 0) return true;
            const prev = msgs[prevIdx];
            if (prev.type !== 'received') return true;
            if (this.data.isGroup) {
                return current.sender !== prev.sender;
            }
            return false;
        }
    }
};
