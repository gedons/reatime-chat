<template>
    <div v-if="callActive" class="absolute bottom-20 left-0 right-0 flex justify-center z-20">
      <div class="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
        <p class="font-semibold mb-2">Voice Call Active</p>
        <!-- Audio element for remote audio stream -->
        <audio ref="remoteAudio" autoplay></audio>
        <!-- Hang Up button -->
        <button @click="hangUp" class="mt-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
          Hang Up
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from "vue";
  import { useChatStore } from "../stores/chat";
  import { useAuthStore } from "../stores/auth";
  
  export default {
    name: "CallComponent",
    setup() {
      const chatStore = useChatStore();
      const remoteAudio = ref(null);
  
      // When the remote stream is updated, attach it to the audio element.
      watch(
        () => chatStore.remoteStream,
        (newStream) => {
          if (newStream && remoteAudio.value) {
            remoteAudio.value.srcObject = newStream;
          }
        }
      );
  
      const hangUp = async () => {
        await chatStore.hangUpVoiceCall();
      };
  
      return {
        remoteAudio,
        hangUp,
        callActive: chatStore.callActive,
      };
    },
  };
  </script>
  
  <style scoped>
  /* You can add your styles here if needed */
  </style>
  