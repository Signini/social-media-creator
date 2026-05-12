/**
 * iMessage 平台模块
 */

const iMessageDefaults = {
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
        { id: 7, type: 'received', text: '', image: '', imageUrl: '', time: '下午 3:25', reaction: '', isCall: true, callType: 'voice', callDuration: '5:23', callStatus: 'answered' },
        { id: 8, type: 'notification', text: '该发件人不在你的联系人列表中', image: '', imageUrl: '', time: '', reaction: '', notificationColor: '#8e8e93' }
    ]
};

const iMessageEditor = {
    name: 'imessage-editor',
    props: ['data'],
    emits: ['update'],
    template: `
    <div class="imessage-editor">
        <div class="sub-title">👤 {{ $t('common.chatInfo') }}</div>
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
                <input class="form-input ext-url-input" :value="data.contactAvatarUrl" @input="updateField('contactAvatarUrl', $event.target.value)" :placeholder="$t('common.externalLink')">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>{{ $t('common.contactName') }}</label>
                <input class="form-input" :value="data.contactName" @input="updateField('contactName', $event.target.value)" :placeholder="$t('common.contactName')">
            </div>
            <div class="form-group">
                <label>{{ $t('im.subtitle') }}</label>
                <input class="form-input" :value="data.navSubtitle" @input="updateField('navSubtitle', $event.target.value)" :placeholder="$t('im.phSubtitle')">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>{{ $t('im.timeTag') }}</label>
                <input class="form-input" :value="data.timeSeparator" @input="updateField('timeSeparator', $event.target.value)" :placeholder="$t('im.phTimeTag')">
            </div>
            <div class="form-group">
                <label>{{ $t('im.dateTag') }}</label>
                <input class="form-input" :value="data.dateSeparator" @input="updateField('dateSeparator', $event.target.value)" :placeholder="$t('im.phDateTag')">
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
            <input class="form-input" :value="data.readReceiptText" @input="updateField('readReceiptText', $event.target.value)" :placeholder="$t('common.read')">
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
                :style="{ borderLeft: msg.type === 'sent' ? '3px solid #007aff' : msg.type === 'notification' ? '3px solid #ff9500' : '3px solid #e9e9eb' }">
                <div class="drag-handle">⋮⋮</div>
                <div class="comment-header">
                    <span>
                        <strong :style="{ color: msg.type === 'sent' ? '#007aff' : msg.type === 'notification' ? '#ff9500' : '#333' }">
                            {{ msg.type === 'sent' ? $t('common.msgSent') : msg.type === 'notification' ? $t('common.msgNotification') : $t('common.msgReceived') }}
                        </strong>
                    </span>
                    <div style="display:flex;gap:4px;align-items:center;">
                        <button class="remove-comment" style="width:20px;height:20px;font-size:11px;" :title="$t('common.insertBelow')"
                            @click="insertMessage(idx, 'sent')">⬇</button>
                        <button class="remove-comment" style="width:20px;height:20px;font-size:11px;"
                            @click="toggleType(idx)" :title="$t('im.switchType') + msg.type + ')'" >⇄</button>
                        <button class="remove-comment" @click="removeMessage(idx)">✕</button>
                    </div>
                </div>
                <div class="form-group" style="margin-bottom:8px;">
                    <textarea class="form-input" :value="msg.text"
                        @input="updateMessage(idx, 'text', $event.target.value)"
                        :placeholder="msg.type === 'notification' ? $t('im.phNotification') : $t('im.phMsgContent')" rows="2"
                        style="font-size:13px;min-height:36px;"></textarea>
                </div>
                <template v-if="msg.type === 'notification'">
                    <div class="form-group" style="margin-bottom:8px;">
                        <label style="font-size:12px;">{{ $t('im.textColor') }}</label>
                        <div style="display:flex;gap:6px;align-items:center;">
                            <input type="color" :value="msg.notificationColor || '#8e8e93'" @input="updateMessage(idx, 'notificationColor', $event.target.value)" style="width:32px;height:28px;border:1px solid #ddd;border-radius:4px;padding:1px;cursor:pointer;">
                            <input class="form-input" :value="msg.notificationColor || '#8e8e93'" @input="updateMessage(idx, 'notificationColor', $event.target.value)" placeholder="#8e8e93" style="font-size:12px;width:100px;">
                        </div>
                    </div>
                </template>
                <template v-if="msg.type !== 'notification'">
                <div class="form-group" style="margin-bottom:8px;">
                    <label style="font-size:12px;">{{ $t('im.attachImage') }}</label>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <button class="btn btn-small btn-outline" @click="triggerMsgImage(idx)" style="font-size:11px;">{{ $t('im.uploadImage') }}</button>
                        <button v-if="msg.image" class="btn btn-small btn-danger" @click="updateMessage(idx, 'image', '')" style="font-size:11px;">{{ $t('im.deleteImage') }}</button>
                        <span v-if="msg.image" style="font-size:11px;color:#34c759;">{{ $t('im.imageSet') }}</span>
                    </div>
                    <input type="file" :ref="'msgImage_' + idx" accept="image/*" @change="handleMsgImage($event, idx)" hidden>
                    <div class="ext-url-row" style="margin-top:4px;">
                        <span class="ext-url-label">🔗</span>
                        <input class="form-input ext-url-input" :value="msg.imageUrl" @input="updateMessage(idx, 'imageUrl', $event.target.value)" :placeholder="$t('common.externalLink')" style="font-size:11px;">
                    </div>
                </div>
                <div class="form-row" style="margin-bottom:0;">
                    <div class="form-group" style="margin-bottom:0;">
                        <label style="font-size:12px;">{{ $t('im.timeField') }}</label>
                        <input class="form-input" :value="msg.time" @input="updateMessage(idx, 'time', $event.target.value)" :placeholder="$t('im.phTime')" style="font-size:13px;">
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                        <label style="font-size:12px;">{{ $t('im.reaction') }}</label>
                        <input class="form-input" :value="msg.reaction" @input="updateMessage(idx, 'reaction', $event.target.value)" :placeholder="$t('im.phReaction')" style="font-size:13px;">
                    </div>
                </div>
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
                            <option value="video">{{ $t('im.faceTime') }}</option>
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
                </template>
            </div>
            <div style="display:flex;gap:6px;">
                <button class="add-comment-btn" @click="addMessage('sent')" style="flex:1;">{{ $t('im.sendMsg') }}</button>
                <button class="add-comment-btn" @click="addMessage('received')" style="flex:1;">{{ $t('im.receiveMsg') }}</button>
                <button class="add-comment-btn" @click="addMessage('notification')" style="flex:1;">{{ $t('im.notificationMsg') }}</button>
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
                const compressed = await ImageUtil.compressImage(base64, 400);
                this.updateField(field, compressed);
            } catch (e) { console.error('头像上传失败:', e.message); }
        },
        triggerMsgImage(idx) {
            const ref = this.$refs['msgImage_' + idx];
            if (ref) {
                if (Array.isArray(ref)) ref[0].click();
                else ref.click();
            }
        },
        async handleMsgImage(event, idx) {
            const file = event.target.files[0];
            if (!file) return;
            try {
                const base64 = await ImageUtil.fileToBase64(file);
                const compressed = await ImageUtil.compressImage(base64, 600);
                this.updateMessage(idx, 'image', compressed);
            } catch (e) { console.error('消息图片上传失败:', e.message); }
        },
        addMessage(type) {
            const newMsg = {
                id: Date.now(),
                type,
                text: '',
                image: '',
                imageUrl: '',
                time: '',
                reaction: '',
                isCall: false,
                callType: 'voice',
                callDuration: '',
                callStatus: 'answered'
            };
            if (type === 'notification') {
                newMsg.notificationColor = '#8e8e93';
            }
            const messages = [...this.data.messages, newMsg];
            this.updateField('messages', messages);
        },
        insertMessage(idx, type) {
            const newMsg = {
                id: Date.now(),
                type,
                text: '',
                image: '',
                imageUrl: '',
                time: '',
                reaction: '',
                isCall: false,
                callType: 'voice',
                callDuration: '',
                callStatus: 'answered'
            };
            if (type === 'notification') {
                newMsg.notificationColor = '#8e8e93';
            }
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
            const types = ['sent', 'received', 'notification'];
            const currentIdx = types.indexOf(msg.type);
            const nextType = types[(currentIdx + 1) % types.length];
            const updated = { ...msg, type: nextType };
            if (nextType === 'notification' && !updated.notificationColor) {
                updated.notificationColor = '#8e8e93';
            }
            messages[idx] = updated;
            this.updateField('messages', messages);
        },
        updateMessage(idx, field, value) {
            const messages = [...this.data.messages];
            messages[idx] = { ...messages[idx], [field]: value };
            this.updateField('messages', messages);
        },
        // 拖拽排序方法
        onDragStart(msg, idx, event) {
            event.dataTransfer.setData('text/plain', String(idx));
            const el = event.target.closest('.comment-item');
            if (el) {
                el.classList.add('dragging');
            }
        },
        onDragOver(msg, idx, event) {
            event.preventDefault();
            if (msg === this.data.messages[idx]) return;
            
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
        onDragLeave(msg, idx, event) {
            const el = event.target.closest('.comment-item');
            if (el) {
                el.classList.remove('drag-over', 'drag-over-bottom');
            }
        },
        onDrop(msg, idx, event) {
            event.preventDefault();
            
            const data = [...this.data.messages];
            const dragIndex = data.findIndex(m => m.id === msg.id);
            
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
                this.updateField('messages', data);
                
                // 清除样式
                const elements = document.querySelectorAll('.comment-item');
                elements.forEach(el => {
                    el.classList.remove('dragging', 'drag-over', 'drag-over-bottom');
                });
            }
        }
    }
};

const iMessagePreview = {
    name: 'imessage-preview',
    props: ['data'],
    template: `
    <div class="msg-conversation">
        <!-- Nav Bar -->
        <div class="msg-navbar">
            <div class="msg-navbar-left">
                <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
                <span style="font-size:17px;">{{ $t('im.back') }}</span>
            </div>
            <div class="msg-navbar-center">
                <img v-if="data.contactAvatar || data.contactAvatarUrl" class="msg-nav-avatar" :src="data.contactAvatar || data.contactAvatarUrl" :alt="data.contactName">
                <div v-else class="msg-nav-avatar-placeholder">{{ (data.contactName || $t('common.contactName'))[0] }}</div>
                <div class="msg-navbar-title">{{ data.contactName || $t('common.contactName') }}</div>
                <div v-if="data.navSubtitle" class="msg-navbar-subtitle">{{ data.navSubtitle }}</div>
            </div>
            <div class="msg-navbar-right">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="6" r="1"/><circle cx="12" cy="18" r="1"/></svg>
            </div>
        </div>

        <!-- Messages -->
        <div class="msg-messages">
            <!-- Date -->
            <div class="msg-date-separator" v-if="data.dateSeparator">{{ data.dateSeparator }}</div>
            
            <!-- Time -->
            <div class="msg-time-separator" v-if="data.timeSeparator">{{ data.timeSeparator }}</div>

            <!-- Message bubbles -->
            <template v-for="(msg, idx) in data.messages" :key="idx">
                <div v-if="msg.isCall" :class="['msg-call-record', 'msg-call-' + (msg.callStatus || 'answered')]">
                    <span class="msg-call-icon">{{ msg.callType === 'video' ? '📹' : '📞' }}</span>
                    <span class="msg-call-text">
                        <template v-if="msg.callStatus === 'missed'">{{ $t('common.missedCall') }}</template>
                        <template v-else-if="msg.callStatus === 'declined'">{{ $t('common.declinedCall') }}</template>
                        <template v-else>{{ $t('common.answeredCall') }}</template>
                    </span>
                    <span v-if="msg.callDuration && msg.callStatus !== 'missed' && msg.callStatus !== 'declined'" class="msg-call-duration">{{ msg.callDuration }}</span>
                </div>
                <div v-else-if="msg.type === 'notification'" class="msg-notification" :style="{ color: msg.notificationColor || '#8e8e93' }">
                    {{ msg.text }}
                </div>
                <div v-else :class="['msg-bubble-row', msg.type === 'sent' ? 'msg-row-sent' : 'msg-row-received']">
                    <img v-if="msg.type === 'received' && (data.contactAvatar || data.contactAvatarUrl) && isAvatarVisible(idx)" class="msg-contact-avatar" :src="data.contactAvatar || data.contactAvatarUrl" alt="">
                    <div v-else-if="msg.type === 'received' && isAvatarVisible(idx)" class="msg-contact-avatar msg-avatar-placeholder">{{ (data.contactName || $t('common.contactName'))[0] }}</div>
                    <div v-if="msg.type === 'received' && !isAvatarVisible(idx) && isAvatarSpacerNeeded(idx)" class="msg-avatar-spacer"></div>
                    <div :class="['msg-bubble',
                        msg.type === 'sent' ? 'msg-bubble-sent' : 'msg-bubble-received',
                        getMessageStyle(idx)
                    ]">
                    <!-- Text message -->
                    <div v-if="msg.text && !msg.image && !msg.imageUrl" class="msg-bubble-text">{{ msg.text }}</div>
                    
                    <!-- Image only message -->
                    <div v-if="(msg.image || msg.imageUrl) && !msg.text" class="msg-bubble-image">
                        <img :src="msg.image || msg.imageUrl" alt="">
                    </div>

                    <!-- Image + text message -->
                    <div v-if="(msg.image || msg.imageUrl) && msg.text" class="msg-bubble-image" style="margin-bottom:2px;">
                        <img :src="msg.image || msg.imageUrl" alt="">
                    </div>
                    <div v-if="(msg.image || msg.imageUrl) && msg.text" class="msg-bubble-text">{{ msg.text }}</div>

                    <!-- Empty placeholder -->
                    <div v-if="!msg.text && !msg.image && !msg.imageUrl" class="msg-bubble-text" style="color:#c7c7cc; font-style:italic;">
                        {{ $t('common.emptyMsg') }}
                    </div>
                </div>
                </div>
                <!-- Reaction -->
                <div v-if="!msg.isCall && msg.reaction" :class="['msg-reaction', msg.type === 'sent' ? '' : '']">
                    {{ msg.reaction }}
                </div>
            </template>

            <!-- Typing Indicator -->
            <div v-if="data.showTyping" class="msg-typing">
                <div class="msg-typing-dot"></div>
                <div class="msg-typing-dot"></div>
                <div class="msg-typing-dot"></div>
            </div>
        </div>

        <!-- Read Receipt -->
        <div v-if="data.showReadReceipt" class="msg-read-receipt">{{ data.readReceiptText || $t('common.read') }}</div>

        <!-- Input Bar -->
        <div class="msg-input-bar">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td width="30" align="center" valign="middle"><span class="msg-input-plus">+</span></td>
                    <td valign="middle"><div class="msg-input-field"><span class="msg-input-placeholder">{{ $t('im.imessage') }}</span></div></td>
                    <td width="40" align="center" valign="middle"><span class="msg-send-btn">➤</span></td>
                </tr>
            </table>
        </div>
    </div>
    `,
    methods: {
        getMessageStyle(idx) {
            const msgs = this.data.messages;
            const current = msgs[idx];
            if (current.type === 'notification' || current.isCall) return 'msg-single';
            // Find prev/next that are regular messages (not notification/call)
            let prev = null, next = null;
            for (let i = idx - 1; i >= 0; i--) {
                if (!msgs[i].isCall && msgs[i].type !== 'notification') { prev = msgs[i]; break; }
            }
            for (let i = idx + 1; i < msgs.length; i++) {
                if (!msgs[i].isCall && msgs[i].type !== 'notification') { next = msgs[i]; break; }
            }

            const sameAsPrev = prev && prev.type === current.type;
            const sameAsNext = next && next.type === current.type;

            if (!sameAsPrev && !sameAsNext) return 'msg-single';
            if (!sameAsPrev && sameAsNext) return 'msg-tail';
            if (sameAsPrev && sameAsNext) return '';
            if (sameAsPrev && !sameAsNext) return 'msg-last';
            return 'msg-single';
        },
        isAvatarVisible(idx) {
            const msgs = this.data.messages;
            const current = msgs[idx];
            if (current.type !== 'received') return false;
            const style = this.getMessageStyle(idx);
            return style === 'msg-tail' || style === 'msg-single';
        },
        isAvatarSpacerNeeded(idx) {
            const msgs = this.data.messages;
            const current = msgs[idx];
            if (current.type !== 'received') return false;
            return !this.isAvatarVisible(idx);
        }
    }
};
