<template>
  <div class="flex h-screen bg-surface-50 dark:bg-surface-900 overflow-hidden">
    <!-- Sidebar -->
    <div class="w-full md:w-80 lg:w-96 bg-surface-0 dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 flex flex-col h-full transition-all duration-300" :class="{'hidden md:flex': selectedChatId && isMobile, 'flex': !selectedChatId || !isMobile}">
      
      <!-- Header -->
      <div class="p-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center bg-primary-50 dark:bg-primary-900/20">
        <div class="flex items-center gap-2">
           <Avatar icon="pi pi-user" class="mr-2" shape="circle" size="large" style="background-color: var(--p-primary-500); color: #ffffff" />
           <span class="font-bold text-xl text-surface-900 dark:text-surface-0">Chats</span>
        </div>
        <div class="flex gap-2">
            <Button icon="pi pi-plus" rounded text severity="primary" aria-label="New Chat" @click="showCreateChatDialog = true" />
            <Button icon="pi pi-cog" rounded text severity="secondary" aria-label="Settings" @click="toggleSettingsMenu" />
            <Menu ref="settingsMenu" :model="settingsItems" :popup="true" />
        </div>
      </div>

      <!-- Chat List -->
      <div class="flex-1 overflow-y-auto">
        <div v-if="chatStore.loading" class="flex justify-center p-4">
            <ProgressSpinner style="width: 30px; height: 30px" />
        </div>
        <div v-else-if="sortedChats.length === 0" class="p-4 text-center text-surface-500">
            No chats yet. Start a new one!
        </div>
        <ul v-else class="list-none p-0 m-0">
            <li v-for="chat in sortedChats" :key="chat._id" 
                class="p-4 cursor-pointer border-b border-surface-100 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors relative group"
                :class="{'bg-primary-50 dark:bg-primary-900/30': chatStore.selectedChat?._id === chat._id}"
            >
                <div class="flex items-center gap-3" @click="onSelectChat(chat)">
                    <div class="relative">
                        <Avatar :label="getChatAvatarLabel(chat)" shape="circle" size="large" 
                            :style="{ 'background-color': chat.isAIChat ? 'var(--p-cyan-500)' : 'var(--p-primary-500)', color: '#ffffff' }"
                        >
                            <template #icon v-if="chat.isAIChat">
                                <i class="pi pi-sparkles"></i>
                            </template>
                        </Avatar>
                        <Badge v-if="getOnlineStatus(chat)" severity="success" class="absolute bottom-0 right-0 w-3 h-3 p-0 min-w-0 rounded-full border-2 border-white dark:border-surface-800"></Badge>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-baseline mb-1">
                            <span class="font-semibold text-surface-900 dark:text-surface-0 truncate">
                                {{ getChatName(chat) }}
                            </span>
                            <span class="text-xs text-surface-500">{{ formatTime(chat.lastMessage?.createdAt || chat.updatedAt) }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                             <p class="text-sm text-surface-600 dark:text-surface-400 truncate m-0 max-w-[180px]">
                                <span v-if="chat.lastMessage?.sender?._id === authStore.user._id">You: </span>
                                {{ getMessagePreview(chat.lastMessage) }}
                            </p>
                            <!-- <Badge value="2" severity="danger" class="ml-2"></Badge> -->
                        </div>
                    </div>
                </div>
                
                <!-- Delete Button (shows on hover) -->
                <Button 
                    icon="pi pi-trash" 
                    text 
                    rounded 
                    severity="danger" 
                    size="small"
                    class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    @click.stop="confirmDeleteChatFromList(chat)"
                    v-tooltip.left="'Delete Chat'"
                />
            </li>
        </ul>
      </div>

      <!-- Footer Actions -->
      <div class="p-3 border-t border-surface-200 dark:border-surface-700 flex justify-around">
          <Button label="New Chat" icon="pi pi-comment" class="w-full mr-2" @click="showCreateChatDialog = true" />
          <Button icon="pi pi-sparkles" severity="help" aria-label="AI Chat" @click="startAIChat" :disabled="hasAIChat" v-tooltip.top="'Start AI Chat'" />
      </div>
    </div>

    <!-- Chat Area -->
    <div class="flex-1 flex flex-col h-full bg-surface-50 dark:bg-surface-900 relative transition-all duration-300" :class="{'hidden md:flex': !selectedChatId && isMobile, 'flex': selectedChatId || !isMobile}">
        
        <!-- No Chat Selected State -->
        <div v-if="!chatStore.selectedChat" class="flex-1 flex flex-col items-center justify-center text-surface-400">
            <i class="pi pi-comments text-6xl mb-4"></i>
            <p class="text-xl">Select a chat to start messaging</p>
        </div>

        <template v-else>
            <!-- Chat Header -->
            <div class="p-3 border-b border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-800 flex justify-between items-center shadow-sm z-10">
                <div class="flex items-center gap-3">
                    <Button icon="pi pi-arrow-left" text rounded class="md:hidden" @click="clearSelection" />
                    <Avatar :label="getChatAvatarLabel(chatStore.selectedChat)" shape="circle" 
                        :style="{ 'background-color': chatStore.selectedChat.isAIChat ? 'var(--p-cyan-500)' : 'var(--p-primary-500)', color: '#ffffff' }"
                    >
                         <template #icon v-if="chatStore.selectedChat.isAIChat">
                                <i class="pi pi-sparkles"></i>
                        </template>
                    </Avatar>
                    <div class="flex flex-col">
                        <span class="font-bold text-surface-900 dark:text-surface-0">{{ getChatName(chatStore.selectedChat) }}</span>
                        <span class="text-xs text-surface-500 flex items-center gap-1">
                            <span v-if="isUserOnline" class="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                            {{ isUserOnline ? 'Online' : lastSeenFormatted }}
                        </span>
                    </div>
                </div>
                <div class="flex gap-2">
                    <Button v-if="!chatStore.selectedChat.isAIChat" icon="pi pi-phone" text rounded severity="secondary" @click="startVoiceCall" />
                    <Button icon="pi pi-ellipsis-v" text rounded severity="secondary" @click="toggleChatMenu" />
                    <Menu ref="chatMenu" :model="chatMenuItems" :popup="true" />
                </div>
            </div>

            <!-- Messages Area -->
            <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="messagesContainer">
                 <div v-if="chatStore.loading" class="flex justify-center mt-4">
                    <ProgressSpinner style="width: 40px; height: 40px" />
                </div>
                
                <template v-for="(msg, index) in chatStore.messages" :key="msg._id">
                    <!-- Date Separator (Optional - can implement logic later) -->
                    
                    <div class="flex w-full" :class="isMyMessage(msg) || msg.isAI ? 'justify-end' : 'justify-start'">
                        <div class="max-w-[85%] md:max-w-[70%] flex flex-col" :class="isMyMessage(msg) || msg.isAI ? 'items-end' : 'items-start'">
                            
                            <!-- Sender Name (Group Chat only) -->
                            <span v-if="chatStore.selectedChat.isGroupChat && !isMyMessage(msg) && !msg.isAI" class="text-xs text-surface-500 ml-1 mb-1">
                                {{ msg.sender.username }}
                            </span>

                            <!-- Message Bubble -->
                            <div class="p-3 rounded-2xl shadow-sm relative group text-sm md:text-base break-words"
                                :class="[
                                    msg.isLoading
                                        ? 'bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-900 dark:text-purple-100 rounded-tl-none animate-pulse'
                                        : msg.isAI
                                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-tr-none'
                                        : isMyMessage(msg) 
                                        ? 'bg-primary-500 text-white rounded-tr-none' 
                                        : 'bg-white dark:bg-surface-800 text-gray-900 dark:text-surface-0 border border-surface-200 dark:border-surface-700 rounded-tl-none'
                                ]"
                            >
                                <!-- Loading Indicator -->
                                <div v-if="msg.isLoading" class="flex items-center gap-2">
                                    <i class="pi pi-spin pi-spinner"></i>
                                    <span>{{ msg.content }}</span>
                                </div>
                                
                                <!-- Text Content -->
                                <div v-else-if="!msg.fileUrl" class="whitespace-pre-wrap">{{ formatAIResponse(msg.content) }}</div>

                                <!-- Media Content -->
                                <div v-else class="flex flex-col gap-2">
                                    <Image v-if="isImage(msg.fileUrl)" :src="msg.fileUrl" alt="Image" preview width="250" class="rounded-lg overflow-hidden" />
                                    <video v-else-if="isVideo(msg.fileUrl)" controls class="max-w-full rounded-lg" style="max-height: 300px;">
                                        <source :src="msg.fileUrl" type="video/mp4"/>
                                        Your browser does not support the video tag.
                                    </video>
                                    <audio v-else-if="isAudio(msg.fileUrl)" controls class="w-64" style="background: transparent;">
                                        <source :src="msg.fileUrl" type="audio/mpeg"/>
                                    </audio>
                                    <a v-else :href="msg.fileUrl" target="_blank" class="flex items-center gap-2 underline" :class="isMyMessage(msg) ? 'text-white' : 'text-primary-600'">
                                        <i class="pi pi-file"></i>
                                        <span>Download File</span>
                                    </a>
                                </div>

                                <!-- Message Meta (Time & Status) -->
                                <div v-if="!msg.isLoading" class="flex items-center justify-end gap-1 mt-1 opacity-70 text-[10px]">
                                    <span>{{ formatTime(msg.createdAt) }}</span>
                                    <i v-if="isMyMessage(msg)" class="pi" :class="msg.isRead ? 'pi-check-circle' : 'pi-check'"></i>
                                </div>

                                <!-- Context Menu Trigger (Hover) - Only for own messages -->
                                <Button 
                                    v-if="isMyMessage(msg) && !msg.isAI && !msg.isLoading"
                                    icon="pi pi-angle-down" 
                                    text rounded size="small"
                                    class="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2 bg-surface-0/50 dark:bg-surface-900/50 shadow-sm"
                                    @click="(event) => toggleMessageMenu(event, msg)"
                                    style="width: 1.5rem; height: 1.5rem; padding: 0;"
                                />
                            </div>
                        </div>
                    </div>
                </template>
                
                <!-- Typing Indicator -->
                <div v-if="typingIndicator" class="flex items-center gap-2 text-surface-500 text-sm ml-2">
                    <div class="flex gap-1">
                        <span class="w-2 h-2 bg-surface-400 rounded-full animate-bounce"></span>
                        <span class="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                        <span class="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
                    </div>
                    <span>Typing...</span>
                </div>
            </div>

            <!-- Input Area -->
            <div class="p-3 bg-surface-0 dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700">
                <!-- AI Mode Banner -->
                <div v-if="isAIMode" class="mb-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 p-2 rounded-lg text-xs flex items-center gap-2">
                    <i class="pi pi-sparkles"></i>
                    <span>AI Assistant Active - Type your message after /ai</span>
                </div>

                <!-- Upload Progress -->
                <div v-if="chatStore.mediaUploadProgress > 0" class="mb-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-xs text-blue-700 dark:text-blue-300">Uploading...</span>
                        <span class="text-xs text-blue-700 dark:text-blue-300">{{ chatStore.mediaUploadProgress }}%</span>
                    </div>
                    <div class="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1.5">
                        <div class="bg-blue-600 h-1.5 rounded-full transition-all duration-300" :style="{ width: chatStore.mediaUploadProgress + '%' }"></div>
                    </div>
                </div>

                <div class="flex items-end gap-2">
                    <Button v-if="!chatStore.selectedChat.isAIChat" icon="pi pi-plus" text rounded severity="secondary" @click="toggleUploadMenu" />
                    <Menu ref="uploadMenu" :model="uploadMenuItems" :popup="true" />
                    <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" accept="image/*,video/*,.pdf,.doc,.docx" />
                    
                    <div class="flex-1 relative">
                        <Textarea 
                            v-model="newMessage" 
                            autoResize 
                            rows="1" 
                            :placeholder="chatStore.selectedChat.isAIChat ? 'Ask AI anything...' : 'Type a message or /ai for AI help...'" 
                            class="w-full max-h-32 !py-3 !px-4 !rounded-2xl"
                            @keydown="onTyping"
                            @keydown.enter.prevent="sendMessage"
                        />
                    </div>

                    <Button v-if="!newMessage && !chatStore.selectedChat.isAIChat" 
                        :icon="recording ? 'pi pi-stop' : 'pi pi-microphone'" 
                        rounded 
                        :severity="recording ? 'danger' : 'secondary'" 
                        @click="toggleRecording"
                        :class="{'animate-pulse': recording}"
                    />
                    <Button v-else icon="pi pi-send" rounded severity="primary" @click="sendMessage" />
                </div>
            </div>
        </template>
    </div>

    <!-- Create Chat Dialog -->
    <Dialog v-model:visible="showCreateChatDialog" modal header="New Chat" :style="{ width: '25rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-4">Enter email addresses to start a chat.</span>
        <div class="flex flex-col gap-4">
            <div>
                <label for="emails" class="font-semibold w-24">Emails</label>
                <InputText id="emails" v-model="newChatEmails" class="w-full mt-1" placeholder="email@example.com, ..." />
                <small class="text-surface-500">Comma separated for multiple users</small>
            </div>
            <div class="flex items-center gap-2">
                <Checkbox v-model="isGroupChat" binary inputId="groupChat" />
                <label for="groupChat">Group Chat</label>
            </div>
            <div v-if="isGroupChat">
                <label for="groupName" class="font-semibold">Group Name</label>
                <InputText id="groupName" v-model="groupName" class="w-full mt-1" />
            </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
            <Button type="button" label="Cancel" severity="secondary" @click="showCreateChatDialog = false"></Button>
            <Button type="button" label="Create" @click="createChat" :loading="createchatloading"></Button>
        </div>
    </Dialog>

    <!-- Edit Message Dialog -->
    <Dialog v-model:visible="showEditDialog" modal header="Edit Message" :style="{ width: '25rem' }">
        <div class="flex flex-col gap-4">
            <Textarea v-model="editedContent" rows="3" autoResize class="w-full" />
        </div>
        <div class="flex justify-end gap-2 mt-6">
            <Button type="button" label="Cancel" severity="secondary" @click="showEditDialog = false"></Button>
            <Button type="button" label="Save" @click="saveEditedMessage" :loading="chatStore.messageLoading"></Button>
        </div>
    </Dialog>

    <!-- Message Context Menu -->
    <Menu ref="messageMenu" :model="messageMenuItems" :popup="true" />

    <!-- Incoming Call Dialog -->
    <Dialog v-model:visible="showIncomingCallDialog" modal :closable="false" :style="{ width: '20rem' }" class="text-center">
        <template #header>
            <div class="w-full flex justify-center">
                 <Avatar icon="pi pi-phone" size="xlarge" shape="circle" class="bg-primary-100 text-primary-600" />
            </div>
        </template>
        <div class="flex flex-col items-center mb-6">
            <h3 class="m-0 text-xl font-bold">Incoming Call</h3>
            <p class="text-surface-500 m-0">{{ incomingCall?.callerName || 'Unknown' }}</p>
        </div>
        <div class="flex justify-center gap-4">
            <Button icon="pi pi-times" rounded severity="danger" size="large" @click="declineCall" />
            <Button icon="pi pi-check" rounded severity="success" size="large" @click="acceptCall" />
        </div>
    </Dialog>

    <!-- Active Call Overlay -->
    <div v-if="chatStore.callActive" class="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-surface-900 text-white p-4 rounded-xl shadow-xl flex items-center gap-4 transition-all duration-300">
        <div class="flex flex-col">
            <span class="font-bold text-sm">In Call</span>
            <span class="text-xs opacity-80">{{ formatDuration(chatStore.callDuration) }}</span>
        </div>
        <Button icon="pi pi-phone-off" rounded severity="danger" @click="hangUpVoiceCall" />
        <audio ref="remoteAudio" autoplay class="hidden"></audio>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useChatStore } from '../stores/chat';
import { useAuthStore } from '../stores/auth';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

// PrimeVue Components
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Avatar from 'primevue/avatar';
import Menu from 'primevue/menu';
import Dialog from 'primevue/dialog';
import Badge from 'primevue/badge';
import Checkbox from 'primevue/checkbox';
import ProgressSpinner from 'primevue/progressspinner';
import Image from 'primevue/image';

const chatStore = useChatStore();
const authStore = useAuthStore();
const toast = useToast();
const confirm = useConfirm();

// State
const showCreateChatDialog = ref(false);
const newChatEmails = ref('');
const isGroupChat = ref(false);
const groupName = ref('');
const createchatloading = ref(false);

const newMessage = ref('');
const messagesContainer = ref(null);
const fileInput = ref(null);

const showEditDialog = ref(false);
const editedContent = ref('');
const editingMsgId = ref(null);

const settingsMenu = ref(null);
const chatMenu = ref(null);
const messageMenu = ref(null);
const uploadMenu = ref(null);
const selectedMessage = ref(null);

const isMobile = ref(window.innerWidth < 768);
const selectedChatId = computed(() => chatStore.selectedChat?._id);

// Recording
const recording = ref(false);
const recordingInterval = ref(null);

// Call
const remoteAudio = ref(null);
const showIncomingCallDialog = computed(() => !!incomingCall.value);
const incomingCall = ref(null);

// Upload Menu Items
const uploadMenuItems = ref([
    { 
        label: 'Upload Image', 
        icon: 'pi pi-image', 
        command: () => triggerFileUpload('image/*') 
    },
    { 
        label: 'Upload Document', 
        icon: 'pi pi-file', 
        command: () => triggerFileUpload('.pdf,.doc,.docx,.txt') 
    },
    { 
        label: 'Upload Video', 
        icon: 'pi pi-video', 
        command: () => triggerFileUpload('video/*') 
    }
]);

// Computed
const sortedChats = computed(() => {
    return (chatStore.chats || []).slice().sort((a, b) => {
        const aTime = new Date(a.lastMessage?.createdAt || a.updatedAt || a.createdAt);
        const bTime = new Date(b.lastMessage?.createdAt || b.updatedAt || b.createdAt);
        return bTime - aTime;
    });
});

const isUserOnline = computed(() => {
    if (!chatStore.selectedChat) return false;
    if (chatStore.selectedChat.isGroupChat) return false; // Simplified for group
    const other = chatStore.selectedChat.participants.find(p => p._id !== authStore.user?._id);
    return other && chatStore.onlineUsers.includes(other._id);
});

const lastSeenFormatted = computed(() => {
     if (!chatStore.selectedChat) return '';
     const other = chatStore.selectedChat.participants.find(p => p._id !== authStore.user?._id);
     if (!other) return '';
     // Note: Real last seen logic would need backend support or socket event updates stored in map
     return 'Offline'; 
});

const typingIndicator = computed(() => {
    if (!chatStore.selectedChat) return false;
    // Check if any user in current chat is typing (excluding self)
    // This requires typingUsers to be a map of userId -> chatId or similar.
    // Assuming chatStore.typingUsers is { userId: true } and we check if that user is in chat.
    // A better structure in store would be typingUsers: { chatId: [userIds] }
    // For now, using existing store logic:
    return Object.keys(chatStore.typingUsers).some(userId => {
        // Check if this user is in the current chat
        return chatStore.selectedChat.participants.some(p => p._id === userId) && userId !== authStore.user._id;
    });
});

const hasAIChat = computed(() => {
    return (chatStore.chats || []).some(c => c.isAIChat);
});

const isAIMode = computed(() => {
    return newMessage.value.toLowerCase().startsWith('/ai');
});

// Menu Items
const settingsItems = ref([
    { label: 'Sound', icon: 'pi pi-volume-up', command: () => chatStore.toggleSound() },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => authStore.logout() }
]);

const chatMenuItems = computed(() => [
    { label: 'Clear Chat', icon: 'pi pi-trash', command: () => confirmClearChat() },
    { label: 'Delete Chat', icon: 'pi pi-times', class: 'text-red-500', command: () => confirmDeleteChat() }
]);

const messageMenuItems = computed(() => [
    { 
        label: 'Edit', 
        icon: 'pi pi-pencil', 
        visible: selectedMessage.value?.sender?._id === authStore.user?._id && !selectedMessage.value?.fileUrl,
        command: () => openEditDialog(selectedMessage.value)
    },
    { 
        label: 'Delete', 
        icon: 'pi pi-trash', 
        class: 'text-red-500',
        visible: selectedMessage.value?.sender?._id === authStore.user?._id,
        command: () => confirmDeleteMessage(selectedMessage.value)
    }
]);

// Methods
const getChatName = (chat) => {
    if (chat.isAIChat) return 'AI Assistant';
    if (chat.isGroupChat) return chat.name || 'Group Chat';
    const other = chat.participants.find(p => p._id !== authStore.user?._id);
    return other?.username || other?.email || 'Unknown';
};

const getChatAvatarLabel = (chat) => {
    if (chat.isAIChat) return 'AI';
    const name = getChatName(chat);
    return name.substring(0, 2).toUpperCase();
};

const getOnlineStatus = (chat) => {
    if (chat.isGroupChat || chat.isAIChat) return false;
    const other = chat.participants.find(p => p._id !== authStore.user?._id);
    return other && chatStore.onlineUsers.includes(other._id);
};

const getMessagePreview = (msg) => {
    if (!msg) return 'No messages yet';
    if (msg.fileUrl) return isImage(msg.fileUrl) ? '📷 Image' : '📎 Attachment';
    return msg.content;
};

const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const isMyMessage = (msg) => msg.sender._id === authStore.user?._id;

const isImage = (url) => /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);
const isAudio = (url) => /\.(mp3|wav|ogg|m4a)$/i.test(url);

const formatAIResponse = (text) => {
    // Basic cleanup if needed
    return text;
};

// Actions
const onSelectChat = async (chat) => {
    await chatStore.selectChat(chat);
    scrollToBottom();
};

const clearSelection = () => {
    chatStore.selectedChat = null;
};

const scrollToBottom = async () => {
    await nextTick();
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
};

const toggleSettingsMenu = (event) => settingsMenu.value.toggle(event);
const toggleChatMenu = (event) => chatMenu.value.toggle(event);
const toggleMessageMenu = (event, msg) => {
    selectedMessage.value = msg;
    messageMenu.value.toggle(event);
};

const createChat = async () => {
    if (!newChatEmails.value) return;
    createchatloading.value = true;
    try {
        const emails = newChatEmails.value.split(',').map(e => e.trim()).filter(e => e);
        // Add self if not included (backend might handle this, but safe to check)
        if (!emails.includes(authStore.user.email)) emails.push(authStore.user.email);
        
        const newChat = await chatStore.createChat(emails, isGroupChat.value, groupName.value);
        
        // Auto-select the newly created chat
        if (newChat) {
            await onSelectChat(newChat);
        }
        
        showCreateChatDialog.value = false;
        newChatEmails.value = '';
        groupName.value = '';
        isGroupChat.value = false;
    } catch (e) {
        // Error handled in store/toast
    } finally {
        createchatloading.value = false;
    }
};

const startAIChat = async () => {
    try {
        const chat = await chatStore.createAIChat();
        if (chat) await onSelectChat(chat);
    } catch (e) {
        // Handled
    }
};

let typingTimeout = null;
const onTyping = () => {
    chatStore.startTyping();
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => chatStore.stopTyping(), 2000);
};

const sendMessage = async () => {
    if (!newMessage.value.trim()) return;
    const content = newMessage.value;
    newMessage.value = ''; // Optimistic clear
    
    try {
        await chatStore.sendMessage(content);
        scrollToBottom();
    } catch (e) {
        newMessage.value = content; // Restore on fail
    }
};

const toggleUploadMenu = (event) => uploadMenu.value.toggle(event);

const triggerFileUpload = (accept = 'image/*,video/*,.pdf,.doc,.docx') => {
    if (fileInput.value) {
        fileInput.value.setAttribute('accept', accept);
        fileInput.value.click();
    }
};

const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
        await chatStore.sendMediaMessage(file);
        scrollToBottom();
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Upload Failed', detail: 'Could not send file', life: 3000 });
    }
    event.target.value = ''; // Reset
};

const toggleRecording = async () => {
    if (recording.value) {
        // Stop
        chatStore.stopAudioRecording();
        clearInterval(recordingInterval.value);
        recording.value = false;
    } else {
        // Start
        recording.value = true;
        await chatStore.startAudioRecording();
        recordingInterval.value = setInterval(() => {
            // Update duration UI if needed
        }, 1000);
    }
};

// Edit/Delete
const openEditDialog = (msg) => {
    editingMsgId.value = msg._id;
    editedContent.value = msg.content;
    showEditDialog.value = true;
};

const saveEditedMessage = async () => {
    try {
        await chatStore.editMessage(editingMsgId.value, editedContent.value);
        showEditDialog.value = false;
    } catch (e) {
        // Handled
    }
};

const confirmDeleteMessage = (msg) => {
    confirm.require({
        message: 'Are you sure you want to delete this message?',
        header: 'Delete Message',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: () => chatStore.deleteMessage(msg._id)
    });
};

const confirmDeleteChat = () => {
    confirm.require({
        message: 'Are you sure you want to delete this chat?',
        header: 'Delete Chat',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: async () => {
            await chatStore.deleteChat(chatStore.selectedChat._id);
            chatStore.selectedChat = null;
        }
    });
};

const confirmDeleteChatFromList = (chat) => {
    confirm.require({
        message: `Are you sure you want to delete "${getChatName(chat)}"?`,
        header: 'Delete Chat',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: async () => {
            await chatStore.deleteChat(chat._id);
            // Clear selection if deleted chat was selected
            if (chatStore.selectedChat?._id === chat._id) {
                chatStore.selectedChat = null;
            }
        }
    });
};

const confirmClearChat = () => {
    toast.add({ severity: 'info', summary: 'Info', detail: 'Clear chat not implemented yet', life: 3000 });
};

// Calls
const startVoiceCall = () => {
    chatStore.startVoiceCall();
};

const hangUpVoiceCall = () => {
    chatStore.hangUpVoiceCall();
};

const acceptCall = () => {
    if (incomingCall.value) {
        chatStore.answerVoiceCall(incomingCall.value); // You might need to adjust store to accept the offer data
        incomingCall.value = null;
    }
};

const declineCall = () => {
    incomingCall.value = null;
    // Emit decline event if needed
};

// Lifecycle
onMounted(() => {
    if (!authStore.user) {
        const stored = localStorage.getItem('user');
        if (stored) authStore.user = JSON.parse(stored);
    }
    
    chatStore.fetchUserChats();
    
    if (authStore.user?._id) {
        chatStore.connectSocket(authStore.user._id);
        
        // Listeners
        chatStore.socket.on('incomingVoiceCall', (data) => {
            incomingCall.value = data;
        });
    }

    window.addEventListener('resize', () => {
        isMobile.value = window.innerWidth < 768;
    });
});

onUnmounted(() => {
    // Cleanup
});

// Watchers
watch(() => chatStore.messages, () => scrollToBottom(), { deep: true });
watch(() => chatStore.remoteStream, (stream) => {
    if (stream && remoteAudio.value) {
        remoteAudio.value.srcObject = stream;
    }
});

</script>

<style scoped>
/* Custom Scrollbar for chat area */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
