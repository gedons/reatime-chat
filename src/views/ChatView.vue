<template>
  <div class="flex h-screen bg-gradient-to-r from-gray-50 to-gray-100">
   
    <!-- Sidebar: Chat List -->
    <aside 
      ref="sidebarRef"
      class="transition-all duration-300 ease-in-out bg-white border-r border-gray-200 flex flex-col shadow-xl fixed md:relative h-screen z-20"
      :class="[
        isCollapsed ? 'w-16 md:w-20' : 'w-64 md:w-80',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
    <!-- Sidebar Header -->
    <div class="p-2 md:p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-between">
      <h1 class="text-xl md:text-2xl font-bold text-white truncate" v-show="!isCollapsed">Chats</h1>
      <div class="flex items-center space-x-2">
        <button
          @click="toggleSidebar"
          class="text-white hover:text-purple-200 transition-colors p-2"
        >
          <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              :d="isCollapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'"
            />
          </svg>
        </button>
        <button
          @click="toggleSidebar"
          class="md:hidden text-white hover:text-purple-200 p-2"
          v-show="!isCollapsed"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Chat List -->
    <div class="flex-1 overflow-y-auto p-1 md:p-2">
      <ul class="space-y-2">
        <li
          v-for="chat in sortedChats"
          :key="chat?._id"
          @click="selectChat(chat)"
          class="flex items-center p-2 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors duration-200"
          :class="{ 'bg-purple-50': chatStore.selectedChat?._id === chat?._id }"
        >
          <!-- Avatar/Icon -->
          <div class="relative flex-shrink-0 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-purple-500 text-white rounded-lg md:rounded-xl font-semibold shadow-sm text-xs md:text-base">
            <!-- ... (keep existing avatar content) ... -->
            {{ getInitials(chat?.participants?.filter(p => p._id !== authStore.user._id)[0]?.email) }}


            <span v-if="chat.isAIChat" class="text-white">
              <!-- <svg class="w-6 h-6 mb-1 mr-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 15C8.44771 15 8 15.4477 8 16C8 16.5523 8.44771 17 9 17C9.55229 17 10 16.5523 10 16C10 15.4477 9.55229 15 9 15Z" fill="#ffffff"></path> <path d="M14 16C14 15.4477 14.4477 15 15 15C15.5523 15 16 15.4477 16 16C16 16.5523 15.5523 17 15 17C14.4477 17 14 16.5523 14 16Z" fill="#ffffff"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C10.8954 1 10 1.89543 10 3C10 3.74028 10.4022 4.38663 11 4.73244V7H6C4.34315 7 3 8.34315 3 10V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V10C21 8.34315 19.6569 7 18 7H13V4.73244C13.5978 4.38663 14 3.74028 14 3C14 1.89543 13.1046 1 12 1ZM5 10C5 9.44772 5.44772 9 6 9H7.38197L8.82918 11.8944C9.16796 12.572 9.86049 13 10.618 13H13.382C14.1395 13 14.832 12.572 15.1708 11.8944L16.618 9H18C18.5523 9 19 9.44772 19 10V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V10ZM13.382 11L14.382 9H9.61803L10.618 11H13.382Z" fill="#ffffff"></path> <path d="M1 14C0.447715 14 0 14.4477 0 15V17C0 17.5523 0.447715 18 1 18C1.55228 18 2 17.5523 2 17V15C2 14.4477 1.55228 14 1 14Z" fill="#ffffff"></path> <path d="M22 15C22 14.4477 22.4477 14 23 14C23.5523 14 24 14.4477 24 15V17C24 17.5523 23.5523 18 23 18C22.4477 18 22 17.5523 22 17V15Z" fill="#ffffff"></path> </g></svg> -->
              <svg class="w-6 h-6 mb-1 mr-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6.88575 6.05713C5.49717 6.05713 4.37146 7.18284 4.37146 8.57141V18.2857C4.37146 19.6743 5.49717 20.8 6.88575 20.8H17.1715C18.56 20.8 19.6857 19.6743 19.6857 18.2857V8.57141C19.6857 7.18284 18.56 6.05713 17.1715 6.05713H6.88575Z" fill="url(#paint0_linear)"></path> <g opacity="0.3"> <path opacity="0.3" d="M17.1714 6.05713H16.5143V8.15999C16.5143 8.31999 16.64 8.4457 16.8 8.4457H19.68C19.6171 7.11427 18.5143 6.05713 17.1714 6.05713Z" fill="#4F0940"></path> <path opacity="0.3" d="M7.59998 6.05713V8.15999C7.59998 8.31999 7.72569 8.4457 7.88569 8.4457H16.1143C16.2743 8.4457 16.4 8.31999 16.4 8.15999V6.05713H7.59998Z" fill="#4F0940"></path> <path opacity="0.3" d="M6.88577 6.05713C5.54291 6.05713 4.44005 7.11427 4.3772 8.4457H7.20006C7.36006 8.4457 7.48577 8.31999 7.48577 8.15999V6.05713H6.88577Z" fill="#4F0940"></path> <path opacity="0.3" d="M12.0573 8.84577V12.5543L13.3144 15.8515C13.3373 15.9029 13.3258 15.9601 13.2973 16.0115C13.2687 16.0629 13.2115 16.0858 13.1544 16.0858H12.343C12.183 16.0858 12.0573 16.2115 12.0573 16.3715V17.2229H15.6858V17.8515C15.6858 17.9201 15.6801 17.9943 15.6744 18.0686L15.6687 18.1315H19.6858V8.57149C19.6858 8.56577 19.6858 8.56006 19.6858 8.56006H12.343C12.183 8.56006 12.0573 8.68577 12.0573 8.84577Z" fill="#4F0940"></path> <path opacity="0.3" d="M19.6858 18.2397H15.703L15.6915 18.2855C15.4858 19.1883 14.6687 19.8455 13.743 19.8455H12.0573V20.7997H17.1715C18.5601 20.7997 19.6858 19.674 19.6858 18.2855V18.2397Z" fill="#4F0940"></path> <path opacity="0.3" d="M11.6572 8.56006H4.37146C4.37146 8.56577 4.37146 8.57149 4.37146 8.57149V18.1258H8.33146L8.32574 18.0629C8.32003 17.9886 8.31432 17.9143 8.31432 17.8458V17.2172H11.9429V16.3658C11.9429 16.2058 11.8172 16.0801 11.6572 16.0801H10.8457C10.7886 16.0801 10.7372 16.0515 10.7029 16.0058C10.6686 15.9601 10.6629 15.9029 10.6857 15.8458L11.9429 12.5486V8.84006C11.9429 8.68577 11.8172 8.56006 11.6572 8.56006Z" fill="#4F0940"></path> <path opacity="0.3" d="M8.3086 18.2855L8.29717 18.2397H4.37146V18.2855C4.37146 19.674 5.49717 20.7997 6.88574 20.7997H11.9429V19.8455H10.2572C9.33146 19.8455 8.5086 19.194 8.3086 18.2855Z" fill="#4F0940"></path> </g> <path d="M21.1429 11.1998V15.6569C21.1429 15.8455 20.9886 15.9998 20.8 15.9998H20.3429C20.1543 15.9998 20 15.8455 20 15.6569V11.1998C20 11.0112 20.1543 10.8569 20.3429 10.8569H20.8C20.9886 10.8569 21.1429 11.0112 21.1429 11.1998Z" fill="url(#paint1_linear)"></path> <path d="M4.00003 11.1998V15.6569C4.00003 15.8455 3.84575 15.9998 3.65718 15.9998H3.20003C3.01146 15.9998 2.85718 15.8455 2.85718 15.6569V11.1998C2.85718 11.0112 3.01146 10.8569 3.20003 10.8569H3.65718C3.84575 10.8569 4.00003 11.0112 4.00003 11.1998Z" fill="url(#paint2_linear)"></path> <path d="M20 11.1998V15.6569C20 15.8455 20.1543 15.9998 20.3429 15.9998H20.8C20.9886 15.9998 21.1429 15.8455 21.1429 15.6569V15.4112C20.7029 15.4112 20.3429 15.0512 20.3429 14.6112V10.8569C20.1543 10.8569 20 11.0112 20 11.1998Z" fill="url(#paint3_linear)"></path> <path d="M15.7485 18.2969C15.5428 19.2169 14.72 19.9026 13.7428 19.9026H12.1143V21.154H17.1428C18.72 21.154 20 19.874 20 18.2969H15.7485Z" fill="url(#paint4_linear)"></path> <path d="M17.1428 5.72559H16.5714V8.15416C16.5714 8.27987 16.6743 8.38273 16.8 8.38273H19.9943C19.8914 6.90273 18.6514 5.72559 17.1428 5.72559Z" fill="url(#paint5_linear)"></path> <path d="M4.00574 8.38844H7.20002C7.32574 8.38844 7.42859 8.28558 7.42859 8.15987V5.72559H6.85716C5.34859 5.72559 4.10859 6.90273 4.00574 8.38844Z" fill="url(#paint6_linear)"></path> <path d="M7.8858 8.38844H16.1144C16.2401 8.38844 16.3429 8.28558 16.3429 8.15987V5.72559H7.65723V8.15416C7.65723 8.28558 7.76008 8.38844 7.8858 8.38844Z" fill="url(#paint7_linear)"></path> <path d="M8.25714 17.8453V17.1596H11.8857V16.3653C11.8857 16.2396 11.7829 16.1367 11.6571 16.1367H10.8457C10.6857 16.1367 10.5771 15.9767 10.6343 15.8281L11.8914 12.5424V8.84527C11.8914 8.71956 11.7886 8.6167 11.6629 8.6167H4V18.0738H8.26857C8.26286 17.9996 8.25714 17.9253 8.25714 17.8453Z" fill="url(#paint8_linear)"></path> <path d="M15.7428 17.8453V17.1596H12.1142V16.3653C12.1142 16.2396 12.2171 16.1367 12.3428 16.1367H13.1542C13.3142 16.1367 13.4228 15.9767 13.3657 15.8281L12.1085 12.5424V8.84527C12.1085 8.71956 12.2114 8.6167 12.3371 8.6167H19.9942V18.0738H15.7257C15.7371 17.9996 15.7428 17.9253 15.7428 17.8453Z" fill="url(#paint9_linear)"></path> <path d="M8.25143 18.2969C8.45714 19.2169 9.28 19.9026 10.2571 19.9026H11.8857V21.154H6.85714C5.28 21.154 4 19.874 4 18.2969H8.25143Z" fill="url(#paint10_linear)"></path> <path d="M8.38862 14.3712C9.65098 14.3712 10.6743 13.3479 10.6743 12.0855C10.6743 10.8232 9.65098 9.7998 8.38862 9.7998C7.12625 9.7998 6.10291 10.8232 6.10291 12.0855C6.10291 13.3479 7.12625 14.3712 8.38862 14.3712Z" fill="url(#paint11_linear)"></path> <path d="M8.38859 14.2286C9.57205 14.2286 10.5314 13.2692 10.5314 12.0857C10.5314 10.9023 9.57205 9.94287 8.38859 9.94287C7.20512 9.94287 6.24573 10.9023 6.24573 12.0857C6.24573 13.2692 7.20512 14.2286 8.38859 14.2286Z" fill="url(#paint12_linear)"></path> <path d="M8.38855 14.0854C9.49312 14.0854 10.3885 13.19 10.3885 12.0854C10.3885 10.9809 9.49312 10.0854 8.38855 10.0854C7.28398 10.0854 6.38855 10.9809 6.38855 12.0854C6.38855 13.19 7.28398 14.0854 8.38855 14.0854Z" fill="url(#paint13_linear)"></path> <path d="M8.38858 10.4854C7.50286 10.4854 6.78857 11.1996 6.78857 12.0854C6.78857 12.9711 7.50286 13.6853 8.38858 13.6853C9.27429 13.6853 9.98858 12.9711 9.98858 12.0854C9.98858 11.1996 9.26858 10.4854 8.38858 10.4854ZM8.38858 13.3996C7.66286 13.3996 7.07429 12.8111 7.07429 12.0854C7.07429 11.3596 7.66286 10.7711 8.38858 10.7711C9.11429 10.7711 9.70286 11.3596 9.70286 12.0854C9.70286 12.8111 9.11429 13.3996 8.38858 13.3996Z" fill="url(#paint14_linear)"></path> <path d="M8.24585 11.1429V13.0286C8.24585 13.1086 8.30871 13.1714 8.38871 13.1714C8.4687 13.1714 8.53156 13.1086 8.53156 13.0286V11.1429C8.53156 11.0629 8.4687 11 8.38871 11C8.30871 11 8.24585 11.0629 8.24585 11.1429Z" fill="url(#paint15_linear)"></path> <path d="M7.56006 11.4851V12.6851C7.56006 12.7651 7.62292 12.828 7.70292 12.828C7.78292 12.828 7.84577 12.7651 7.84577 12.6851V11.4851C7.84577 11.4051 7.78292 11.3423 7.70292 11.3423C7.62292 11.3423 7.56006 11.4051 7.56006 11.4851Z" fill="url(#paint16_linear)"></path> <path d="M9.21723 11.4851V12.6851C9.21723 12.7651 9.15437 12.828 9.07437 12.828C8.99438 12.828 8.93152 12.7651 8.93152 12.6851V11.4851C8.93152 11.4051 8.99438 11.3423 9.07437 11.3423C9.14866 11.3423 9.21723 11.4051 9.21723 11.4851Z" fill="url(#paint17_linear)"></path> <path d="M8.38864 10.8797C9.20006 10.8797 9.91435 11.1826 10.3372 11.6397C10.1315 10.7483 9.33721 10.0854 8.38864 10.0854C7.44006 10.0854 6.64006 10.7483 6.44006 11.6397C6.86292 11.1826 7.57721 10.8797 8.38864 10.8797Z" fill="url(#paint18_linear)"></path> <path d="M15.6687 14.3712C16.931 14.3712 17.9544 13.3479 17.9544 12.0855C17.9544 10.8232 16.931 9.7998 15.6687 9.7998C14.4063 9.7998 13.3829 10.8232 13.3829 12.0855C13.3829 13.3479 14.4063 14.3712 15.6687 14.3712Z" fill="url(#paint19_linear)"></path> <path d="M15.6686 14.2286C16.8521 14.2286 17.8115 13.2692 17.8115 12.0857C17.8115 10.9023 16.8521 9.94287 15.6686 9.94287C14.4851 9.94287 13.5258 10.9023 13.5258 12.0857C13.5258 13.2692 14.4851 14.2286 15.6686 14.2286Z" fill="url(#paint20_linear)"></path> <path d="M15.6687 14.0854C16.7733 14.0854 17.6687 13.19 17.6687 12.0854C17.6687 10.9809 16.7733 10.0854 15.6687 10.0854C14.5641 10.0854 13.6687 10.9809 13.6687 12.0854C13.6687 13.19 14.5641 14.0854 15.6687 14.0854Z" fill="url(#paint21_linear)"></path> <path d="M14.0686 12.0854C14.0686 12.9711 14.7829 13.6853 15.6686 13.6853C16.5543 13.6853 17.2686 12.9711 17.2686 12.0854C17.2686 11.1996 16.5543 10.4854 15.6686 10.4854C14.7886 10.4854 14.0686 11.1996 14.0686 12.0854ZM14.3543 12.0854C14.3543 11.3596 14.9429 10.7711 15.6686 10.7711C16.3943 10.7711 16.9829 11.3596 16.9829 12.0854C16.9829 12.8111 16.3943 13.3996 15.6686 13.3996C14.9429 13.3996 14.3543 12.8111 14.3543 12.0854Z" fill="url(#paint22_linear)"></path> <path d="M15.8116 11.1429V13.0286C15.8116 13.1086 15.7487 13.1714 15.6687 13.1714C15.5887 13.1714 15.5259 13.1086 15.5259 13.0286V11.1429C15.5259 11.0629 15.5887 11 15.6687 11C15.7487 11 15.8116 11.0629 15.8116 11.1429Z" fill="url(#paint23_linear)"></path> <path d="M16.4973 11.4851V12.6851C16.4973 12.7651 16.4344 12.828 16.3544 12.828C16.2744 12.828 16.2115 12.7651 16.2115 12.6851V11.4851C16.2115 11.4051 16.2744 11.3423 16.3544 11.3423C16.4344 11.3423 16.4973 11.4051 16.4973 11.4851Z" fill="url(#paint24_linear)"></path> <path d="M14.8401 11.4851V12.6851C14.8401 12.7651 14.9029 12.828 14.9829 12.828C15.0629 12.828 15.1258 12.7651 15.1258 12.6851V11.4851C15.1258 11.4051 15.0629 11.3423 14.9829 11.3423C14.9087 11.3423 14.8401 11.4051 14.8401 11.4851Z" fill="url(#paint25_linear)"></path> <path d="M15.6687 10.8797C14.8572 10.8797 14.143 11.1826 13.7201 11.6397C13.9258 10.7483 14.7201 10.0854 15.6687 10.0854C16.6172 10.0854 17.4172 10.7483 17.6172 11.6397C17.1944 11.1826 16.4801 10.8797 15.6687 10.8797Z" fill="url(#paint26_linear)"></path> <path d="M6.60583 12.8625C6.90298 13.5482 7.58869 14.0282 8.38869 14.0282C9.46298 14.0282 10.3316 13.1596 10.3316 12.0853C10.3316 11.9939 10.3258 11.9025 10.3144 11.811C8.46298 11.8682 8.40584 12.9539 6.60583 12.8625Z" fill="url(#paint27_linear)"></path> <path d="M13.8916 12.8625C14.1887 13.5482 14.8745 14.0282 15.6745 14.0282C16.7487 14.0282 17.6173 13.1596 17.6173 12.0853C17.6173 11.9939 17.6116 11.9025 17.6002 11.811C15.7487 11.8682 15.6916 12.9539 13.8916 12.8625Z" fill="url(#paint28_linear)"></path> <path d="M12 12.8853L10.8457 15.9081H13.16L12 12.8853Z" fill="url(#paint29_linear)"></path> <path d="M12 15.9081V12.8853L13.1543 15.9081H12Z" fill="url(#paint30_linear)"></path> <path d="M8.48572 17.3882V17.8453C8.48572 18.851 9.30858 19.6739 10.3143 19.6739H13.7429C14.7486 19.6739 15.5714 18.851 15.5714 17.8453V17.3882H8.48572Z" fill="url(#paint31_linear)"></path> <path d="M15.3372 18.1884C15.3601 18.0798 15.3715 17.9655 15.3715 17.8455V17.5884H8.68579V17.8455C8.68579 17.9655 8.69722 18.0798 8.72008 18.1884H15.3372Z" fill="url(#paint32_radial)"></path> <path d="M8.48572 17.8453C8.48572 17.8453 9.31429 17.7139 12 17.7139C14.6857 17.7139 15.5714 17.8453 15.5714 17.8453V17.3882H8.48572V17.8453Z" fill="url(#paint33_linear)"></path> <path d="M15.0058 18.874H9.05151C9.34866 19.2397 9.8058 19.474 10.3144 19.474H13.7429C14.2515 19.474 14.7029 19.2397 15.0058 18.874Z" fill="url(#paint34_radial)"></path> <path d="M12.0285 5.91984C11.56 5.91984 11.2457 5.89699 11.4285 5.46841C11.5257 5.23413 11.5257 4.97127 11.4285 4.7427C11.2457 4.31413 11.56 3.83984 12.0285 3.83984C12.4971 3.83984 12.8114 4.31413 12.6285 4.7427C12.5314 4.97699 12.5314 5.23984 12.6285 5.46841C12.8114 5.89699 12.4971 5.91984 12.0285 5.91984Z" fill="url(#paint35_linear)"></path> <path d="M11.3772 4.42874C11.3715 4.5316 11.3829 4.63446 11.4286 4.73731C11.4572 4.80589 11.4801 4.88017 11.4915 4.95446C11.7601 5.18874 12.0801 5.16017 12.2058 5.10874C12.3544 5.0516 12.5086 5.60589 12.0458 5.85731C12.0058 5.88017 12.0058 5.92017 12.0286 5.92017C12.4972 5.92017 12.8115 5.89731 12.6286 5.46874C12.5315 5.23446 12.5315 4.9716 12.6286 4.74303C12.6915 4.60017 12.6915 4.4516 12.6572 4.32017L11.9429 4.10303L11.3772 4.42874Z" fill="url(#paint36_linear)"></path> <path d="M12.0286 4.91408C12.5966 4.91408 13.0571 4.45357 13.0571 3.88551C13.0571 3.31744 12.5966 2.85693 12.0286 2.85693C11.4605 2.85693 11 3.31744 11 3.88551C11 4.45357 11.4605 4.91408 12.0286 4.91408Z" fill="#FF0000"></path> <path d="M12.0286 4.91408C12.5966 4.91408 13.0571 4.45357 13.0571 3.88551C13.0571 3.31744 12.5966 2.85693 12.0286 2.85693C11.4605 2.85693 11 3.31744 11 3.88551C11 4.45357 11.4605 4.91408 12.0286 4.91408Z" fill="url(#paint37_linear)"></path> <path opacity="0.75" d="M12.0285 4.73098C12.4955 4.73098 12.8742 4.35234 12.8742 3.88526C12.8742 3.41819 12.4955 3.03955 12.0285 3.03955C11.5614 3.03955 11.1827 3.41819 11.1827 3.88526C11.1827 4.35234 11.5614 4.73098 12.0285 4.73098Z" fill="url(#paint38_radial)"></path> <path d="M4.00003 11.1998V15.6569C4.00003 15.8455 3.84575 15.9998 3.65718 15.9998H3.20003C3.01146 15.9998 2.85718 15.8455 2.85718 15.6569V15.4112C3.29718 15.4112 3.65718 15.0512 3.65718 14.6112V10.8569C3.84575 10.8569 4.00003 11.0112 4.00003 11.1998Z" fill="url(#paint39_linear)"></path> <path d="M12.96 3.45117C12.76 4.09117 12.16 4.55974 11.4514 4.55974C11.3771 4.55974 11.3086 4.55403 11.24 4.5426C11.4286 4.77117 11.7143 4.91403 12.0286 4.91403C12.5943 4.91403 13.0571 4.45117 13.0571 3.88546C13.0571 3.73117 13.0229 3.5826 12.96 3.45117Z" fill="url(#paint40_linear)"></path> <defs> <linearGradient id="paint0_linear" x1="12.0286" y1="20.9524" x2="12.0286" y2="6.23259" gradientUnits="userSpaceOnUse"> <stop stop-color="#008EE6"></stop> <stop offset="0.3967" stop-color="#7000A3"></stop> <stop offset="1" stop-color="#17BBFE"></stop> </linearGradient> <linearGradient id="paint1_linear" x1="20.5714" y1="15.6093" x2="20.5714" y2="12.425" gradientUnits="userSpaceOnUse"> <stop stop-color="#BD2719"></stop> <stop offset="0.2151" stop-color="#D41A10"></stop> <stop offset="0.5049" stop-color="#EC0C07"></stop> <stop offset="0.774" stop-color="#FA0302"></stop> <stop offset="1" stop-color="#FF0000"></stop> </linearGradient> <linearGradient id="paint2_linear" x1="3.42861" y1="14.5522" x2="3.42861" y2="11.3476" gradientUnits="userSpaceOnUse"> <stop stop-color="#BD2719"></stop> <stop offset="0.2151" stop-color="#D41A10"></stop> <stop offset="0.5049" stop-color="#EC0C07"></stop> <stop offset="0.774" stop-color="#FA0302"></stop> <stop offset="1" stop-color="#FF0000"></stop> </linearGradient> <linearGradient id="paint3_linear" x1="20.5714" y1="17.3331" x2="20.5714" y2="7.78339" gradientUnits="userSpaceOnUse"> <stop stop-color="#612D5B"></stop> <stop offset="0.1479" stop-color="#872245"></stop> <stop offset="0.3388" stop-color="#B2162C"></stop> <stop offset="0.5244" stop-color="#D30C19"></stop> <stop offset="0.7005" stop-color="#EB060B"></stop> <stop offset="0.8633" stop-color="#FA0103"></stop> <stop offset="1" stop-color="#FF0000"></stop> </linearGradient> <linearGradient id="paint4_linear" x1="16.0571" y1="16.1521" x2="16.0571" y2="21.3381" gradientUnits="userSpaceOnUse"> <stop stop-color="#008EE6"></stop> <stop offset="0.4966" stop-color="#80DAFE"></stop> <stop offset="0.5684" stop-color="#76D5FB"></stop> <stop offset="0.6888" stop-color="#5CC8F3"></stop> <stop offset="0.8428" stop-color="#32B2E6"></stop> <stop offset="1" stop-color="#0099D6"></stop> </linearGradient> <linearGradient id="paint5_linear" x1="18.2818" y1="9.23796" x2="18.2818" y2="4.98266" gradientUnits="userSpaceOnUse"> <stop stop-color="#008EE6"></stop> <stop offset="0.4966" stop-color="#80DAFE"></stop> <stop offset="0.5684" stop-color="#76D5FB"></stop> <stop offset="0.6888" stop-color="#5CC8F3"></stop> <stop offset="0.8428" stop-color="#32B2E6"></stop> <stop offset="1" stop-color="#0099D6"></stop> </linearGradient> <linearGradient id="paint6_linear" x1="5.7182" y1="9.23796" x2="5.7182" y2="4.98266" gradientUnits="userSpaceOnUse"> <stop stop-color="#008EE6"></stop> <stop offset="0.4966" stop-color="#80DAFE"></stop> <stop offset="0.5684" stop-color="#76D5FB"></stop> <stop offset="0.6888" stop-color="#5CC8F3"></stop> <stop offset="0.8428" stop-color="#32B2E6"></stop> <stop offset="1" stop-color="#0099D6"></stop> </linearGradient> <linearGradient id="paint7_linear" x1="12.0001" y1="8.43796" x2="12.0001" y2="5.29303" gradientUnits="userSpaceOnUse"> <stop stop-color="#BBCACC"></stop> <stop offset="0.4724" stop-color="white"></stop> <stop offset="1" stop-color="#99AFB3"></stop> </linearGradient> <linearGradient id="paint8_linear" x1="11.754" y1="13.3424" x2="4.0206" y2="13.3424" gradientUnits="userSpaceOnUse"> <stop stop-color="#BBCACC"></stop> <stop offset="0.1579" stop-color="#C0CED0"></stop> <stop offset="0.3418" stop-color="#CED9DA"></stop> <stop offset="0.538" stop-color="#E5EBEC"></stop> <stop offset="0.7044" stop-color="white"></stop> <stop offset="1" stop-color="#99AFB3"></stop> </linearGradient> <linearGradient id="paint9_linear" x1="12.2459" y1="13.3424" x2="19.9794" y2="13.3424" gradientUnits="userSpaceOnUse"> <stop stop-color="#BBCACC"></stop> <stop offset="0.1579" stop-color="#C0CED0"></stop> <stop offset="0.3418" stop-color="#CED9DA"></stop> <stop offset="0.538" stop-color="#E5EBEC"></stop> <stop offset="0.7044" stop-color="white"></stop> <stop offset="1" stop-color="#99AFB3"></stop> </linearGradient> <linearGradient id="paint10_linear" x1="7.94286" y1="16.1521" x2="7.94286" y2="21.3381" gradientUnits="userSpaceOnUse"> <stop stop-color="#008EE6"></stop> <stop offset="0.4966" stop-color="#80DAFE"></stop> <stop offset="0.5684" stop-color="#76D5FB"></stop> <stop offset="0.6888" stop-color="#5CC8F3"></stop> <stop offset="0.8428" stop-color="#32B2E6"></stop> <stop offset="1" stop-color="#0099D6"></stop> </linearGradient> <linearGradient id="paint11_linear" x1="9.82209" y1="14.246" x2="6.3078" y2="8.96024" gradientUnits="userSpaceOnUse"> <stop stop-color="#BD2719"></stop> <stop offset="0.2151" stop-color="#D41A10"></stop> <stop offset="0.5049" stop-color="#EC0C07"></stop> <stop offset="0.774" stop-color="#FA0302"></stop> <stop offset="1" stop-color="#FF0000"></stop> </linearGradient> <linearGradient id="paint12_linear" x1="7.31603" y1="8.17891" x2="9.01127" y2="14.3694" gradientUnits="userSpaceOnUse"> <stop stop-color="#612D5B"></stop> <stop offset="0.1479" stop-color="#872245"></stop> <stop offset="0.3388" stop-color="#B2162C"></stop> <stop offset="0.5244" stop-color="#D30C19"></stop> <stop offset="0.7005" stop-color="#EB060B"></stop> <stop offset="0.8633" stop-color="#FA0103"></stop> <stop offset="1" stop-color="#FF0000"></stop> </linearGradient> <linearGradient id="paint13_linear" x1="8.38604" y1="10.295" x2="8.38604" y2="14.1117" gradientUnits="userSpaceOnUse"> <stop stop-color="#008EE6"></stop> <stop offset="1" stop-color="#391838"></stop> </linearGradient> <linearGradient id="paint14_linear" x1="8.38607" y1="14.8676" x2="8.38607" y2="10.7437" gradientUnits="userSpaceOnUse"> <stop stop-color="#008EE6"></stop> <stop offset="1" stop-color="white"></stop> </linearGradient> <linearGradient id="paint15_linear" x1="8.38619" y1="11.0524" x2="8.38619" y2="13.2897" gradientUnits="userSpaceOnUse"> <stop stop-color="#008EE6"></stop> <stop offset="0.051059" stop-color="#34A5EB"></stop> <stop offset="0.1108" stop-color="#69BDF0"></stop> <stop offset="0.1713" stop-color="#97D1F5"></stop> <stop offset="0.2313" stop-color="#BCE2F8"></stop> <stop offset="0.2908" stop-color="#DAEEFB"></stop> <stop offset="0.3497" stop-color="#EEF8FD"></stop> <stop offset="0.4076" stop-color="#FBFDFF"></stop> <stop offset="0.4634" stop-color="white"></stop> <stop offset="0.5314" stop-color="#FBFBFB"></stop> <stop offset="0.6019" stop-color="#F1EEF1"></stop> <stop offset="0.6736" stop-color="#DFDADF"></stop> <stop offset="0.7461" stop-color="#C6BDC6"></stop> <stop offset="0.8193" stop-color="#A697A5"></stop> <stop offset="0.893" stop-color="#7F697E"></stop> <stop offset="0.9657" stop-color="#513450"></stop> <stop offset="1" stop-color="#391838"></stop> </linearGradient> <linearGradient id="paint16_linear" x1="7.7004" y1="11.3518" x2="7.7004" y2="12.9389" gradientUnits="userSpaceOnUse"> <stop stop-color="#008EE6"></stop> <stop offset="0.051059" stop-color="#34A5EB"></stop> <stop offset="0.1108" stop-color="#69BDF0"></stop> <stop offset="0.1713" stop-color="#97D1F5"></stop> <stop offset="0.2313" stop-color="#BCE2F8"></stop> <stop offset="0.2908" stop-color="#DAEEFB"></stop> <stop offset="0.3497" stop-color="#EEF8FD"></stop> <stop offset="0.4076" stop-color="#FBFDFF"></stop> <stop offset="0.4634" stop-color="white"></stop> <stop offset="0.5314" stop-color="#FBFBFB"></stop> <stop offset="0.6019" stop-color="#F1EEF1"></stop> <stop offset="0.6736" stop-color="#DFDADF"></stop> <stop offset="0.7461" stop-color="#C6BDC6"></stop> <stop offset="0.8193" stop-color="#A697A5"></stop> <stop offset="0.893" stop-color="#7F697E"></stop> <stop offset="0.9657" stop-color="#513450"></stop> <stop offset="1" stop-color="#391838"></stop> </linearGradient> <linearGradient id="paint17_linear" x1="9.07186" y1="11.4161" x2="9.07186" y2="12.976" gradientUnits="userSpaceOnUse"> <stop stop-color="#008EE6"></stop> <stop offset="0.051059" stop-color="#34A5EB"></stop> <stop offset="0.1108" stop-color="#69BDF0"></stop> <stop offset="0.1713" stop-color="#97D1F5"></stop> <stop offset="0.2313" stop-color="#BCE2F8"></stop> <stop offset="0.2908" stop-color="#DAEEFB"></stop> <stop offset="0.3497" stop-color="#EEF8FD"></stop> <stop offset="0.4076" stop-color="#FBFDFF"></stop> <stop offset="0.4634" stop-color="white"></stop> <stop offset="0.5314" stop-color="#FBFBFB"></stop> <stop offset="0.6019" stop-color="#F1EEF1"></stop> <stop offset="0.6736" stop-color="#DFDADF"></stop> <stop offset="0.7461" stop-color="#C6BDC6"></stop> <stop offset="0.8193" stop-color="#A697A5"></stop> <stop offset="0.893" stop-color="#7F697E"></stop> <stop offset="0.9657" stop-color="#513450"></stop> <stop offset="1" stop-color="#391838"></stop> </linearGradient> <linearGradient id="paint18_linear" x1="8.38613" y1="9.94258" x2="8.38613" y2="13.0483" gradientUnits="userSpaceOnUse"> <stop stop-color="#391838"></stop> <stop offset="1" stop-color="#391838" stop-opacity="0"></stop> </linearGradient> <linearGradient id="paint19_linear" x1="14.2352" y1="14.246" x2="17.7495" y2="8.96023" gradientUnits="userSpaceOnUse"> <stop stop-color="#BD2719"></stop> <stop offset="0.2151" stop-color="#D41A10"></stop> <stop offset="0.5049" stop-color="#EC0C07"></stop> <stop offset="0.774" stop-color="#FA0302"></stop> <stop offset="1" stop-color="#FF0000"></stop> </linearGradient> <linearGradient id="paint20_linear" x1="16.7412" y1="8.17891" x2="15.0459" y2="14.3694" gradientUnits="userSpaceOnUse"> <stop stop-color="#612D5B"></stop> <stop offset="0.1479" stop-color="#872245"></stop> <stop offset="0.3388" stop-color="#B2162C"></stop> <stop offset="0.5244" stop-color="#D30C19"></stop> <stop offset="0.7005" stop-color="#EB060B"></stop> <stop offset="0.8633" stop-color="#FA0103"></stop> <stop offset="1" stop-color="#FF0000"></stop> </linearGradient> <linearGradient id="paint21_linear" x1="15.6712" y1="10.295" x2="15.6712" y2="14.1117" gradientUnits="userSpaceOnUse"> <stop stop-color="#008EE6"></stop> <stop offset="1" stop-color="#391838"></stop> </linearGradient> <linearGradient id="paint22_linear" x1="15.6711" y1="14.8676" x2="15.6711" y2="10.7437" gradientUnits="userSpaceOnUse"> <stop stop-color="#008EE6"></stop> <stop offset="1" stop-color="white"></stop> </linearGradient> <linearGradient id="paint23_linear" x1="15.6713" y1="11.0524" x2="15.6713" y2="13.2897" gradientUnits="userSpaceOnUse"> <stop stop-color="#008EE6"></stop> <stop offset="0.051059" stop-color="#34A5EB"></stop> <stop offset="0.1108" stop-color="#69BDF0"></stop> <stop offset="0.1713" stop-color="#97D1F5"></stop> <stop offset="0.2313" stop-color="#BCE2F8"></stop> <stop offset="0.2908" stop-color="#DAEEFB"></stop> <stop offset="0.3497" stop-color="#EEF8FD"></stop> <stop offset="0.4076" stop-color="#FBFDFF"></stop> <stop offset="0.4634" stop-color="white"></stop> <stop offset="0.5314" stop-color="#FBFBFB"></stop> <stop offset="0.6019" stop-color="#F1EEF1"></stop> <stop offset="0.6736" stop-color="#DFDADF"></stop> <stop offset="0.7461" stop-color="#C6BDC6"></stop> <stop offset="0.8193" stop-color="#A697A5"></stop> <stop offset="0.893" stop-color="#7F697E"></stop> <stop offset="0.9657" stop-color="#513450"></stop> <stop offset="1" stop-color="#391838"></stop> </linearGradient> <linearGradient id="paint24_linear" x1="16.3569" y1="11.3518" x2="16.3569" y2="12.9389" gradientUnits="userSpaceOnUse"> <stop stop-color="#008EE6"></stop> <stop offset="0.051059" stop-color="#34A5EB"></stop> <stop offset="0.1108" stop-color="#69BDF0"></stop> <stop offset="0.1713" stop-color="#97D1F5"></stop> <stop offset="0.2313" stop-color="#BCE2F8"></stop> <stop offset="0.2908" stop-color="#DAEEFB"></stop> <stop offset="0.3497" stop-color="#EEF8FD"></stop> <stop offset="0.4076" stop-color="#FBFDFF"></stop> <stop offset="0.4634" stop-color="white"></stop> <stop offset="0.5314" stop-color="#FBFBFB"></stop> <stop offset="0.6019" stop-color="#F1EEF1"></stop> <stop offset="0.6736" stop-color="#DFDADF"></stop> <stop offset="0.7461" stop-color="#C6BDC6"></stop> <stop offset="0.8193" stop-color="#A697A5"></stop> <stop offset="0.893" stop-color="#7F697E"></stop> <stop offset="0.9657" stop-color="#513450"></stop> <stop offset="1" stop-color="#391838"></stop> </linearGradient> <linearGradient id="paint25_linear" x1="14.9855" y1="11.4161" x2="14.9855" y2="12.976" gradientUnits="userSpaceOnUse"> <stop stop-color="#008EE6"></stop> <stop offset="0.051059" stop-color="#34A5EB"></stop> <stop offset="0.1108" stop-color="#69BDF0"></stop> <stop offset="0.1713" stop-color="#97D1F5"></stop> <stop offset="0.2313" stop-color="#BCE2F8"></stop> <stop offset="0.2908" stop-color="#DAEEFB"></stop> <stop offset="0.3497" stop-color="#EEF8FD"></stop> <stop offset="0.4076" stop-color="#FBFDFF"></stop> <stop offset="0.4634" stop-color="white"></stop> <stop offset="0.5314" stop-color="#FBFBFB"></stop> <stop offset="0.6019" stop-color="#F1EEF1"></stop> <stop offset="0.6736" stop-color="#DFDADF"></stop> <stop offset="0.7461" stop-color="#C6BDC6"></stop> <stop offset="0.8193" stop-color="#A697A5"></stop> <stop offset="0.893" stop-color="#7F697E"></stop> <stop offset="0.9657" stop-color="#513450"></stop> <stop offset="1" stop-color="#391838"></stop> </linearGradient> <linearGradient id="paint26_linear" x1="15.6712" y1="9.94258" x2="15.6712" y2="13.0483" gradientUnits="userSpaceOnUse"> <stop stop-color="#391838"></stop> <stop offset="1" stop-color="#391838" stop-opacity="0"></stop> </linearGradient> <linearGradient id="paint27_linear" x1="7.82504" y1="9.67973" x2="8.59646" y2="12.9226" gradientUnits="userSpaceOnUse"> <stop stop-color="white"></stop> <stop offset="1" stop-color="white" stop-opacity="0"></stop> </linearGradient> <linearGradient id="paint28_linear" x1="15.1101" y1="9.67973" x2="15.8815" y2="12.9226" gradientUnits="userSpaceOnUse"> <stop stop-color="white"></stop> <stop offset="1" stop-color="white" stop-opacity="0"></stop> </linearGradient> <linearGradient id="paint29_linear" x1="12.44" y1="16.3221" x2="10.6876" y2="13.0078" gradientUnits="userSpaceOnUse"> <stop stop-color="#008EE6"></stop> <stop offset="0.4966" stop-color="#80DAFE"></stop> <stop offset="0.5684" stop-color="#76D5FB"></stop> <stop offset="0.6888" stop-color="#5CC8F3"></stop> <stop offset="0.8428" stop-color="#32B2E6"></stop> <stop offset="1" stop-color="#0099D6"></stop> </linearGradient> <linearGradient id="paint30_linear" x1="12.5504" y1="14.4692" x2="10.0647" y2="20.9692" gradientUnits="userSpaceOnUse"> <stop stop-color="#17BBFE"></stop> <stop offset="1" stop-color="#391838"></stop> </linearGradient> <linearGradient id="paint31_linear" x1="12.0286" y1="20.5901" x2="12.0286" y2="17.1273" gradientUnits="userSpaceOnUse"> <stop stop-color="#7000A3"></stop> <stop offset="1" stop-color="#391838"></stop> </linearGradient> <radialGradient id="paint32_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12.0004 18.0975) rotate(0.927073) scale(3.34505 0.572731)"> <stop offset="0.00132565" stop-color="white"></stop> <stop offset="1" stop-color="#A9BCBE"></stop> </radialGradient> <linearGradient id="paint33_linear" x1="12.0286" y1="17.0472" x2="12.0286" y2="18.3847" gradientUnits="userSpaceOnUse"> <stop stop-color="#391838"></stop> <stop offset="1" stop-color="#391838" stop-opacity="0"></stop> </linearGradient> <radialGradient id="paint34_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.9747 19.0129) rotate(-0.0651785) scale(2.90626 0.497844)"> <stop offset="0.00132565" stop-color="white"></stop> <stop offset="1" stop-color="#8EA5A8"></stop> </radialGradient> <linearGradient id="paint35_linear" x1="12.2145" y1="5.98116" x2="11.8909" y2="4.3798" gradientUnits="userSpaceOnUse"> <stop stop-color="#008EE6"></stop> <stop offset="1" stop-color="#391838"></stop> </linearGradient> <linearGradient id="paint36_linear" x1="10.7486" y1="6.84136" x2="12.4939" y2="4.45459" gradientUnits="userSpaceOnUse"> <stop stop-color="#008EE6"></stop> <stop offset="1" stop-color="#391838"></stop> </linearGradient> <linearGradient id="paint37_linear" x1="12.6572" y1="5.27438" x2="11.4286" y2="2.56009" gradientUnits="userSpaceOnUse"> <stop stop-color="#BD2719"></stop> <stop offset="0.2151" stop-color="#D41A10"></stop> <stop offset="0.5049" stop-color="#EC0C07"></stop> <stop offset="0.774" stop-color="#FA0302"></stop> <stop offset="1" stop-color="#FF0000"></stop> </linearGradient> <radialGradient id="paint38_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.3466 2.14963) scale(2.75662)"> <stop offset="0.00134333" stop-color="#FFED1C"></stop> <stop offset="0.1997" stop-color="#FFEE2B" stop-opacity="0.8013"></stop> <stop offset="0.5839" stop-color="#FFF254" stop-opacity="0.4167"></stop> <stop offset="1" stop-color="#FFF686" stop-opacity="0"></stop> </radialGradient> <linearGradient id="paint39_linear" x1="3.42861" y1="17.3331" x2="3.42861" y2="7.78339" gradientUnits="userSpaceOnUse"> <stop stop-color="#612D5B"></stop> <stop offset="0.1479" stop-color="#872245"></stop> <stop offset="0.3388" stop-color="#B2162C"></stop> <stop offset="0.5244" stop-color="#D30C19"></stop> <stop offset="0.7005" stop-color="#EB060B"></stop> <stop offset="0.8633" stop-color="#FA0103"></stop> <stop offset="1" stop-color="#FF0000"></stop> </linearGradient> <linearGradient id="paint40_linear" x1="12.0459" y1="3.94118" x2="13.3031" y2="5.29356" gradientUnits="userSpaceOnUse"> <stop stop-color="#BD2719"></stop> <stop offset="0.2151" stop-color="#D41A10" stop-opacity="0.7849"></stop> <stop offset="0.5049" stop-color="#EC0C07" stop-opacity="0.4951"></stop> <stop offset="0.774" stop-color="#FA0302" stop-opacity="0.226"></stop> <stop offset="1" stop-color="#FF0000" stop-opacity="0"></stop> </linearGradient> </defs> </g></svg>
            </span>
          </div>

          <!-- Chat Info (collapsed state hidden) -->
          <div class="ml-2 md:ml-4 flex-1 min-w-0" v-show="!isCollapsed">
         
            <div class="flex items-center justify-between">
              <p class="text-xs md:text-sm font-semibold text-gray-900 truncate">
                {{ 
                  chat?.isAIChat 
                    ? "AI Chat" 
                    : (chat?.isGroupChat 
                        ? chat?.name || "Unnamed Group"
                        : (chat?.participants?.filter(p => p?._id !== authStore?.user?._id)[0]?.username || 
                            chat?.participants?.filter(p => p?._id !== authStore?.user?._id)[0]?.email || "Unknown"))
                }}                
              </p>
              <!-- <div v-if="chat.unreadCount > 0" class="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                {{ chat.unreadCount }}
              </div> -->
              <p class="text-[10px] md:text-xs text-purple-900 truncate">
                {{ chat.lastMessage?.content }}
              </p>              
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Sidebar Footer -->
    <div class="p-2 border-t border-gray-200 bg-white">
      <div class="flex space-x-1 md:space-x-2">
        <button
        @click="showCreateChatModal = true"
        class="cursor-pointer flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold p-3 rounded-xl transition-all duration-200 w-full"
      >
          <span v-show="!isCollapsed">New Chat</span>
          <svg 
            v-show="isCollapsed" 
            class="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
        </button>
        <button v-show="!isCollapsed"
          @click="startAIChat"
          :disabled="hasAIChat"
          class="cursor-pointer p-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </button>
      </div>
    </div>
    </aside>   

    <!-- Main Chat Window -->
    <main class="flex-1 flex flex-col">

      <!-- Chat Header  -->
      <header class="relative p-4 border-b bg-white flex items-center justify-between">              

        <div class="flex items-center space-x-4">
          <div class="relative flex items-center">
            <!-- Mobile Menu Toggle (Left-aligned) -->
            <button
              v-show="!isMobileMenuOpen"
              @click="openMobileMenu"
              class="md:hidden p-3 text-white rounded-full shadow-lg bg-purple-500 hover:bg-purple-700 transition-colors mr-2"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          
            <!-- Avatar Container (Right-aligned) -->
            <div class="w-12 h-12 ml-auto flex items-center justify-center bg-purple-500 text-white rounded-xl shadow-sm relative">
              <img class="w-8 h-8" src="/chat.svg"/>
              <!-- <span class="md:hidden font-bold">{{ getInitials(chatTitle) }}</span> -->
              <!-- Full chat title visible on medium+ screens -->
              <!-- <span class="hidden md:inline font-bold">{{  getInitials(chatTitle) }}</span> -->
              
              <!-- Online Status Indicator -->
              <div v-if="isUserOnline" class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          </div>
          <div>            
            <h2 v-if="chatStore.selectedChat" class="text-lg font-bold text-gray-900">{{ chatTitle }}</h2>
            <p  v-if="chatStore.selectedChat" class="text-sm text-gray-500">
              {{ isUserOnline ? 'Online' : lastSeenFormatted }}
            </p>
            <h2 v-else class="text-lg font-semibold text-gray-900">ChatterBox IM</h2>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
           <!-- Call Button -->
           <button v-if="chatStore.selectedChat && !chatStore.selectedChat.isAIChat" @click="startVoiceCall" class="p-2 hover:bg-gray-200 cursor-pointer rounded-full  focus:outline-none">                                         
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 12C19.7614 12 22 9.76142 22 7C22 4.23858 19.7614 2 17 2C14.2386 2 12 4.23858 12 7C12 7.79984 12.1878 8.55582 12.5217 9.22624C12.6105 9.4044 12.64 9.60803 12.5886 9.80031L12.2908 10.9133C12.1615 11.3965 12.6035 11.8385 13.0867 11.7092L14.1997 11.4114C14.392 11.36 14.5956 11.3895 14.7738 11.4783C15.4442 11.8122 16.2002 12 17 12Z" stroke="#000000" stroke-width="1.5"></path> <path d="M17 9L17 5M19 7L15 7" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path> <path d="M14.1007 16.0272L13.5569 15.5107L14.1007 16.0272ZM14.5562 15.5477L15.1 16.0642H15.1L14.5562 15.5477ZM16.9728 15.2123L16.5987 15.8623H16.5987L16.9728 15.2123ZM18.8833 16.312L18.5092 16.962L18.8833 16.312ZM19.4217 19.7584L19.9655 20.2749L19.4217 19.7584ZM18.0011 21.254L17.4573 20.7375L18.0011 21.254ZM16.6763 21.9631L16.7499 22.7095L16.6763 21.9631ZM6.81536 17.4752L7.35915 16.9587L6.81536 17.4752ZM2.00289 7.96594L1.25397 8.00613L1.25397 8.00613L2.00289 7.96594ZM8.47752 9.50311L9.02131 10.0196H9.02131L8.47752 9.50311ZM8.63424 6.6931L9.24664 6.26012L8.63424 6.6931ZM7.37326 4.90961L6.76086 5.3426V5.3426L7.37326 4.90961ZM4.26145 4.60864L4.80524 5.12516L4.26145 4.60864ZM2.69185 6.26114L2.14806 5.74462L2.14806 5.74462L2.69185 6.26114ZM10.0631 14.0559L10.6069 13.5394L10.0631 14.0559ZM14.6445 16.5437L15.1 16.0642L14.0124 15.0312L13.5569 15.5107L14.6445 16.5437ZM16.5987 15.8623L18.5092 16.962L19.2575 15.662L17.347 14.5623L16.5987 15.8623ZM18.8779 19.2419L17.4573 20.7375L18.5449 21.7705L19.9655 20.2749L18.8779 19.2419ZM16.6026 21.2167C15.1676 21.3584 11.4233 21.2375 7.35915 16.9587L6.27157 17.9917C10.7009 22.655 14.9261 22.8895 16.7499 22.7095L16.6026 21.2167ZM7.35915 16.9587C3.48303 12.8778 2.83285 9.43556 2.75181 7.92574L1.25397 8.00613C1.35322 9.85536 2.1384 13.6403 6.27157 17.9917L7.35915 16.9587ZM8.7345 10.3216L9.02131 10.0196L7.93372 8.9866L7.64691 9.28856L8.7345 10.3216ZM9.24664 6.26012L7.98565 4.47663L6.76086 5.3426L8.02185 7.12608L9.24664 6.26012ZM3.71766 4.09213L2.14806 5.74462L3.23564 6.77765L4.80524 5.12516L3.71766 4.09213ZM8.1907 9.80507C7.64691 9.28856 7.64622 9.28929 7.64552 9.29002C7.64528 9.29028 7.64458 9.29102 7.64411 9.29152C7.64316 9.29254 7.64219 9.29357 7.64121 9.29463C7.63924 9.29675 7.6372 9.29896 7.6351 9.30127C7.63091 9.30588 7.62646 9.31087 7.62178 9.31625C7.61243 9.32701 7.60215 9.33931 7.59116 9.3532C7.56918 9.38098 7.54431 9.41512 7.51822 9.45588C7.46591 9.53764 7.40917 9.64531 7.36112 9.78033C7.26342 10.0549 7.21018 10.4185 7.27671 10.8726C7.40742 11.7647 7.99198 12.9644 9.51933 14.5724L10.6069 13.5394C9.17926 12.0363 8.82761 11.1106 8.76086 10.6551C8.72866 10.4354 8.76138 10.3196 8.77432 10.2832C8.78159 10.2628 8.78635 10.2571 8.78169 10.2644C8.77944 10.2679 8.77494 10.2745 8.76738 10.2841C8.76359 10.2888 8.75904 10.2944 8.7536 10.3006C8.75088 10.3038 8.74793 10.3071 8.74476 10.3106C8.74317 10.3123 8.74152 10.3141 8.73981 10.3159C8.73896 10.3169 8.73809 10.3178 8.7372 10.3187C8.73676 10.3192 8.73608 10.3199 8.73586 10.3202C8.73518 10.3209 8.7345 10.3216 8.1907 9.80507ZM9.51933 14.5724C11.0422 16.1757 12.1923 16.806 13.0698 16.9485C13.5201 17.0216 13.8846 16.9632 14.1606 16.8544C14.2955 16.8012 14.4022 16.7387 14.4823 16.6819C14.5223 16.6535 14.5556 16.6266 14.5824 16.6031C14.5959 16.5913 14.6077 16.5803 14.618 16.5703C14.6232 16.5654 14.628 16.5606 14.6324 16.5562C14.6346 16.554 14.6367 16.5518 14.6387 16.5497C14.6397 16.5487 14.6407 16.5477 14.6417 16.5467C14.6422 16.5462 14.6429 16.5454 14.6431 16.5452C14.6438 16.5444 14.6445 16.5437 14.1007 16.0272C13.5569 15.5107 13.5576 15.51 13.5583 15.5093C13.5585 15.509 13.5592 15.5083 13.5596 15.5078C13.5605 15.5069 13.5614 15.506 13.5623 15.5051C13.5641 15.5033 13.5658 15.5015 13.5674 15.4998C13.5708 15.4965 13.574 15.4933 13.577 15.4904C13.583 15.4846 13.5885 15.4796 13.5933 15.4754C13.6028 15.467 13.6099 15.4616 13.6145 15.4584C13.6239 15.4517 13.6229 15.454 13.6102 15.459C13.5909 15.4666 13.5 15.4987 13.3103 15.4679C12.9077 15.4025 12.0391 15.0472 10.6069 13.5394L9.51933 14.5724ZM7.98565 4.47663C6.97206 3.04305 4.94384 2.80119 3.71766 4.09213L4.80524 5.12516C5.32808 4.57471 6.24851 4.61795 6.76086 5.3426L7.98565 4.47663ZM2.75181 7.92574C2.73038 7.52644 2.90425 7.12654 3.23564 6.77765L2.14806 5.74462C1.61221 6.30877 1.20493 7.09246 1.25397 8.00613L2.75181 7.92574ZM17.4573 20.7375C17.1783 21.0313 16.8864 21.1887 16.6026 21.2167L16.7499 22.7095C17.497 22.6357 18.1016 22.2373 18.5449 21.7705L17.4573 20.7375ZM9.02131 10.0196C9.98889 9.00095 10.0574 7.40678 9.24664 6.26012L8.02185 7.12608C8.44399 7.72315 8.37926 8.51753 7.93372 8.9866L9.02131 10.0196ZM18.5092 16.962C19.33 17.4345 19.4907 18.5968 18.8779 19.2419L19.9655 20.2749C21.2704 18.901 20.8904 16.6019 19.2575 15.662L18.5092 16.962ZM15.1 16.0642C15.4854 15.6584 16.086 15.5672 16.5987 15.8623L17.347 14.5623C16.2485 13.93 14.8861 14.1113 14.0124 15.0312L15.1 16.0642Z" fill="#000000"></path> </g></svg>
          </button>

          <div class="relative">
              <button @click="toggleSettings" class="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
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
        </div>
      </header>   
      
      <!-- Loading Spinner -->
      <div v-if="chatStore.loading" class="flex items-center justify-center h-full">
        <div class="animate-spin h-12 w-12 rounded-full border-4 border-purple-500 border-t-transparent shadow-lg"></div>
        <span class="ml-3 text-gray-600 font-medium tracking-wide">Loading messages...</span>
      </div>

      <!-- Chat Messages -->     
      <section v-else
        v-if="chatStore.selectedChat"
        class="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white via-gray-50/50 to-gray-50/30"
        ref="messagesContainer"
      >       
        <div
          v-for="msg in chatStore.messages"
          :key="msg._id"
          :class="msg.sender._id === authStore.user._id ? 'flex justify-end' : 'flex items-start'"
          @mouseenter="hoveredMsgId = msg._id"
          @mouseleave="hoveredMsgId = null"
        >
          <!-- Outgoing Message -->
          <template v-if="msg.sender._id === authStore.user._id">
            <div class="flex flex-col items-end space-y-2 group">
              <div class="flex items-center space-x-3">
                <!-- Status Indicator -->
                <div class="flex items-center space-x-1.5">
                  <template v-if="msg.isRead">
                    <span class="text-[10px] text-purple-600 opacity-80">✓✓</span>
                  </template>
                  <template v-else>
                    <span class="text-xs text-amber-500 animate-pulse">🕒</span>
                  </template>
                </div>
                
                <!-- User Info -->
                <div class="flex items-center space-x-2 order-2">
                  <div class="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 text-white rounded-xl shadow-sm">
                    {{ getInitials(authStore.user.username) }}
                  </div>
                  <p class="text-xs text-gray-400">{{ authStore.user.username || authStore.user.email }}</p>
                </div>
              </div>

              <!-- Message Bubble -->
              <div class="relative max-w-lg">
                <div class="bg-gradient-to-br from-purple-600 to-blue-500 text-white p-4 rounded-2xl rounded-br-none shadow-lg">
                  <!-- Message content... -->
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
                
                <!-- Timestamp -->
                <div class="absolute -bottom-5 right-0 opacity-70">
                  <p class="text-[10px] text-gray-400 tracking-tight">{{ formatTimestamp(msg.createdAt) }}</p>
                </div>
                
                <!-- Message Options -->
                <div v-if="hoveredMsgId === msg._id" class="absolute -top-3 -right-2">
                  <button @click="toggleMsgMenu(msg._id)" class="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 hover:scale-105 transition-transform">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                    </svg>
                  </button>
                  
                  <!-- Options Menu -->
                  <div v-if="msgMenuId === msg._id" class="absolute right-0 mt-1 w-32 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/60 z-10 overflow-hidden">
                    <ul class="py-1 text-sm">
                      <li>
                        <button @click="openEditModal(msg)" class="w-full px-3 py-2 hover:bg-gray-50/80 transition-colors">
                          ✏️ Edit
                        </button>
                      </li>
                      <li>
                        <button @click="confirmDelete(msg._id)" class="w-full px-3 py-2 text-red-600 hover:bg-gray-50/80 transition-colors">
                          🗑️ Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Incoming Message -->
          <template v-else>
            <div class="flex flex-col space-y-2 group max-w-[85%]">
              <!-- Sender Info -->
              <div class="flex items-center space-x-2">
                <div class="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 text-gray-600 rounded-xl border border-gray-200/60 shadow-sm">
                  {{ getInitials(msg.sender.username) }}
                </div>
                <p class="text-xs text-gray-500">{{ msg.sender.username || msg.sender.email }}</p>
              </div>

              <!-- Message Bubble -->
              <div class="relative">
                <div class="bg-white border border-gray-200/60 p-4 rounded-2xl rounded-bl-none shadow-sm">
                  <!-- Message content... -->
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
                
                <!-- Timestamp -->
                <div class="absolute -bottom-5 left-0 opacity-70">
                  <p class="text-[10px] text-gray-400 tracking-tight">{{ formatTimestamp(msg.createdAt) }}</p>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Typing Indicator -->
        <div v-if="typingIndicator" class="flex items-center space-x-2 text-gray-500 animate-fade-in">
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
          </div>
          <span class="text-sm italic">Typing...</span>
        </div>
              
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
      
      </section>   

      <!-- Chat Input -->
      <footer v-if="chatStore.selectedChat" class="p-4 border-t border-gray-200/60 bg-white/90 backdrop-blur-sm">
        <!-- AI Mode Indicator -->
        <transition name="slide-down">
          <div v-if="newMessage.toLowerCase().startsWith('/ai')" class="mb-3 flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-blue-50 p-2 rounded-lg">
            <div class="w-7 h-7 flex items-center justify-center">
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
            <p class="text-xs font-medium mt-2">AI Assistant Activated</p>
          </div>
        </transition>

        <div class="flex items-center space-x-3">
          <!-- Record Button -->
          <div class="relative">
            <button v-if="!chatStore.selectedChat.isAIChat"
              @mousedown="startAudio" 
              @mouseup="stopAudio"
              @touchstart="startAudio"
              @touchend="stopAudio"
              :class="[recording ? 'bg-red-500 scale-110' : 'bg-gray-100 hover:bg-gray-200']"
              class="p-2.5 rounded-xl transition-all duration-200 ease-out shadow-sm"
            >
              <span class="text-lg">{{ recording ? '⏹' : '🎙' }}</span>
            </button>
            <div v-if="recording" class="absolute -top-2 -right-2">
              <div class="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            </div>
          </div>

          <!-- Message Input -->
          <input
            v-model="newMessage"
            @keydown="startTyping"
            @keyup="stopTyping"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Type your message..."
            class="flex-1 p-3.5 border-2 border-gray-200/70 rounded-xl focus:outline-none focus:border-purple-400/80 focus:ring-2 focus:ring-purple-100 transition-all placeholder-gray-400"
          />

          <!-- File Upload -->
          <input type="file" @change="handleFileUpload" class="hidden" ref="fileInput"/>
          <button v-if="!chatStore.selectedChat.isAIChat"
            @click="triggerFileInput"
            class=" cursor-pointer p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all"
          >
            <svg class="w-5 h-5" viewBox="0 0 28 28" fill="currentColor">
              <!-- SVG paths from original -->
              <svg class="w-5 h-5" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12.4797 4.15793C14.6095 0.833113 19.0267 -0.132589 22.3457 2.00098C25.6648 4.13454 26.6288 8.55944 24.4989 11.8843L22.6498 10.6956C24.1243 8.39379 23.4569 5.3304 21.1591 3.85332C18.8614 2.37624 15.8033 3.0448 14.3288 5.3466L12.4797 4.15793Z" fill="#ffffff"></path><path d="M14.3278 5.34752L5.1311 19.7042C4.14959 21.2384 4.5946 23.2789 6.12591 24.263C7.65789 25.2475 9.69685 24.8018 10.68 23.2674L13.0534 19.5629L13.0519 19.5619L18.9849 10.3002L18.9863 10.3012C19.4777 9.53391 19.2553 8.51284 18.4894 8.0205C17.7234 7.52814 16.7041 7.751 16.2126 8.51826L16.2111 8.51733L11.5 16.001C11.2118 16.4509 10.6138 16.5814 10.1643 16.2925L9.94284 16.1501C9.49339 15.8612 9.36268 15.2622 9.65088 14.8123L14.3621 7.32857L14.3635 7.3295C15.5104 5.53929 17.8888 5.01934 19.676 6.16816C21.4631 7.317 21.9822 9.69964 20.8354 11.4899L20.8339 11.489L18.4613 15.1927L18.4632 15.1939L12.5297 24.4564C10.891 27.0135 7.49232 27.756 4.93909 26.1152C2.38578 24.4743 1.64432 21.071 3.28299 18.5136L12.4787 4.15885L14.3278 5.34752Z" fill="#ffffff"></path><path d="M15.4516 23.7222C15.0022 23.4333 14.8715 22.8343 15.1597 22.3844L22.6473 10.6957L24.4965 11.8844L17.0088 23.5731C16.7206 24.023 16.1226 24.1535 15.6731 23.8646L15.4516 23.7222Z" fill="#ffffff"></path></g></svg>
            </svg>
          </button>

          <!-- Send Button -->
          <button
            @click="sendMessage"
            class="cursor-pointer p-3 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </div>

        <!-- Recording Indicator -->
        <transition name="fade">
          <div v-if="recording" class="mt-3 flex items-center justify-between bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-gray-200/60">
            <div class="flex items-center space-x-2">
              <div class="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-gray-600 font-medium">{{ recordingTime }}s</span>
            </div>
            <button 
              @click="cancelRecording"
              class="text-sm bg-gradient-to-br from-red-500 to-rose-600 text-white px-3 py-1 rounded-lg hover:shadow-md transition-shadow"
            >
              Cancel
            </button>
          </div>
        </transition>

        <!-- Sending Status -->
        <transition name="fade">
          <div v-if="sendingVoiceNote" class="mt-3 flex items-center space-x-2 text-blue-600">
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span class="text-sm font-medium">Sending voice note...</span>
          </div>
        </transition>
      </footer>

      <!-- Placeholder if no chat is selected -->
      <template v-else>
        <div class="flex-1 flex items-center justify-center bg-white">
          <p class="text-gray-500 text-lg">Select a chat to start messaging</p>
        </div>
      </template>
    </main>

    <!-- Create Chat Modal -->
    <transition name="fade">
      <div
        v-if="showCreateChatModal"
        class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div class="p-6 border-b border-gray-200/60">
            <h3 class="text-xl font-semibold text-gray-800">Create New Chat</h3>
          </div>

          <div class="p-6">
            <input
              v-model="newChatEmails"
              placeholder="Enter user emails (comma separated)"
              class="w-full p-3 border-2 border-gray-200/70 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all placeholder-gray-400"
            />

            <label class="flex items-center space-x-3 mt-4 p-3 hover:bg-gray-50/50 rounded-xl cursor-pointer">
              <input 
                type="checkbox" 
                v-model="isGroupChat" 
                class="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded-lg focus:ring-purple-500"
              />
              <span class="text-gray-700">Group Chat</span>
            </label>

            <input
              v-if="isGroupChat"
              v-model="groupName"
              placeholder="Group Name"
              class="w-full p-3 border-2 border-gray-200/70 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all placeholder-gray-400 mt-4"
            />

            <div v-if="createChatError" class="mt-4 p-3 bg-red-50/80 text-red-600 rounded-lg text-sm">
              {{ createChatError }}
            </div>
          </div>

          <div class="p-4 bg-gray-50/50 border-t border-gray-200/60 flex justify-end space-x-3">
            <button
              @click="closeCreateChatModal"
              class="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              @click="createChat"
              :disabled="createchatloading"
              class="cursor-pointer px-5 py-2.5 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="createchatloading">Creating...</span>
              <span v-else>Create Chat</span>
            </button>
          
          </div>
        </div>
      </div>
    </transition>

    <!-- Edit Message Modal -->
    <transition name="fade">
      <div 
        v-if="showEditModal" 
        class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div class="p-6 border-b border-gray-200/60">
            <h3 class="text-xl font-semibold text-gray-800">Edit Message</h3>
          </div>

          <div class="p-6">
            <input
              v-model="editedContent"
              type="text"
              class="w-full p-3 border-2 border-gray-200/70 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all placeholder-gray-400"
              :disabled="chatStore.messageLoading"
            />
          </div>

          <div class="p-4 bg-gray-50/50 border-t border-gray-200/60 flex justify-end space-x-3">
            <button 
              @click="cancelEditing" 
              class="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
              :disabled="chatStore.messageLoading"
            >
              Cancel
            </button>
            <button 
              @click="saveEditedMessage(editingMsgId)" 
              class="px-5 py-2.5 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center"
              :disabled="chatStore.messageLoading"
            >
              <span v-if="chatStore.messageLoading" class="animate-spin mr-2">
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              </span>
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Active Call UI -->
    <div v-if="callActive" class="fixed bottom-6 left-0 right-0 flex justify-center z-50">
      <div class="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-200/60 flex flex-col items-center space-y-4">
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-purple-600 rounded-full animate-pulse"></div>
          <p class="font-semibold text-gray-700 text-lg">Live Voice Call</p>
        </div>
        <audio ref="remoteAudio" autoplay></audio>
        <button 
          @click="hangUpVoiceCall" 
          class="px-6 py-2.5 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          <span>End Call</span>
        </button>
      </div>
    </div>

    <!-- Incoming Call Modal -->
    <transition name="fade">
      <div v-if="incomingCall" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden w-full max-w-md">
          <div class="p-8 text-center space-y-6">
            <div class="space-y-2">
              <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-800">Incoming Call</h2>
              <p class="text-gray-600">From {{ incomingCall.callerName }}</p>
            </div>
            
            <div class="flex justify-center space-x-4">
              <button
                @click="acceptCall"
                class="px-8 py-3 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>Accept</span>
              </button>
              <button
                @click="declineCall"
                class="px-8 py-3 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                <span>Decline</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Call Duration Indicator -->
    <transition name="slide-up">
      <div v-if="chatStore.callActive" class="fixed bottom-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200/60 flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <div class="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
          <span class="font-medium text-gray-700">{{ chatStore.callDuration }}s</span>
        </div>
        <button 
          @click="chatStore.hangUpVoiceCall" 
          class="px-3 py-1.5 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-lg hover:shadow-md transition-all"
        >
          End Call
        </button>
      </div>
    </transition>


  </div>
