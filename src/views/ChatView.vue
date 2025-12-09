<template>
  <div class="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-white selection:bg-indigo-500 selection:text-white">
    
    <!-- LEFT SIDEBAR (Chat List) -->
    <div class="w-full md:w-80 lg:w-[22rem] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shrink-0 transition-transform duration-300 md:translate-x-0 z-20 absolute md:relative"
         :class="{'translate-x-0': !selectedChatId || !isMobile, '-translate-x-full': selectedChatId && isMobile}">
      
      <!-- User Profile / Branding Header -->
      <div class="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div class="flex items-center gap-3">
           <div class="relative">
               <Avatar :image="authStore.user?.avatar || null" :label="authStore.user?.username?.substring(0,1).toUpperCase()" size="large" shape="circle" class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/20" />
               <span class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
           </div>
           <div class="flex flex-col">
               <span class="font-bold text-slate-800 dark:text-white leading-tight mb-0.5">{{ authStore.user?.username || 'User' }}</span>
               <span class="text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full w-fit">Free Plan</span>
           </div>
        </div>
        <div class="flex gap-1">
             <Button icon="pi pi-cog" text rounded severity="secondary" @click="toggleSettingsMenu" class="hover:bg-slate-100 dark:hover:bg-slate-800 !w-9 !h-9 text-slate-500" />
             <Menu ref="settingsMenu" :model="settingsItems" :popup="true" />
        </div>
      </div>

      <!-- Search Bar -->
      <div class="px-5 py-3">
          <div class="relative group">
              <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
              <InputText v-model="searchQuery" placeholder="Search messages..." class="w-full !pl-10 !bg-slate-50 dark:!bg-slate-950 !border-slate-200 dark:!border-slate-800 focus:!border-indigo-500 !rounded-xl !py-2.5 transition-all text-sm" />
          </div>
      </div>

      <!-- Chat Categories / Tabs (Optional, visual only for now) -->
      <div class="px-5 pb-2 flex gap-4 overflow-x-auto no-scrollbar">
          <button class="text-sm font-semibold text-slate-900 dark:text-white border-b-2 border-indigo-500 pb-1 whitespace-nowrap">All Chats</button>
          <button class="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 pb-1 whitespace-nowrap transition-colors">Groups</button>
          <button class="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 pb-1 whitespace-nowrap transition-colors">Archived</button>
      </div>

      <!-- Chat List Items -->
      <div class="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1 pb-4">
        <div v-if="chatStore.loading" class="flex justify-center p-8">
            <ProgressSpinner style="width: 30px; height: 30px" strokeWidth="4" />
        </div>
        
        <div v-else-if="sortedChats.length === 0" class="flex flex-col items-center justify-center h-48 text-center text-slate-500 dark:text-slate-400">
            <i class="pi pi-comments text-4xl mb-3 opacity-20"></i>
            <p class="text-sm">No conversations yet.</p>
            <Button label="Start Chat" text size="small" class="mt-2 text-indigo-600" @click="showCreateChatDialog = true" />
        </div>

        <template v-else>
            <div v-for="chat in sortedChats" :key="chat._id" 
                class="group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent"
                :class="chatStore.selectedChat?._id === chat._id 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/50 shadow-sm' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'"
                @click="onSelectChat(chat)"
            >
                <!-- Avatar -->
                <div class="relative shrink-0">
                    <Avatar :label="getChatAvatarLabel(chat)" shape="circle" size="large" 
                        class="font-bold text-white shadow-sm"
                        :style="{ 'background': chat.isAIChat ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)' }"
                    >
                        <template #icon v-if="chat.isAIChat"><i class="pi pi-sparkles text-lg"></i></template>
                    </Avatar>
                    <span v-if="getOnlineStatus(chat)" class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0 flex flex-col gap-0.5">
                    <div class="flex justify-between items-baseline">
                        <span class="font-semibold text-sm truncate" :class="chatStore.selectedChat?._id === chat._id ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-slate-100'">
                            {{ getChatName(chat) }}
                        </span>
                        <span class="text-[10px] font-medium opacity-60 shrink-0">{{ formatTime(chat.lastMessage?.createdAt || chat.updatedAt) }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                         <p class="text-xs truncate max-w-[160px]" :class="chatStore.selectedChat?._id === chat._id ? 'text-indigo-700/80 dark:text-indigo-200/60' : 'text-slate-500 dark:text-slate-400'">
                             <span v-if="chat.lastMessage?.isAI" class="text-cyan-600 dark:text-cyan-400 mr-1"><i class="pi pi-sparkles text-[10px]"></i> AI:</span>
                             <span v-else-if="chat.lastMessage?.sender?._id === authStore.user._id" class="font-semibold">You:</span>
                             {{ getMessagePreview(chat.lastMessage) }}
                        </p>
                        <!-- Unread Badge (Mockup) -->
                        <Badge v-if="false" value="2" severity="danger" class="!min-w-[1.2rem] !h-[1.2rem] !line-height-[1.2rem] text-[10px]"></Badge>
                    </div>
                </div>
            </div>
        </template>
      </div>

      <!-- New Chat FAB -->
      <div class="p-4 absolute bottom-0 right-0 md:relative bg-gradient-to-t from-white via-white to-transparent dark:from-slate-900 dark:via-slate-900 pointer-events-none md:pointer-events-auto w-full flex justify-end md:justify-center">
         <Button icon="pi pi-plus" label="New Chat" rounded class="!px-6 !py-3 !shadow-indigo-500/30 !shadow-lg pointer-events-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 transition-transform font-bold" @click="showCreateChatDialog = true" />
      </div>
    </div>


    <!-- MIDDLE: CHAT AREA -->
    <div class="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/50 relative transition-transform duration-300 z-10"
         :class="{'translate-x-0': selectedChatId || !isMobile, 'translate-x-full md:translate-x-0': !selectedChatId && isMobile}">
        
        <!-- Background Elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]"></div>
            <div class="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px]"></div>
        </div>

        <!-- Empty State -->
        <div v-if="!chatStore.selectedChat" class="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
            <div class="w-32 h-32 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-indigo-100 dark:shadow-none animate-float">
                <i class="pi pi-comments text-5xl text-indigo-500"></i>
            </div>
            <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">Welcome, {{ authStore.user?.username }}!</h2>
            <p class="text-slate-500 dark:text-slate-400 max-w-md text-lg">Select a conversation from the sidebar or start a new one to begin messaging.</p>
            <div class="mt-8 flex gap-4">
                <Button label="New Chat" icon="pi pi-plus" class="p-button-rounded" @click="showCreateChatDialog = true" />
                <Button label="AI Assistant" icon="pi pi-sparkles" severity="secondary" outlined class="p-button-rounded" @click="startAIChat" />
            </div>
        </div>

        <template v-else>
            <!-- Chat Header -->
            <div class="h-20 px-6 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex justify-between items-center z-20 sticky top-0 shadow-sm">
                <div class="flex items-center gap-4">
                    <Button icon="pi pi-arrow-left" text rounded class="md:hidden -ml-3 text-slate-500" @click="clearSelection" />
                    
                    <Avatar :label="getChatAvatarLabel(chatStore.selectedChat)" shape="circle" size="large"
                        class="shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                        :style="{ 'background': chatStore.selectedChat.isAIChat ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#ffffff' }"
                        @click="showRightSidebar = !showRightSidebar"
                    >
                         <template #icon v-if="chatStore.selectedChat.isAIChat"><i class="pi pi-sparkles"></i></template>
                    </Avatar>
                    
                    <div class="flex flex-col cursor-pointer" @click="showRightSidebar = !showRightSidebar">
                        <span class="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                            {{ getChatName(chatStore.selectedChat) }}
                            <i v-if="chatStore.selectedChat.isAIChat" class="pi pi-verified text-cyan-500 text-sm" v-tooltip="'AI Assistant'"></i>
                        </span>
                        <div class="flex items-center gap-2 text-xs font-medium">
                            <span v-if="typingIndicator" class="text-indigo-500 animate-pulse font-bold">Typing...</span>
                            <span v-else class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                <span v-if="!chatStore.selectedChat.isAIChat" class="w-2 h-2 rounded-full" :class="isUserOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-300 dark:bg-slate-600'"></span>
                                {{ chatStore.selectedChat.isAIChat ? 'Always Active' : (isUserOnline ? 'Online' : 'Offline') }}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="flex items-center gap-2">
                     <template v-if="!chatStore.selectedChat.isAIChat">
                        <Button icon="pi pi-phone" rounded text severity="secondary" @click="startVoiceCall" class="!w-10 !h-10 hover:bg-slate-100 dark:hover:bg-slate-800" v-tooltip.bottom="'Voice Call'" />
                        <Button icon="pi pi-video" rounded text severity="secondary" class="!w-10 !h-10 hover:bg-slate-100 dark:hover:bg-slate-800 hidden sm:inline-flex" v-tooltip.bottom="'Video Call (Soon)'" disabled />
                     </template>
                     <div class="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
                     <Button icon="pi pi-info-circle" rounded text severity="secondary" @click="showRightSidebar = !showRightSidebar" class="!w-10 !h-10 hover:bg-slate-100 dark:hover:bg-slate-800" :class="{'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30': showRightSidebar}" v-tooltip.bottom="'Chat Info'" />
                    <Button icon="pi pi-ellipsis-v" rounded text severity="secondary" @click="toggleChatMenu" class="!w-10 !h-10 hover:bg-slate-100 dark:hover:bg-slate-800" />
                    <Menu ref="chatMenu" :model="chatMenuItems" :popup="true" />
                </div>
            </div>

            <!-- Messages Area -->
            <div class="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar z-10 scroll-smooth relative" ref="messagesContainer">
                 <div v-if="chatStore.loading" class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-50">
                    <ProgressSpinner />
                </div>
                
                <!-- Date divider example -->
                <div class="flex justify-center my-4">
                    <span class="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
                </div>

                <div v-if="!chatStore.loading && chatStore.messages.length === 0" class="flex flex-col items-center justify-center h-full opacity-60">
                     <i class="pi pi-comment text-4xl mb-4 text-slate-300 dark:text-slate-700"></i>
                     <p class="text-slate-500">No messages yet. Say hello! 👋</p>
                </div>

                <template v-for="(msg, index) in chatStore.messages" :key="msg._id">
                    <div class="flex w-full group animate-message-slide-in" :class="isMyMessage(msg) || msg.isAI ? 'justify-end' : 'justify-start'">
                        
                        <!-- Partner Avatar (Left) -->
                        <Avatar v-if="!isMyMessage(msg) && !msg.isAI" 
                                :label="msg.sender.username?.substring(0,1).toUpperCase()" 
                                shape="circle" size="normal" 
                                class="mr-3 mt-auto shadow-sm bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-white font-bold hidden sm:flex"
                        />
                        <!-- AI Avatar (Left) -->
                         <Avatar v-if="msg.isAI" 
                                icon="pi pi-sparkles" 
                                shape="circle" size="normal" 
                                class="mr-3 mt-auto shadow-lg bg-gradient-to-br from-cyan-400 to-blue-500 text-white hidden sm:flex"
                        />


                        <div class="max-w-[85%] md:max-w-[65%] flex flex-col" :class="isMyMessage(msg) || msg.isAI ? 'items-end' : 'items-start'">
                            <!-- Sender Name (Group) -->
                            <span v-if="chatStore.selectedChat.isGroupChat && !isMyMessage(msg) && !msg.isAI" class="text-[10px] text-slate-500 ml-1 mb-1 font-bold uppercase tracking-wide">
                                {{ msg.sender.username }}
                            </span>

                            <!-- Message Bubble -->
                            <div class="px-5 py-3.5 rounded-2xl shadow-sm relative text-sm md:text-[15px] leading-relaxed break-words border transition-all duration-200"
                                :class="[
                                    msg.isLoading
                                        ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-bl-none animate-pulse'
                                        : msg.isAI
                                        ? 'bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none shadow'
                                        : isMyMessage(msg) 
                                        ? 'bg-indigo-600 text-white border-transparent rounded-br-none shadow-indigo-500/20 shadow-md' 
                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-bl-none hover:shadow-md'
                                ]"
                            >
                                <!-- Loading State -->
                                <div v-if="msg.isLoading" class="flex items-center gap-3">
                                    <i class="pi pi-spin pi-spinner text-indigo-500"></i>
                                    <span>AI is thinking...</span>
                                </div>
                                
                                <!-- Text Content -->
                                <div v-else-if="!msg.fileUrl" class="whitespace-pre-wrap">{{ formatAIResponse(msg.content) }}</div>

                                <!-- Media Content -->
                                <div v-else class="flex flex-col gap-2">
                                    <Image v-if="isImage(msg.fileUrl)" :src="msg.fileUrl" alt="Image" preview width="250" class="rounded-lg overflow-hidden border border-white/20 shadow-sm" />
                                    <!-- Video/Audio renders same as before... -->
                                    <a v-if="!isImage(msg.fileUrl) && !isVideo(msg.fileUrl) && !isAudio(msg.fileUrl)" :href="msg.fileUrl" target="_blank" class="flex items-center gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors">
                                        <div class="w-10 h-10 rounded-lg bg-white/50 flex items-center justify-center">
                                            <i class="pi pi-file text-xl"></i>
                                        </div>
                                        <div class="flex flex-col">
                                            <span class="font-bold text-xs" :class="isMyMessage(msg)?'text-white':'text-slate-800 dark:text-white'">Download File</span>
                                            <span class="text-[10px] opacity-70">Click to open</span>
                                        </div>
                                    </a>
                                </div>

                                <!-- Message Meta -->
                                <div v-if="!msg.isLoading" class="flex items-center justify-end gap-1 mt-1 opacity-70 text-[10px] font-medium select-none" :class="isMyMessage(msg) ? 'text-indigo-100' : 'text-slate-400'">
                                    <span>{{ formatTime(msg.createdAt) }}</span>
                                    <i v-if="isMyMessage(msg)" class="pi text-[10px]" :class="msg.isRead ? 'pi-check-circle' : 'pi-check'"></i>
                                </div>

                                <!-- Context Menu Trigger -->
                                <button 
                                    v-if="isMyMessage(msg) && !msg.isAI && !msg.isLoading"
                                    class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-slate-700 shadow-md text-slate-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:text-indigo-600 hover:scale-110 z-10"
                                    @click="(event) => toggleMessageMenu(event, msg)"
                                >
                                    <i class="pi pi-angle-down text-xs"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </template>
                
                <!-- Typing Indicator Bubble -->
                <div v-if="typingIndicator" class="flex w-full justify-start animate-fade-in">
                    <Avatar icon="pi pi-ellipsis-h" shape="circle" size="normal" class="mr-3 mt-auto bg-slate-200 dark:bg-slate-800 text-slate-500 animate-pulse hidden sm:flex" />
                    <div class="px-4 py-3 rounded-2xl rounded-bl-none bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm italic flex items-center gap-2">
                        <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                        <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                        <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                </div>
            </div>

            <!-- Input Area -->
            <div class="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-20 sticky bottom-0">
                <!-- AI Active Banner -->
                 <transition enter-active-class="transition ease-out duration-300" enter-from-class="transform translate-y-4 opacity-0" enter-to-class="transform translate-y-0 opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="transform translate-y-0 opacity-100" leave-to-class="transform translate-y-4 opacity-0">
                    <div v-if="isAIMode" class="absolute -top-12 left-6 right-6 mx-auto max-w-lg bg-cyan-50 dark:bg-cyan-900/40 backdrop-blur-md border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
                        <i class="pi pi-sparkles text-cyan-500 animate-spin-slow"></i>
                        <span>AI Mode Active - Drafting response...</span>
                    </div>
                </transition>

                <div class="max-w-4xl mx-auto flex items-end gap-3 bg-slate-50 dark:bg-slate-950 p-2 rounded-[28px] border border-slate-200 dark:border-slate-800 focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-300 shadow-sm hover:shadow-md">
                    
                    <Button v-if="!chatStore.selectedChat.isAIChat" icon="pi pi-plus" text rounded class="!w-10 !h-10 !flex-shrink-0 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors" @click="toggleUploadMenu" v-tooltip.top="'Add Attachment'" />
                    <Menu ref="uploadMenu" :model="uploadMenuItems" :popup="true" />
                    <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" accept="image/*,video/*,.pdf,.doc,.docx" />
                    
                    <div class="flex-1 relative py-2">
                        <Textarea 
                            v-model="newMessage" 
                            autoResize 
                            rows="1" 
                            :placeholder="chatStore.selectedChat.isAIChat ? 'Ask AI anything...' : 'Type a message...'" 
                            class="w-full !bg-transparent !border-0 !shadow-none !p-0 !text-slate-800 dark:!text-slate-100 placeholder:!text-slate-400 focus:!ring-0 !resize-none text-[15px] max-h-32 overflow-y-auto"
                            @keydown="onTyping"
                            @keydown.enter.prevent="sendMessage"
                        />
                    </div>

                    <div class="flex items-center gap-1 pr-1">
                        <Button v-if="!newMessage && !chatStore.selectedChat.isAIChat" 
                            :icon="recording ? 'pi pi-stop' : 'pi pi-microphone'" 
                            rounded 
                            text
                            class="!w-10 !h-10 !flex-shrink-0"
                            :class="recording ? 'bg-red-50 text-red-500 animate-pulse' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'"
                            @click="toggleRecording"
                            v-tooltip.top="'Voice Message'"
                        />
                        <Button icon="pi pi-send" rounded class="!w-10 !h-10 !flex-shrink-0 bg-indigo-600 border-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/30 text-white" @click="sendMessage" />
                    </div>
                </div>
                <div class="text-center mt-2">
                     <small class="text-[10px] text-slate-400">Press <kbd class="font-sans px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">Enter</kbd> to send</small>
                </div>
            </div>
        </template>
    </div>

    <!-- RIGHT SIDEBAR (Info Panel) -->
    <transition enter-active-class="transition transform duration-300 ease-in-out" enter-from-class="translate-x-full" enter-to-class="translate-x-0" leave-active-class="transition transform duration-300 ease-in-out" leave-from-class="translate-x-0" leave-to-class="translate-x-full">
        <div v-if="showRightSidebar && chatStore.selectedChat" class="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shrink-0 z-30 absolute right-0 shadow-2xl md:relative md:shadow-none">
            <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h3 class="font-bold text-lg text-slate-800 dark:text-white">Details</h3>
                <Button icon="pi pi-times" text rounded severity="secondary" @click="showRightSidebar = false" />
            </div>
            
            <div class="p-6 flex flex-col items-center">
                 <Avatar :label="getChatAvatarLabel(chatStore.selectedChat)" shape="circle" size="xlarge" 
                    class="font-bold text-white shadow-xl mb-4 w-24 h-24 text-3xl"
                    :style="{ 'background': chatStore.selectedChat.isAIChat ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)' }"
                />
                <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-1">{{ getChatName(chatStore.selectedChat) }}</h2>
                <span class="text-sm text-slate-500">{{ chatStore.selectedChat.isAIChat ? 'Artificial Intelligence' : 'User' }}</span>
                
                <div class="flex gap-4 mt-6 w-full">
                    <div class="flex-1 flex flex-col items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group">
                        <div class="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm mb-2 group-hover:text-indigo-500">
                             <i class="pi pi-bell"></i>
                        </div>
                        <span class="text-xs font-medium">Mute</span>
                    </div>
                     <div class="flex-1 flex flex-col items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group">
                        <div class="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm mb-2 group-hover:text-indigo-500">
                             <i class="pi pi-search"></i>
                        </div>
                        <span class="text-xs font-medium">Search</span>
                    </div>
                     <div class="flex-1 flex flex-col items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group">
                        <div class="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm mb-2 group-hover:text-indigo-500">
                             <i class="pi pi-image"></i>
                        </div>
                        <span class="text-xs font-medium">Media</span>
                    </div>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto px-6 pb-6">
                <div class="mb-6">
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Shared Files</h4>
                    <div class="text-sm text-slate-500 italic">No shared files yet.</div>
                </div>

                <div class="mb-6">
                     <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Settings</h4> 
                     <div class="flex items-center justify-between py-2">
                        <span class="text-sm font-medium">Block User</span>
                        <Button icon="pi pi-ban" text rounded severity="danger" size="small" />
                     </div>
                     <div class="flex items-center justify-between py-2">
                        <span class="text-sm font-medium">Report</span>
                        <Button icon="pi pi-flag" text rounded severity="warning" size="small" />
                     </div>
                </div>
            </div>
            
            <div class="p-6 border-t border-slate-100 dark:border-slate-800">
                <Button label="Delete Chat" severity="danger" outlined class="w-full" icon="pi pi-trash" @click="confirmDeleteChat" />
            </div>
        </div>
    </transition>

    <!-- ... (Dialogs remain mostly same, just styled) ... -->
    <!-- Create Chat Dialog -->
    <Dialog v-model:visible="showCreateChatDialog" modal header="Start New Conversation" :style="{ width: '28rem' }" :pt="{ root: { class: 'dark:bg-slate-900 dark:text-white' } }">
        <span class="text-slate-500 block mb-6 text-sm">Enter email addresses to start a chat.</span>
        <div class="flex flex-col gap-5">
            <div>
                <label for="emails" class="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2 block">Email Addresses</label>
                <div class="relative">
                     <i class="pi pi-at absolute left-3 top-3 text-slate-400 z-10"></i>
                     <InputText id="emails" v-model="newChatEmails" class="w-full !pl-10 !rounded-lg border-slate-300" placeholder="john@example.com" />
                </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <Checkbox v-model="isGroupChat" binary inputId="groupChat" />
                <label for="groupChat" class="text-sm font-medium cursor-pointer flex-1">Create a Group Chat</label>
            </div>
            <div v-if="isGroupChat" class="animate-fade-in">
                <label for="groupName" class="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2 block">Group Name</label>
                <InputText id="groupName" v-model="groupName" class="w-full !rounded-lg" placeholder="e.g. Project Team" />
            </div>
        </div>
        <div class="flex justify-end gap-3 mt-8">
            <Button type="button" label="Cancel" severity="secondary" text @click="showCreateChatDialog = false" class="!rounded-lg"></Button>
            <Button type="button" label="Create Chat" icon="pi pi-check" @click="createChat" :loading="createchatloading" class="!rounded-lg bg-indigo-600 border-indigo-600 hover:bg-indigo-700"></Button>
        </div>
    </Dialog>

     <!-- Edit Message Dialog -->
    <Dialog v-model:visible="showEditDialog" modal header="Edit Message" :style="{ width: '25rem' }">
        <Textarea v-model="editedContent" rows="4" autoResize class="w-full !rounded-xl" />
        <div class="flex justify-end gap-2 mt-6">
            <Button type="button" label="Cancel" severity="secondary" @click="showEditDialog = false"></Button>
            <Button type="button" label="Save" @click="saveEditedMessage" class="bg-indigo-600 border-indigo-600"></Button>
        </div>
    </Dialog>

    <!-- Incoming Call Dialog -->
    <Dialog v-model:visible="showIncomingCallDialog" modal :closable="false" :style="{ width: '22rem' }" :pt="{ root: { class: '!rounded-3xl overflow-hidden' }, header: { class: 'hidden' }, content: { class: '!p-0' } }">
        <div class="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white text-center relative overflow-hidden">
             <div class="absolute inset-0 flex items-center justify-center opacity-30">
                 <div class="w-64 h-64 border-2 border-white rounded-full animate-ping-slow"></div>
             </div>
             <Avatar icon="pi pi-phone" size="xlarge" shape="circle" class="!bg-white !text-indigo-600 mb-4 shadow-xl !w-20 !h-20 !text-3xl relative z-10" />
             <h3 class="text-2xl font-bold relative z-10">Incoming Call</h3>
             <p class="text-indigo-100 relative z-10">{{ incomingCall?.callerName || 'Unknown Caller' }}</p>
        </div>
        <div class="p-6 bg-white dark:bg-slate-900 flex justify-center gap-8">
            <Button icon="pi pi-times" rounded severity="danger" size="large" class="!w-16 !h-16 !shadow-lg hover:scale-110 transition-transform" @click="declineCall" />
            <Button icon="pi pi-check" rounded severity="success" size="large" class="!w-16 !h-16 !shadow-lg hover:scale-110 transition-transform animate-pulse" @click="acceptCall" />
        </div>
    </Dialog>

     <!-- Active Call Overlay -->
    <transition enter-active-class="transition ease-out duration-300" enter-from-class="transform -translate-y-full" enter-to-class="transform translate-y-0" leave-active-class="transition ease-in duration-200" leave-from-class="transform translate-y-0" leave-to-class="transform -translate-y-full">
        <div v-if="chatStore.callActive" class="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 border border-slate-700">
            <div class="flex items-center gap-3">
                <span class="relative flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <div>
                     <span class="font-bold text-sm block">00:{{ formatDuration(chatStore.callDuration).split(':')[1] }}</span> <!-- Simplified timer display logic for now -->
                     <span class="text-[10px] opacity-60 uppercase tracking-widest">Live</span>
                </div>
            </div>
            <div class="h-8 w-[1px] bg-white/20"></div>
            <Button icon="pi pi-phone-off" rounded severity="danger" class="!w-10 !h-10 hover:bg-red-600" @click="hangUpVoiceCall" />
            <audio ref="remoteAudio" autoplay class="hidden"></audio>
        </div>
    </transition>

     <!-- Context Menus -->
    <Menu ref="settingsMenu" :model="settingsItems" :popup="true" />
    <Menu ref="chatMenu" :model="chatMenuItems" :popup="true" />
    <Menu ref="messageMenu" :model="messageMenuItems" :popup="true" />
    <Menu ref="uploadMenu" :model="uploadMenuItems" :popup="true" />

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
import Checkbox from 'primevue/checkbox';
import ProgressSpinner from 'primevue/progressspinner';
import Image from 'primevue/image';
import Badge from 'primevue/badge';

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
const showRightSidebar = ref(true); // Default open on large screens
const searchQuery = ref('');

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
    let chats = (chatStore.chats || []).slice().sort((a, b) => {
        const aTime = new Date(a.lastMessage?.createdAt || a.updatedAt || a.createdAt);
        const bTime = new Date(b.lastMessage?.createdAt || b.updatedAt || b.createdAt);
        return bTime - aTime;
    });
    
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        chats = chats.filter(c => getChatName(c).toLowerCase().includes(q));
    }
    return chats;
});

const isUserOnline = computed(() => {
    if (!chatStore.selectedChat) return false;
    if (chatStore.selectedChat.isGroupChat) return false; 
    const other = chatStore.selectedChat.participants.find(p => p._id !== authStore.user?._id);
    return other && chatStore.onlineUsers.includes(other._id);
});

const typingIndicator = computed(() => {
    if (!chatStore.selectedChat) return false;
    // chatStore.typingUsers is a reactive object in Pinia
    return Object.keys(chatStore.typingUsers).some(userId => {
        return chatStore.selectedChat.participants.some(p => p._id === userId) && userId !== authStore.user._id;
    });
});

const isAIMode = computed(() => {
    return newMessage.value.toLowerCase().startsWith('/ai');
});

// Menu Items
const settingsItems = ref([
    { label: 'Sound', icon: 'pi pi-volume-up', command: () => chatStore.toggleSound() },
    { separator: true },
    { label: 'Logout', icon: 'pi pi-sign-out', className: 'text-red-500', command: () => authStore.logout() }
]);

const chatMenuItems = computed(() => [
    { label: 'Clear Chat', icon: 'pi pi-history', command: () => confirmClearChat() },
    { label: 'Delete Chat', icon: 'pi pi-trash', class: 'text-red-500', command: () => confirmDeleteChat() }
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
    if (msg.fileUrl) return isImage(msg.fileUrl) ? 'Image' : 'Attachment';
    return msg.content;
};

const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString();
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
const formatAIResponse = (text) => text; // Markdown parsing could happen here

// Actions
const onSelectChat = async (chat) => {
    // Determine responsive behavior for sidebar
    if (window.innerWidth < 1024) showRightSidebar.value = false;
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

// ... (Rest of actions mostly same, keeping imports) ...
const createChat = async () => {
    if (!newChatEmails.value) return;
    createchatloading.value = true;
    try {
        const emails = newChatEmails.value.split(',').map(e => e.trim()).filter(e => e);
        if (!emails.includes(authStore.user.email)) emails.push(authStore.user.email);
        const newChat = await chatStore.createChat(emails, isGroupChat.value, groupName.value);
        if (newChat) await onSelectChat(newChat);
        showCreateChatDialog.value = false;
        newChatEmails.value = '';
        groupName.value = '';
        isGroupChat.value = false;
    } catch (e) {
    } finally {
        createchatloading.value = false;
    }
};

const startAIChat = async () => {
    try {
        const chat = await chatStore.createAIChat();
        if (chat) await onSelectChat(chat);
    } catch (e) {
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
    newMessage.value = ''; 
    try {
        await chatStore.sendMessage(content);
        scrollToBottom();
    } catch (e) {
        newMessage.value = content;
    }
};

const toggleUploadMenu = (event) => uploadMenu.value.toggle(event);

const triggerFileUpload = (accept) => {
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
    event.target.value = ''; 
};

const toggleRecording = async () => {
    if (recording.value) {
        chatStore.stopAudioRecording();
        clearInterval(recordingInterval.value);
        recording.value = false;
    } else {
        recording.value = true;
        await chatStore.startAudioRecording();
        recordingInterval.value = setInterval(() => { }, 1000);
    }
};

const openEditDialog = (msg) => {
    editingMsgId.value = msg._id;
    editedContent.value = msg.content;
    showEditDialog.value = true;
};

const saveEditedMessage = async () => {
    try {
        await chatStore.editMessage(editingMsgId.value, editedContent.value);
        showEditDialog.value = false;
    } catch (e) {}
};

const confirmDeleteMessage = (msg) => {
    confirm.require({
        message: 'Delete this message permanently?',
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

const confirmClearChat = () => {
    toast.add({ severity: 'info', summary: 'Info', detail: 'Clear chat not implemented yet', life: 3000 });
};

// Calls
const startVoiceCall = () => chatStore.startVoiceCall();
const hangUpVoiceCall = () => chatStore.hangUpVoiceCall();
const acceptCall = () => {
    if (incomingCall.value) {
        chatStore.answerVoiceCall(incomingCall.value);
        incomingCall.value = null;
    }
};
const declineCall = () => {
    incomingCall.value = null;
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
        chatStore.socket.on('incomingVoiceCall', (data) => {
            incomingCall.value = data;
        });
    }

    if (window.innerWidth < 1024) showRightSidebar.value = false;

    window.addEventListener('resize', () => {
        isMobile.value = window.innerWidth < 768;
    });
});

watch(() => chatStore.messages, () => scrollToBottom(), { deep: true });
watch(() => chatStore.remoteStream, (stream) => {
    if (stream && remoteAudio.value) {
        remoteAudio.value.srcObject = stream;
    }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #334155;
}

.animate-message-slide-in {
    animation: messageSlideIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes messageSlideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.animate-ping-slow {
    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}

@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
}

.animate-spin-slow {
    animation: spin 3s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>
