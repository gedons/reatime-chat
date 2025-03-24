<template>
  <div class="flex h-screen bg-gray-100">
  
    <!-- Sidebar: Chat List -->
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
      <!-- Sidebar Header -->
      <div class="p-4 border-b border-gray-200">
        <h1 class="text-xl font-semibold text-gray-800">Chat App</h1>
      </div>
      <!-- Chat List -->
      <div class="flex-1 overflow-y-auto p-4">
        <ul class="space-y-2">
          <li
            v-for="chat in sortedChats"
            :key="chat._id"
            @click="selectChat(chat)"
            class="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
          >
            <!-- Instead of an avatar image, display initials -->
            <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-purple-600 text-white rounded-full font-semibold">
              <span v-if="!chat.isGroupChat">
                {{ getInitials(chat.participants.filter(p => p._id !== authStore.user._id)[0]?.email) }}
              </span>              
              <span v-else>
                {{ getInitials(chat.name) }}
              </span>
              <span v-if="chat.isAIChat" class="text-white">
                <svg class="w-6 h-6 mb-1 mr-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 15C8.44771 15 8 15.4477 8 16C8 16.5523 8.44771 17 9 17C9.55229 17 10 16.5523 10 16C10 15.4477 9.55229 15 9 15Z" fill="#ffffff"></path> <path d="M14 16C14 15.4477 14.4477 15 15 15C15.5523 15 16 15.4477 16 16C16 16.5523 15.5523 17 15 17C14.4477 17 14 16.5523 14 16Z" fill="#ffffff"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C10.8954 1 10 1.89543 10 3C10 3.74028 10.4022 4.38663 11 4.73244V7H6C4.34315 7 3 8.34315 3 10V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V10C21 8.34315 19.6569 7 18 7H13V4.73244C13.5978 4.38663 14 3.74028 14 3C14 1.89543 13.1046 1 12 1ZM5 10C5 9.44772 5.44772 9 6 9H7.38197L8.82918 11.8944C9.16796 12.572 9.86049 13 10.618 13H13.382C14.1395 13 14.832 12.572 15.1708 11.8944L16.618 9H18C18.5523 9 19 9.44772 19 10V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V10ZM13.382 11L14.382 9H9.61803L10.618 11H13.382Z" fill="#ffffff"></path> <path d="M1 14C0.447715 14 0 14.4477 0 15V17C0 17.5523 0.447715 18 1 18C1.55228 18 2 17.5523 2 17V15C2 14.4477 1.55228 14 1 14Z" fill="#ffffff"></path> <path d="M22 15C22 14.4477 22.4477 14 23 14C23.5523 14 24 14.4477 24 15V17C24 17.5523 23.5523 18 23 18C22.4477 18 22 17.5523 22 17V15Z" fill="#ffffff"></path> </g></svg>
              </span>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">
                {{ 
                  chat.isAIChat 
                    ? "AI Chat" 
                    : (chat.isGroupChat 
                        ? chat.name 
                        : (chat.participants.filter(p => p._id !== authStore.user._id)[0]?.username || 
                           chat.participants.filter(p => p._id !== authStore.user._id)[0]?.email || "Unknown"))
                }}
              </p>
              <p class="text-xs text-gray-500">
                {{ chat.lastMessage ? chat.lastMessage.content : "No new messages yet" }}
              </p>
              <p class="text-xs text-gray-400" v-if="chat.lastSeen">
                Last seen: {{ new Date(chat.lastSeen).toLocaleString() }}
              </p>
            </div>
          </li>
        </ul>
      </div>
      <!-- Sidebar Footer: New Chat Button -->
      <div class="p-4 border-t border-gray-200 flex space-x-3">
        <!-- New Chat Button -->
        <button
          @click="showCreateChatModal = true"
          class="flex-1 bg-purple-600 font-semibold cursor-pointer text-white py-2 rounded-lg hover:bg-purple-700"
        >
          New Chat
        </button>
        <!-- AI Chat Button -->
        <button
          :disabled="hasAIChat"
          @click="startAIChat"
          :class="[
            'flex-1 flex items-center justify-center space-x-2 text-white py-2 rounded-lg',
            hasAIChat ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 cursor-pointer hover:bg-green-700'
          ]"
        >
          <div class="w-6 h-6">
            <!-- AI icon SVG (feel free to customize the icon) -->
            <svg class="w-6 h-6 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 15C8.44771 15 8 15.4477 8 16C8 16.5523 8.44771 17 9 17C9.55229 17 10 16.5523 10 16C10 15.4477 9.55229 15 9 15Z" fill="currentColor"/>
              <path d="M14 16C14 15.4477 14.4477 15 15 15C15.5523 15 16 15.4477 16 16C16 16.5523 15.5523 17 15 17C14.4477 17 14 16.5523 14 16Z" fill="currentColor"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C10.8954 1 10 1.89543 10 3C10 3.74028 10.4022 4.38663 11 4.73244V7H6C4.34315 7 3 8.34315 3 10V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V10C21 8.34315 19.6569 7 18 7H13V4.73244C13.5978 4.38663 14 3.74028 14 3C14 1.89543 13.1046 1 12 1ZM5 10C5 9.44772 5.44772 9 6 9H7.38197L8.82918 11.8944C9.16796 12.572 9.86049 13 10.618 13H13.382C14.1395 13 14.832 12.572 15.1708 11.8944L16.618 9H18C18.5523 9 19 9.44772 19 10V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V10ZM13.382 11L14.382 9H9.61803L10.618 11H13.382Z" fill="currentColor"/>
            </svg>
          </div>
          <span class="font-semibold mr-2 mt-0.5">{{ hasAIChat ? 'AI Active' : 'AI Chat' }}</span>
        </button>
      </div>      
    </aside>


    <!-- Main Chat Window -->
    <main class="flex-1 flex flex-col">
      <!-- Chat Header (unchanged) -->
      <header class="relative p-4 border-b bg-white flex items-center justify-between">
        <div class="flex items-center">
          <div class="w-10 h-10 flex items-center justify-center bg-purple-600 text-white rounded-full">
            <span>
              <!-- SVG icon remains unchanged -->
              <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21.0039 12C21.0039 16.9706 16.9745 21 12.0039 21C9.9675 21 3.00463 21 3.00463 21C3.00463 21 4.56382 17.2561 3.93982 16.0008C3.34076 14.7956 3.00391 13.4372 3.00391 12C3.00391 7.02944 7.03334 3 12.0039 3C16.9745 3 21.0039 7.02944 21.0039 12Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
          <div class="ml-3">
            <p class="text-lg font-semibold text-gray-800">{{ chatTitle }}</p>
            <p class="text-sm text-gray-500">
              <template v-if="isUserOnline">
                <span class="text-green-500">Online</span>
              </template>
              <template v-else-if="lastSeenFormatted && lastSeenFormatted !== 'Unknown'">
                Last seen: {{ lastSeenFormatted }}
              </template>
              <template v-else>
                Message Panel
              </template>
            </p>
          </div>
        </div>
        
        <div class="relative">
           <!-- Call Button -->
           <button @click="startVoiceCall" class="p-2 hover:bg-gray-200 cursor-pointer rounded-full  focus:outline-none">                                         
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 12C19.7614 12 22 9.76142 22 7C22 4.23858 19.7614 2 17 2C14.2386 2 12 4.23858 12 7C12 7.79984 12.1878 8.55582 12.5217 9.22624C12.6105 9.4044 12.64 9.60803 12.5886 9.80031L12.2908 10.9133C12.1615 11.3965 12.6035 11.8385 13.0867 11.7092L14.1997 11.4114C14.392 11.36 14.5956 11.3895 14.7738 11.4783C15.4442 11.8122 16.2002 12 17 12Z" stroke="#000000" stroke-width="1.5"></path> <path d="M17 9L17 5M19 7L15 7" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path> <path d="M14.1007 16.0272L13.5569 15.5107L14.1007 16.0272ZM14.5562 15.5477L15.1 16.0642H15.1L14.5562 15.5477ZM16.9728 15.2123L16.5987 15.8623H16.5987L16.9728 15.2123ZM18.8833 16.312L18.5092 16.962L18.8833 16.312ZM19.4217 19.7584L19.9655 20.2749L19.4217 19.7584ZM18.0011 21.254L17.4573 20.7375L18.0011 21.254ZM16.6763 21.9631L16.7499 22.7095L16.6763 21.9631ZM6.81536 17.4752L7.35915 16.9587L6.81536 17.4752ZM2.00289 7.96594L1.25397 8.00613L1.25397 8.00613L2.00289 7.96594ZM8.47752 9.50311L9.02131 10.0196H9.02131L8.47752 9.50311ZM8.63424 6.6931L9.24664 6.26012L8.63424 6.6931ZM7.37326 4.90961L6.76086 5.3426V5.3426L7.37326 4.90961ZM4.26145 4.60864L4.80524 5.12516L4.26145 4.60864ZM2.69185 6.26114L2.14806 5.74462L2.14806 5.74462L2.69185 6.26114ZM10.0631 14.0559L10.6069 13.5394L10.0631 14.0559ZM14.6445 16.5437L15.1 16.0642L14.0124 15.0312L13.5569 15.5107L14.6445 16.5437ZM16.5987 15.8623L18.5092 16.962L19.2575 15.662L17.347 14.5623L16.5987 15.8623ZM18.8779 19.2419L17.4573 20.7375L18.5449 21.7705L19.9655 20.2749L18.8779 19.2419ZM16.6026 21.2167C15.1676 21.3584 11.4233 21.2375 7.35915 16.9587L6.27157 17.9917C10.7009 22.655 14.9261 22.8895 16.7499 22.7095L16.6026 21.2167ZM7.35915 16.9587C3.48303 12.8778 2.83285 9.43556 2.75181 7.92574L1.25397 8.00613C1.35322 9.85536 2.1384 13.6403 6.27157 17.9917L7.35915 16.9587ZM8.7345 10.3216L9.02131 10.0196L7.93372 8.9866L7.64691 9.28856L8.7345 10.3216ZM9.24664 6.26012L7.98565 4.47663L6.76086 5.3426L8.02185 7.12608L9.24664 6.26012ZM3.71766 4.09213L2.14806 5.74462L3.23564 6.77765L4.80524 5.12516L3.71766 4.09213ZM8.1907 9.80507C7.64691 9.28856 7.64622 9.28929 7.64552 9.29002C7.64528 9.29028 7.64458 9.29102 7.64411 9.29152C7.64316 9.29254 7.64219 9.29357 7.64121 9.29463C7.63924 9.29675 7.6372 9.29896 7.6351 9.30127C7.63091 9.30588 7.62646 9.31087 7.62178 9.31625C7.61243 9.32701 7.60215 9.33931 7.59116 9.3532C7.56918 9.38098 7.54431 9.41512 7.51822 9.45588C7.46591 9.53764 7.40917 9.64531 7.36112 9.78033C7.26342 10.0549 7.21018 10.4185 7.27671 10.8726C7.40742 11.7647 7.99198 12.9644 9.51933 14.5724L10.6069 13.5394C9.17926 12.0363 8.82761 11.1106 8.76086 10.6551C8.72866 10.4354 8.76138 10.3196 8.77432 10.2832C8.78159 10.2628 8.78635 10.2571 8.78169 10.2644C8.77944 10.2679 8.77494 10.2745 8.76738 10.2841C8.76359 10.2888 8.75904 10.2944 8.7536 10.3006C8.75088 10.3038 8.74793 10.3071 8.74476 10.3106C8.74317 10.3123 8.74152 10.3141 8.73981 10.3159C8.73896 10.3169 8.73809 10.3178 8.7372 10.3187C8.73676 10.3192 8.73608 10.3199 8.73586 10.3202C8.73518 10.3209 8.7345 10.3216 8.1907 9.80507ZM9.51933 14.5724C11.0422 16.1757 12.1923 16.806 13.0698 16.9485C13.5201 17.0216 13.8846 16.9632 14.1606 16.8544C14.2955 16.8012 14.4022 16.7387 14.4823 16.6819C14.5223 16.6535 14.5556 16.6266 14.5824 16.6031C14.5959 16.5913 14.6077 16.5803 14.618 16.5703C14.6232 16.5654 14.628 16.5606 14.6324 16.5562C14.6346 16.554 14.6367 16.5518 14.6387 16.5497C14.6397 16.5487 14.6407 16.5477 14.6417 16.5467C14.6422 16.5462 14.6429 16.5454 14.6431 16.5452C14.6438 16.5444 14.6445 16.5437 14.1007 16.0272C13.5569 15.5107 13.5576 15.51 13.5583 15.5093C13.5585 15.509 13.5592 15.5083 13.5596 15.5078C13.5605 15.5069 13.5614 15.506 13.5623 15.5051C13.5641 15.5033 13.5658 15.5015 13.5674 15.4998C13.5708 15.4965 13.574 15.4933 13.577 15.4904C13.583 15.4846 13.5885 15.4796 13.5933 15.4754C13.6028 15.467 13.6099 15.4616 13.6145 15.4584C13.6239 15.4517 13.6229 15.454 13.6102 15.459C13.5909 15.4666 13.5 15.4987 13.3103 15.4679C12.9077 15.4025 12.0391 15.0472 10.6069 13.5394L9.51933 14.5724ZM7.98565 4.47663C6.97206 3.04305 4.94384 2.80119 3.71766 4.09213L4.80524 5.12516C5.32808 4.57471 6.24851 4.61795 6.76086 5.3426L7.98565 4.47663ZM2.75181 7.92574C2.73038 7.52644 2.90425 7.12654 3.23564 6.77765L2.14806 5.74462C1.61221 6.30877 1.20493 7.09246 1.25397 8.00613L2.75181 7.92574ZM17.4573 20.7375C17.1783 21.0313 16.8864 21.1887 16.6026 21.2167L16.7499 22.7095C17.497 22.6357 18.1016 22.2373 18.5449 21.7705L17.4573 20.7375ZM9.02131 10.0196C9.98889 9.00095 10.0574 7.40678 9.24664 6.26012L8.02185 7.12608C8.44399 7.72315 8.37926 8.51753 7.93372 8.9866L9.02131 10.0196ZM18.5092 16.962C19.33 17.4345 19.4907 18.5968 18.8779 19.2419L19.9655 20.2749C21.2704 18.901 20.8904 16.6019 19.2575 15.662L18.5092 16.962ZM15.1 16.0642C15.4854 15.6584 16.086 15.5672 16.5987 15.8623L17.347 14.5623C16.2485 13.93 14.8861 14.1113 14.0124 15.0312L15.1 16.0642Z" fill="#000000"></path> </g></svg>
          </button>

          <!-- Settings Button-->
          <button @click="toggleSettings" class="p-2 rounded-full hover:bg-gray-200 cursor-pointer focus:outline-none">
            <svg class="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 17H19M5 12H19M11 7H19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div v-if="showSettings" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
            <ul>
              <li>
                <button class="w-full text-left px-4 py-2 hover:bg-gray-100" @click="toggleSound">
                  Sound: <span>{{ soundEnabled ? 'On' : 'Off' }}</span>
                </button>
              </li>
              <li>
                <button class="w-full text-left px-4 py-2 hover:bg-gray-100" @click="logout">
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <div v-if="chatStore.loading" class="flex items-center justify-center h-full">
          <svg class="animate-spin h-8 w-8 text-purple-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        <span class="ml-2 font-semibold">Loading messages...</span>
      </div>

      <!-- Chat Messages -->     
      <section v-else
        v-if="chatStore.selectedChat"
        class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
        ref="messagesContainer"
      >       
        <div
          v-for="msg in chatStore.messages"
          :key="msg._id"
          :class="msg.sender._id === authStore.user._id ? 'flex justify-end' : 'flex items-start'"
          @mouseenter="hoveredMsgId = msg._id"
          @mouseleave="hoveredMsgId = null"
        >
          <!-- Outgoing Message with Edit/Delete Menu -->
          <template v-if="msg.sender._id === authStore.user._id">
            <div class="flex flex-col items-end space-y-1">
              <div class="flex items-center space-x-2">
                <p class="text-xs text-gray-500 mb-1">{{ authStore.user.username || authStore.user.email }} (you)</p>
                <div class="w-8 h-8 flex items-center justify-center bg-purple-600 text-white rounded-full font-semibold">
                  <span>{{ getInitials(authStore.user.username) }}</span>
                </div>
                  <!-- Status Icon -->
                  <div class="ml-2">                   
                    <template v-if="msg.isRead">
                      <span class="text-xs text-gray-400">✔️✔️</span>
                    </template>                   
                    <template v-else>
                      <span class="text-xs text-red-400">🕒</span>
                    </template>
                  </div>
                <div v-if="hoveredMsgId === msg._id" class="relative">
                  <button class="p-1 rounded hover:bg-gray-200" @click="toggleMsgMenu(msg._id)">
                    <svg class="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="5" cy="12" r="2"/>
                      <circle cx="12" cy="12" r="2"/>
                      <circle cx="19" cy="12" r="2"/>
                    </svg>
                  </button>
                  <div v-if="msgMenuId === msg._id" class="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <ul>
                      <li>
                        <button class="w-full text-left px-2 py-1 hover:bg-gray-100" @click="openEditModal(msg)">
                          Edit
                        </button>
                      </li>
                      <li>
                        <button class="w-full text-left px-2 py-1 hover:bg-gray-100" @click="confirmDelete(msg._id)">
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="flex items-start justify-end space-x-2">
                <div class="bg-purple-600 p-3 rounded-lg shadow max-w-xs">
                  <!-- Check if message has a media file -->
                  <template v-if="msg.fileUrl">
                    <template v-if="isImage(msg.fileUrl)">
                      <img :src="msg.fileUrl" alt="Image" class="max-w-full rounded"/>
                    </template>
                    <template v-else-if="isVideo(msg.fileUrl)">
                      <video controls class="max-w-full rounded">
                        <source :src="msg.fileUrl" type="video/mp4"/>
                        Your browser does not support the video tag.
                      </video>
                    </template>
                    <template v-else>
                      <a :href="msg.fileUrl" target="_blank" class="flex items-center space-x-2">                        
                        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18 6.00002V6.75002H18.75V6.00002H18ZM15.7172 2.32614L15.6111 1.58368L15.7172 2.32614ZM4.91959 3.86865L4.81353 3.12619H4.81353L4.91959 3.86865ZM5.07107 6.75002H18V5.25002H5.07107V6.75002ZM18.75 6.00002V4.30604H17.25V6.00002H18.75ZM15.6111 1.58368L4.81353 3.12619L5.02566 4.61111L15.8232 3.0686L15.6111 1.58368ZM4.81353 3.12619C3.91638 3.25435 3.25 4.0227 3.25 4.92895H4.75C4.75 4.76917 4.86749 4.63371 5.02566 4.61111L4.81353 3.12619ZM18.75 4.30604C18.75 2.63253 17.2678 1.34701 15.6111 1.58368L15.8232 3.0686C16.5763 2.96103 17.25 3.54535 17.25 4.30604H18.75ZM5.07107 5.25002C4.89375 5.25002 4.75 5.10627 4.75 4.92895H3.25C3.25 5.9347 4.06532 6.75002 5.07107 6.75002V5.25002Z" fill="#ffffff"></path> <path d="M8 12H16" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M8 15.5H13.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M4 6V19C4 20.6569 5.34315 22 7 22H17C18.6569 22 20 20.6569 20 19V14M4 6V5M4 6H17C18.6569 6 20 7.34315 20 9V10" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                        <span class="text-sm text-white font-semibold">View Document</span>
                      </a>
                    </template>
                  </template>
                  <template v-else>
                    <p class="text-sm text-white">{{formatAIResponse(msg.content, msg.iv)}}</p>
                  </template>
                </div>
                <p class="text-xs text-gray-400 mt-1 text-right">{{ formatTimestamp(msg.createdAt) }}</p>
              </div>
              <div v-if="msg.isRead && msg.isRead.length" class="text-green-500 text-xs">
                {{ msg.delivered ? '✅ Delivered' : '⏳ Pending' }}
              </div>
            </div>
          </template>
          <!-- Incoming Message -->
          <template v-else>
            <div class="flex flex-col space-y-1">
              <!-- Sender Info -->
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 flex items-center justify-center bg-purple-600 text-white rounded-full font-semibold">
                  <span>{{ getInitials(msg.sender.username) }}</span>
                </div>
                <p class="text-xs text-gray-500">{{ msg.sender.username || msg.sender.email }}</p>
              </div>
          
              <!-- Message Content -->
              <div class="flex items-start space-x-2">
                <div 
                  class="p-3 rounded-lg shadow max-w-xs"
                  :class="{ 'bg-white': !isAudio(msg.fileUrl) }"
                >
                  <template v-if="msg.fileUrl">
                    <template v-if="isImage(msg.fileUrl)">
                      <img :src="msg.fileUrl" alt="Image" class="max-w-full rounded"/>
                    </template>
                    <template v-else-if="isVideo(msg.fileUrl)">
                      <video controls class="max-w-full rounded">
                        <source :src="msg.fileUrl" type="video/mp4"/>
                        Your browser does not support the video tag.
                      </video>
                    </template>
                    <template v-else-if="isAudio(msg.fileUrl)">
                      <audio controls class="w-full">
                        <source :src="msg.fileUrl" type="audio/mpeg"/>
                        Your browser does not support the audio element.
                      </audio>
                    </template>
                    <template v-else>
                      <a :href="msg.fileUrl" target="_blank" class="flex items-center space-x-2">
                        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                          <g id="SVGRepo_iconCarrier">
                            <path d="M18 6.00002V6.75002H18.75V6.00002H18ZM15.7172 2.32614L15.6111 1.58368L15.7172 2.32614ZM4.91959 3.86865L4.81353 3.12619H4.81353L4.91959 3.86865ZM5.07107 6.75002H18V5.25002H5.07107V6.75002ZM18.75 6.00002V4.30604H17.25V6.00002H18.75ZM15.6111 1.58368L4.81353 3.12619L5.02566 4.61111L15.8232 3.0686L15.6111 1.58368ZM4.81353 3.12619C3.91638 3.25435 3.25 4.0227 3.25 4.92895H4.75C4.75 4.76917 4.86749 4.63371 5.02566 4.61111L4.81353 3.12619ZM18.75 4.30604C18.75 2.63253 17.2678 1.34701 15.6111 1.58368L15.8232 3.0686C16.5763 2.96103 17.25 3.54535 17.25 4.30604H18.75ZM5.07107 5.25002C4.89375 5.25002 4.75 5.10627 4.75 4.92895H3.25C3.25 5.9347 4.06532 6.75002 5.07107 6.75002V5.25002Z" fill="#1C274D"></path>
                            <path d="M8 12H16" stroke="#1C274D" stroke-width="1.5" stroke-linecap="round"></path>
                            <path d="M8 15.5H13.5" stroke="#1C274D" stroke-width="1.5" stroke-linecap="round"></path>
                            <path d="M4 6V19C4 20.6569 5.34315 22 7 22H17C18.6569 22 20 20.6569 20 19V14M4 6V5M4 6H17C18.6569 6 20 7.34315 20 9V10" stroke="#1C274D" stroke-width="1.5" stroke-linecap="round"></path>
                          </g>
                        </svg>
                        <span class="text-sm text-blue-500">View Document</span>
                      </a>
                    </template>
                  </template>
                  <template v-else>
                    <p class="text-sm text-gray-800">{{ formatAIResponse(msg.content) }}</p>
                  </template>
                </div>
                <p class="text-xs text-gray-400 mt-1">{{ formatTimestamp(msg.createdAt) }}</p>
              </div>
            </div>
          </template>
          
        </div>
        <!-- Typing Indicator -->
        <div v-if="typingIndicator" class="text-gray-500 italic">Typing...</div>
      </section>           

      <!-- Media upload progress bar -->
      <div v-if="chatStore.mediaUploadProgress > 0 && chatStore.mediaUploadProgress < 100" class="progress-container">
        <p>Uploading: {{ chatStore.mediaUploadProgress }}%</p>
        <div class="progress-bar">
          <div
            class="progress"
            :style="{ width: chatStore.mediaUploadProgress + '%' }"
          ></div>
        </div>
      </div>

      <!-- Chat Input: Only show if a chat is selected -->
      <footer v-if="chatStore.selectedChat" class="p-4 border-t bg-white">
         <!-- AI Mode Indicator -->
        <transition name="fade">
          <div v-if="newMessage.toLowerCase().startsWith('/ai')" class="mb-2 flex items-center space-x-2">
            <div class="w-6 h-6">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M9 15C8.44771 15 8 15.4477 8 16C8 16.5523 8.44771 17 9 17C9.55229 17 10 16.5523 10 16C10 15.4477 9.55229 15 9 15Z" fill="#0F0F0F"></path>
                  <path d="M14 16C14 15.4477 14.4477 15 15 15C15.5523 15 16 15.4477 16 16C16 16.5523 15.5523 17 15 17C14.4477 17 14 16.5523 14 16Z" fill="#0F0F0F"></path>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C10.8954 1 10 1.89543 10 3C10 3.74028 10.4022 4.38663 11 4.73244V7H6C4.34315 7 3 8.34315 3 10V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V10C21 8.34315 19.6569 7 18 7H13V4.73244C13.5978 4.38663 14 3.74028 14 3C14 1.89543 13.1046 1 12 1ZM5 10C5 9.44772 5.44772 9 6 9H7.38197L8.82918 11.8944C9.16796 12.572 9.86049 13 10.618 13H13.382C14.1395 13 14.832 12.572 15.1708 11.8944L16.618 9H18C18.5523 9 19 9.44772 19 10V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V10ZM13.382 11L14.382 9H9.61803L10.618 11H13.382Z" fill="#0F0F0F"></path>
                  <path d="M1 14C0.447715 14 0 14.4477 0 15V17C0 17.5523 0.447715 18 1 18C1.55228 18 2 17.5523 2 17V15C2 14.4477 1.55228 14 1 14Z" fill="#0F0F0F"></path>
                  <path d="M22 15C22 14.4477 22.4477 14 23 14C23.5523 14 24 14.4477 24 15V17C24 17.5523 23.5523 18 23 18C22.4477 18 22 17.5523 22 17V15Z" fill="#0F0F0F"></path>
                </g>
              </svg>
            </div>
            <p class="text-xs text-gray-600">AI Mode Activated</p>
          </div>
        </transition>

        <div class="flex items-center space-x-2">
           <!-- Record Button -->          
          <div v-if="!recording">
            <button @click="startAudio" class="record-btn cursor-pointer">
              🎙️ Hold to Record
            </button>
          </div>
          <div v-else>
            <button @click="stopAudio" class="record-btn cursor-pointer">
              🛑 Stop Recording
            </button>
          </div>
          <input
            v-model="newMessage"
            @keydown="startTyping"
            @keyup="stopTyping"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Type a message..."
            class="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input type="file" @change="handleFileUpload" class="hidden" ref="fileInput"/>
          <button
            @click="triggerFileInput"
            class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
          <svg class="w-5 h-5" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12.4797 4.15793C14.6095 0.833113 19.0267 -0.132589 22.3457 2.00098C25.6648 4.13454 26.6288 8.55944 24.4989 11.8843L22.6498 10.6956C24.1243 8.39379 23.4569 5.3304 21.1591 3.85332C18.8614 2.37624 15.8033 3.0448 14.3288 5.3466L12.4797 4.15793Z" fill="#ffffff"></path><path d="M14.3278 5.34752L5.1311 19.7042C4.14959 21.2384 4.5946 23.2789 6.12591 24.263C7.65789 25.2475 9.69685 24.8018 10.68 23.2674L13.0534 19.5629L13.0519 19.5619L18.9849 10.3002L18.9863 10.3012C19.4777 9.53391 19.2553 8.51284 18.4894 8.0205C17.7234 7.52814 16.7041 7.751 16.2126 8.51826L16.2111 8.51733L11.5 16.001C11.2118 16.4509 10.6138 16.5814 10.1643 16.2925L9.94284 16.1501C9.49339 15.8612 9.36268 15.2622 9.65088 14.8123L14.3621 7.32857L14.3635 7.3295C15.5104 5.53929 17.8888 5.01934 19.676 6.16816C21.4631 7.317 21.9822 9.69964 20.8354 11.4899L20.8339 11.489L18.4613 15.1927L18.4632 15.1939L12.5297 24.4564C10.891 27.0135 7.49232 27.756 4.93909 26.1152C2.38578 24.4743 1.64432 21.071 3.28299 18.5136L12.4787 4.15885L14.3278 5.34752Z" fill="#ffffff"></path><path d="M15.4516 23.7222C15.0022 23.4333 14.8715 22.8343 15.1597 22.3844L22.6473 10.6957L24.4965 11.8844L17.0088 23.5731C16.7206 24.023 16.1226 24.1535 15.6731 23.8646L15.4516 23.7222Z" fill="#ffffff"></path></g></svg>
          </button>
          <button
            @click="sendMessage"
            class="p-2 bg-purple-600 font-semibold text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          </button>
          <!-- Recording indicator -->
          <div v-if="recording" class="recording-indicator">
            <div class="recording-content">
              <span class="dot"></span>
              <span class="text">Recording... {{ recordingTime }}s</span>
              <button @click="cancelRecording" class="cancel-btn">Cancel</button>
            </div>
          </div>
          <div v-else-if="sendingVoiceNote" class="mt-2 text-sm text-blue-500">
            Sending voice note...
          </div>
        </div>
      </footer>

      <!-- Placeholder if no chat is selected -->
      <template v-else>
        <div class="flex-1 flex items-center justify-center bg-white">
          <p class="text-gray-500 text-lg">Select a chat to start messaging</p>
        </div>
      </template>
    </main>

    <!-- Create Chat Modal (unchanged) -->
    <div
      v-if="showCreateChatModal"
      class="fixed inset-0 bg-gradient-to-r from-blue-500 to-purple-600 font-semibold bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h3 class="text-lg font-bold mb-4">Create Chat</h3>
        <input
          v-model="newChatEmails"
          placeholder="Enter user emails (comma separated)"
          class="border p-2 w-full mb-2"
        />
        <label class="flex items-center space-x-2">
          <input type="checkbox" v-model="isGroupChat" /> <span>Group Chat</span>
        </label>
        <input
          v-if="isGroupChat"
          v-model="groupName"
          placeholder="Group Name"
          class="border p-2 w-full mt-2"
        />
        <div v-if="createChatError" class="text-red-500 text-sm mt-2 whitespace-pre-line">
          {{ createChatError }}
        </div>
        <div class="flex justify-end mt-4 space-x-2">
          <button
            @click="closeCreateChatModal"
            class="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            @click="createChat"
            class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Message Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gradient-to-r from-blue-500 to-purple-600 font-semibold bg-opacity-50 flex items-center justify-center z-20">
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h3 class="text-lg font-bold mb-4">Edit Message</h3>
        <input
          v-model="editedContent"
          type="text"
          class="border p-2 w-full mb-4"
          :disabled="chatStore.messageLoading"
        />
        <div class="flex justify-end space-x-2">
          <button 
            @click="cancelEditing" 
            class="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer"
            :disabled="chatStore.messageLoading"
          >
            Cancel
          </button>
          <button 
            @click="saveEditedMessage(editingMsgId)" 
            class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer flex items-center"
            :disabled="chatStore.messageLoading"
          >
            <span v-if="chatStore.messageLoading" class="animate-spin mr-2">
              <!-- Simple spinner SVG -->
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            </span>
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>

   <!-- Call UI (only shown when a call is active) -->
    <div v-if="callActive" class="absolute bottom-20 left-0 right-0 flex justify-center">
      <div class="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
        <p class="font-semibold mb-2">Voice Call Active</p>
        <!-- Audio elements for local/remote streams -->
        <audio ref="remoteAudio" autoplay></audio>
        <!-- Hang up button -->
        <button @click="hangUpVoiceCall" class="mt-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
          Hang Up
        </button>
      </div>
    </div>

    <!-- Incoming Call Modal -->
    <transition name="fade">
      <div v-if="incomingCall" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
          <p class="text-lg font-semibold mb-4">Incoming Voice Call from {{ incomingCall.callerName }}</p>
          <div class="flex justify-center space-x-4">
            <button
              @click="acceptCall"
              class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Accept
            </button>
            <button
              @click="declineCall"
              class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Decline
            </button>
          </div>
        </div>
      </div>      
    </transition>

    <transition name="fade">
      <div v-if="chatStore.callActive" class="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg">
        <p>Call in progress: {{ chatStore.callDuration }}s</p>
        <button @click="chatStore.hangUpVoiceCall" class="mt-2 bg-red-500 px-3 py-1 rounded hover:bg-red-600">
          Hang Up
        </button>
      </div>     
    </transition>


  </div>