</template>

<script>
import { useChatStore } from "../stores/chat";
import { useAuthStore } from "../stores/auth";
import { ref, computed, onMounted, onUnmounted, onBeforeUnmount, nextTick, watch } from "vue";
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

    const isCollapsed = ref(false);
    const isMobileMenuOpen = ref(false);
    const sidebarRef = ref(null);
        
    //upload
    const fileInput = ref(null);

    const checkScreenSize = () => {
        if (window.innerWidth < 768) {
          isCollapsed.value = false;
          isMobileMenuOpen.value = false;
        }
      };

      const toggleSidebar = () => {
        if (window.innerWidth < 768) {
          isMobileMenuOpen.value = !isMobileMenuOpen.value;
        } else {
          isCollapsed.value = !isCollapsed.value;
        }
      };

      const openMobileMenu = () => {
        isMobileMenuOpen.value = true;
      };

      const closeMobileMenu = () => {
        isMobileMenuOpen.value = false;
      };

      // Touch gesture handling
      let touchStartX = 0;
      let touchEndX = 0;

      const handleTouchStart = (e) => {
        touchStartX = e.changedTouches[0].screenX;
      };

      const handleTouchEnd = (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
          closeMobileMenu();
        }
      };

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

      window.addEventListener('resize', checkScreenSize);
        sidebarRef.value?.addEventListener('touchstart', handleTouchStart);
        sidebarRef.value?.addEventListener('touchend', handleTouchEnd);
      });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', checkScreenSize);
      sidebarRef.value?.removeEventListener('touchstart', handleTouchStart);
      sidebarRef.value?.removeEventListener('touchend', handleTouchEnd);
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
      return lastSeen ? new Date(lastSeen).toLocaleString() : "ChatterBox AI";
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
    
    const createchatloading = ref(false);

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
      createchatloading.value = true;

      try {
        await chatStore.createChat(emails, isGroupChat.value, groupName.value);
        
        // Close the modal properly after a short delay
        setTimeout(() => {
          closeCreateChatModal();
          newChatEmails.value = ""; // Reset input fields
          isGroupChat.value = false;
          groupName.value = "";
        }, 300); 
        
        await chatStore.fetchUserChats(); // Fetch chats to update the list
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
      } finally {
        createchatloading.value = false;  
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
      return [...chatStore.chats].sort((a, b) => {
        const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(a.updatedAt || a.createdAt);
        const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(b.updatedAt || b.createdAt);
        return bTime - aTime; // Sort newest chats first
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
      handleTouchEnd,
      handleTouchStart,
      openMobileMenu,
      handleTouchStart,
      handleTouchEnd,
      toggleSidebar,
      checkScreenSize,
      sidebarRef,
      isMobileMenuOpen,
      isCollapsed,
      closeMobileMenu,
      createchatloading

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