</template>

<script>
import { useChatStore } from "../stores/chat";
import { useAuthStore } from "../stores/auth";
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

 

export default {

  setup() {
    const chatStore = useChatStore();
    const authStore = useAuthStore();
    const toast = useToast();

    // Reactive state
    const showCreateChatModal = ref(false);
    const newChatEmails = ref("");
    const isGroupChat = ref(false);
    const groupName = ref("");
    const createChatError = ref("");
    const newMessage = ref("");
    const onlineUsers = ref([]);
    const showSettings = ref(false);
    let typingTimeout;
    const messagesContainer = ref(null);

    // Reactive variables for editing/deleting messages
    const hoveredMsgId = ref(null);
    const msgMenuId = ref(null);
    const editingMsgId = ref(null);
    const editedContent = ref("");
    const showEditModal = ref(false);

    //recording media variables
    const recording = ref(false);
    const recordingTime = ref(0);
    const sendingVoiceNote = ref(false);
    let recordingInterval = null;
    const mediaUploadProgress = ref(0);

    const remoteAudio = ref(null);
    const incomingCall = ref(null); 
    
    recording.value = chatStore.recording;
    mediaUploadProgress.value = chatStore.mediaUploadProgress;   
        
    //upload
    const fileInput = ref(null);

    onMounted(() => {
      if (!authStore.user) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          authStore.user = JSON.parse(storedUser);
        }
      }
      console.log("Chat view mounted. User:", authStore.user);
      chatStore.fetchUserChats();
      const userId = authStore.user?._id || localStorage.getItem("userId");
      if (userId) {
        chatStore.connectSocket(userId);
        chatStore.socket.on("updateOnlineUsers", (users) => {
          onlineUsers.value = users;
        });
        // Check if socket is ready; if not, watch until it is
        if (chatStore.socket) {
          attachIncomingCallListener(chatStore.socket);
        } else {
          const unwatch = watch(
            () => chatStore.socket,
            (newSocket) => {
              if (newSocket) {
                attachIncomingCallListener(newSocket);
                unwatch(); // Stop watching once the listener is attached
              }
            }
          );
        }
      }
    });

    onUnmounted(() => {
      if (chatStore.socket && authStore.user) {
        chatStore.socket.emit("userDisconnected", { userId: authStore.user._id });
        chatStore.socket.off("incomingVoiceCall");
      }
    });

    const scrollToBottom = async () => {
      await nextTick(); // wait for DOM update
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        console.log("[scrollToBottom] Scrolled to bottom");
      }
    };

    // Watch the messages array for changes (new message added, etc.)
    watch(
      () => chatStore.messages,
      () => {
        scrollToBottom();
      },
      { deep: true }
    );

    // Also, when the selected chat changes, scroll to bottom:
    watch(
      () => chatStore.selectedChat,
      () => {
        scrollToBottom();
      }
    );

    const selectedChatAvatar = computed(() => {
      if (!chatStore.selectedChat) return "https://via.placeholder.com/40";
      if (!chatStore.selectedChat.isGroupChat) {
        const other = chatStore.selectedChat.participants.find(
          (p) => p._id !== authStore.user._id
        );
        return other ? getInitials(other.email) : "https://via.placeholder.com/40";
      }
      return getInitials(chatStore.selectedChat.name);
    });

    const lastSeenFormatted = computed(() => {
      if (!chatStore.selectedChat) return "";
      const updatedChat = chatStore.chats.find(
        (chat) => chat._id === chatStore.selectedChat._id
      );
      if (!updatedChat) return "Unknown";
      const otherParticipant = updatedChat.participants.find(
        (p) => p._id !== authStore.user?._id
      );
      const lastSeen =
        (otherParticipant && otherParticipant.lastSeen) ||
        chatStore.lastSeenMap?.[otherParticipant?._id];
      return lastSeen ? new Date(lastSeen).toLocaleString() : "Unknown";
    });

    const isUserOnline = computed(() => {
      if (!chatStore.selectedChat) return false;
      const otherParticipant = chatStore.selectedChat.participants.find(
        (p) => p._id !== authStore.user?._id
      );
      return otherParticipant ? onlineUsers.value.includes(otherParticipant._id) : false;
    });

    const getInitials = (str) => {
      if (!str) return "";
      const parts = str.split(/[\s@.]+/);
      let initials = "";
      for (let part of parts) {
        if (part.length > 0) {
          initials += part.charAt(0).toUpperCase();
          if (initials.length === 2) break;
        }
      }
      return initials;
    };

    const formatTimestamp = (timestamp) => {
      return timestamp ? new Date(timestamp).toLocaleTimeString() : "";
    };

    const toggleSettings = () => {
      showSettings.value = !showSettings.value;
    };

    const logout = () => {
      authStore.logout();
    };

    const soundEnabled = computed(() => chatStore.soundEnabled);
    const toggleSound = () => {
      chatStore.toggleSound();
    };

    const selectChat = (chat) => {
      chatStore.selectChat(chat);
      scrollToBottom();
    };

    const createChat = async () => {
      createChatError.value = "";
      if (!authStore.user) {
        console.error("User not logged in");
        createChatError.value = "You must be logged in to create a chat.";
        return;
      }
      const loggedInUserEmail = authStore.user.email;
      let emails = [
        ...new Set(
          newChatEmails.value.split(",").map((email) => email.trim()).filter((email) => email)
        ),
      ];
      if (!emails.length) {
        createChatError.value = "Please enter at least one valid email.";
        return;
      }
      if (!emails.includes(loggedInUserEmail)) {
        emails.push(loggedInUserEmail);
      }
      try {
        await chatStore.createChat(emails, isGroupChat.value, groupName.value);
        closeCreateChatModal();
        await chatStore.fetchUserChats();
      } catch (error) {
        console.error("Chat creation error:", error);
        if (error.response) {
          createChatError.value = error.response.data.message || "Failed to create chat.";
          if (error.response.data.errors) {
            createChatError.value += "\n" + Object.values(error.response.data.errors).flat().join("\n");
          }
        } else {
          createChatError.value = "Failed to create chat. Please try again.";
        }
      }
    };

    const closeCreateChatModal = () => {
      showCreateChatModal.value = false;
      newChatEmails.value = "";
      groupName.value = "";
      createChatError.value = "";
    };

    const sendMessage = async () => {
      console.log("Message to send:", newMessage.value);
      const messageContent = String(newMessage.value).trim();
      if (!messageContent) return;
      if (!chatStore.selectedChat?._id) {
        console.error("No chat selected. Cannot send message.");
        return;
      }

      // If the current chat is an AI chat OR the message starts with "/ai"
      if (
        chatStore.selectedChat.isAIChat ||
        messageContent.toLowerCase().startsWith("/ai")
      ) {
        // Remove "/ai" prefix if present
        const aiPrompt = messageContent.toLowerCase().startsWith("/ai")
          ? messageContent.replace(/^\/ai\s*/, "")
          : messageContent;
        console.log("AI prompt:", aiPrompt);
        // Clear the input immediately
        newMessage.value = "";

        // Add a temporary loading message to the chat panel
        const loadingId = "loading-" + Date.now().toString();
        const loadingMessage = {
          _id: loadingId,
          chatId: chatStore.selectedChat._id,
          content: "Getting AI response...",
          sender: { _id: "ai", username: "AI Assistant" },
          createdAt: new Date().toISOString(),
          isRead: true,
          isAI: true,
          isLoading: true,
        };
        chatStore.messages.push(loadingMessage);

        try {
          const aiResponse = await chatStore.getAIResponse(aiPrompt);
          if (aiResponse) {
            // Replace the loading message with the actual AI response
            const index = chatStore.messages.findIndex(msg => msg._id === loadingId);
            if (index !== -1) {
              chatStore.messages.splice(index, 1, {
                _id: Date.now().toString(),
                chatId: chatStore.selectedChat._id,
                content: aiResponse,
                sender: { _id: "ai", username: "AI Assistant" },
                createdAt: new Date().toISOString(),
                isRead: true,
                isAI: true,
              });
            } else {
              chatStore.messages.push({
                _id: Date.now().toString(),
                chatId: chatStore.selectedChat._id,
                content: aiResponse,
                sender: { _id: "ai", username: "AI Assistant" },
                createdAt: new Date().toISOString(),
                isRead: true,
                isAI: true,
              });
            }
          }
        } catch (error) {
          console.error("Error getting AI response:", error);
          //toast.error("Error calling AI API");
          // Remove the loading message if error occurs
          chatStore.messages = chatStore.messages.filter(msg => msg._id !== loadingId);
        }
        return;
  }

  // Otherwise, send as a normal message.
  console.log("Sending message:", messageContent);
  try {
    chatStore.stopTyping();
    const response = await chatStore.sendMessage(messageContent);
    if (response && response.success) {
      console.log("Message sent successfully:", response.data);
      //toast.success("Message sent");
    }
    newMessage.value = "";
  } catch (error) {
    console.error("Error sending message:", error);
    if (error.response) {
      console.error("Server error response:", error.response.data);
    }
  }
    };

    // Helper function to format AI response (removes all HTML-like tags)
    const formatAIResponse = (input) => {
      let str = "";
        if (typeof input === "object" && input !== null) {
          // If input is an object and has a content property, use that.
          str = input.content || "";
        } else {
          str = String(input);
        }
        // Remove any content between <think> and </think> tags (including the tags)
        // This regex will match everything between the opening and closing tags (non-greedy).
        const withoutChain = str.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
        return withoutChain;
    };


    const startAIChat = async () => {
      try {
        console.log('[startAIChat] Launching AI chat...');
        const aiChat = await chatStore.createAIChat();
        if (aiChat) {
          await chatStore.selectChat(aiChat);
          console.log('[startAIChat] AI chat selected:', aiChat);
        }
      } catch (error) {
        console.error('[startAIChat] Error creating AI chat:', error);
      }
    };

    const hasAIChat = computed(() => {
      if (!authStore.user || !chatStore.chats) {
        // console.log('[hasAIChat] No user or chats available');
        return false;
      }
      // console.log('[hasAIChat] Checking for AI chat for user:', authStore.user._id);
      // Filter chats that are marked as AI chats
      const aiChats = chatStore.chats.filter(chat => chat.isAIChat === true);      
      // Check if any AI chat includes the current user's ID
      const exists = aiChats.some(chat => {
        return chat.participants.some(participant => {
          if (typeof participant === 'string') {
            return participant === authStore.user._id;
          } else if (participant && participant._id) {
            return participant._id.toString() === authStore.user._id.toString();
          }
          return false;
        });
      });      
      return exists;
    });


    const startTyping = () => {
      chatStore.startTyping();
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        stopTyping();
      }, 2000);
    };

    const stopTyping = () => {
      chatStore.stopTyping();
    };

    // Message editing/deletion methods
    const toggleMsgMenu = (msgId) => {
      msgMenuId.value = msgMenuId.value === msgId ? null : msgId;
    };

    const openEditModal = (msg) => {
      editingMsgId.value = msg._id;
      editedContent.value = msg.content;
      showEditModal.value = true;
      msgMenuId.value = null;
    };

    const cancelEditing = () => {
      editingMsgId.value = null;
      editedContent.value = "";
      showEditModal.value = false;
    };

    const saveEditedMessage = async (msgId) => {
      try {
        const updatedMsg = await chatStore.editMessage(msgId, editedContent.value);        
      } catch (error) {
        console.error("Error editing message:", error);       
      }
      cancelEditing();
    };

    const confirmDelete = async (msgId) => {
      if (confirm("Are you sure you want to delete this message?")) {
        try {
          await chatStore.deleteMessage(msgId);          
        } catch (error) {
          console.error("Error deleting message:", error);          
        }
      }
    };

    const triggerFileInput = () => {
      fileInput.value.click();
    };

    const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      console.log('[handleFileUpload] File selected:', file);
      try {
        await chatStore.sendMediaMessage(file);
      } catch (error) {
        console.error('[handleFileUpload] Error sending media message:', error);
      }
    };

    const isImage = (fileUrl) => {
      return /\.(jpe?g|png|gif)$/i.test(fileUrl);
    };

    const isVideo = (fileUrl) => {
      return /\.(mp4|webm|ogg)$/i.test(fileUrl);
    }; 

    const isAudio = (fileUrl) => {
      return /\.(mp3|wav|ogg|m4a)$/i.test(fileUrl);
    };


    const sortedChats = computed(() => {
      // Sort by the timestamp of the last message if available, otherwise by updatedAt or createdAt
      return [...chatStore.chats].sort((a, b) => {
        const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(a.updatedAt || a.createdAt);
        const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(b.updatedAt || b.createdAt);
        return bTime - aTime; // descending order: newer chats come first
      });
    });

    const startAudio = async () => {
      recording.value = true;
      recordingTime.value = 0;
      // Start a timer that updates every second
      recordingInterval = setInterval(() => {
        recordingTime.value += 1;
      }, 1000);  
      await chatStore.startAudioRecording();      
    };

    const stopAudio = () => {
      chatStore.stopAudioRecording();
      // Clear the timer
      clearInterval(recordingInterval);
      recording.value = false;
      
      // Show the sending indicator
      sendingVoiceNote.value = true;

      try {
         toast.info("Recording Done");
        } catch (error) {
          console.error("Error sending audio message:", error);
        } finally {
          // Once done, hide the sending indicator
          sendingVoiceNote.value = false;
        }
    };

    const cancelRecording = () => {
      clearInterval(recordingInterval);
      recording.value = false;
      chatStore.stopAudioRecording();
    };

    const startVoiceCall = async () => {
      await chatStore.startVoiceCall();
      // If a remote audio element exists, attach the remote stream when available
      watch(
        () => chatStore.remoteStream,
        (newStream) => {
          if (newStream && remoteAudio.value) {
            remoteAudio.value.srcObject = newStream;
          }
        }
      );
    };

    const hangUpVoiceCall = async () => {
      await chatStore.hangUpVoiceCall();
    };

     // Function to attach incoming call event listener
    const attachIncomingCallListener = (socket) => {
      socket.on('incomingVoiceCall', (data) => {
        console.log("Incoming call:", data);
        incomingCall.value = { ...data, callerName: data.callerName || 'Unknown Caller' };
      });
    };

    const acceptCall = () => {
      // Handle call acceptance (e.g., start the call, set up the RTCPeerConnection, etc.)
      console.log("Call accepted");
      incomingCall.value = null;
      // You may call a method from chatStore to proceed with the call setup
    };

    const declineCall = () => {
      console.log("Call declined");
      // Optionally, emit a socket event to notify the caller
      incomingCall.value = null;
    };
        

    return {
      chatStore,
      authStore,
      showCreateChatModal,
      newChatEmails,
      isGroupChat,
      groupName,
      createChatError,
      newMessage,
      createChat,
      closeCreateChatModal,
      sendMessage,
      startTyping,
      selectChat,
      typingIndicator: computed(() => Object.keys(chatStore.typingUsers).length > 0),
      isUserOnline,
      deleteChat: chatStore.deleteChat,
      acceptChat: chatStore.acceptChat,
      chatTitle: computed(() => {
        const chat = chatStore.selectedChat;
        if (!chat) return "";
         if (chat.isAIChat) {
            return "AI Chat";
        }
        return chat.isGroupChat
          ? chat.name
          : chat.participants?.filter((p) => p._id !== authStore.user?._id).map((p) => p.email).join(", ") || "Unknown Chat";
      }),
      lastSeenFormatted,
      selectedChatAvatar,
      onlineUsers,
      getInitials,
      formatTimestamp,
      toggleSettings,
      showSettings,
      logout,
      soundEnabled,
      toggleSound,
      messagesContainer,
      hoveredMsgId,
      msgMenuId,
      editingMsgId,
      openEditModal,
      editedContent,
      confirmDelete,
      toggleMsgMenu,
      showEditModal,
      cancelEditing,
      saveEditedMessage,
      stopTyping,
      triggerFileInput,
      handleFileUpload,
      fileInput,
      isImage,
      isVideo,
      isAudio,
      sortedChats,
      formatAIResponse,
      startAIChat,
      hasAIChat,
      startAudio,
      stopAudio,
      recording,
      recordingTime,
      sendingVoiceNote,
      mediaUploadProgress,
      cancelRecording,
      startVoiceCall,
      hangUpVoiceCall,
      remoteAudio,
      incomingCall,
      acceptCall,
      declineCall,
      callActive: computed(() => chatStore.callActive),
    };
  },
};
</script>

<style scoped>
.flex {
  display: flex;
}
.h-screen {
  height: 100vh;
}
.bg-gray-100 {
  background-color: #f7fafc;
}
.progress-container {
  margin: 10px 0;
  padding: 10px;
  background: #f3f3f3;
  border-radius: 5px;
  text-align: center;
}

.progress-bar {
  height: 8px;
  width: 100%;
  background: #ddd;
  border-radius: 4px;
  margin-top: 5px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #4caf50;
  transition: width 0.3s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.0s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.recording-indicator {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: fadeIn 0.3s ease-in-out;
}

.recording-content {
  display: flex;
  align-items: center;
}

.dot {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.cancel-btn {
  background: none;
  border: none;
  color: white;
  font-size: 14px;
  margin-left: 10px;
  cursor: pointer;
}

.cancel-btn:hover {
  color: #ff6b6b;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.record-btn {
  padding: 10px 15px;
  font-size: 16px;
  background: #007aff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  
}
</style>
