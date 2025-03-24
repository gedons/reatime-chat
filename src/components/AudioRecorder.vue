<template>
    <div class="audio-recorder">
      <button @click="startRecording" :disabled="isRecording">
        🎙 Start Recording
      </button>
      <button @click="stopRecording" :disabled="!isRecording">
        ⏹ Stop Recording
      </button>
  
      <audio v-if="audioUrl" :src="audioUrl" controls></audio>
  
      <button v-if="audioFile" @click="uploadAudio">
        ⬆ Upload Audio
      </button>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import { useChatStore } from "../stores/chat"; 
  
  export default {
    setup() {
      const isRecording = ref(false);
      const mediaRecorder = ref(null);
      const audioChunks = ref([]);
      const audioUrl = ref(null);
      const audioFile = ref(null);
  
      const chatStore = useChatStore(); 
  
      const startRecording = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder.value = new MediaRecorder(stream);
          audioChunks.value = [];
  
          mediaRecorder.value.ondataavailable = (event) => {
            audioChunks.value.push(event.data);
          };
  
          mediaRecorder.value.onstop = () => {
            const audioBlob = new Blob(audioChunks.value, { type: "audio/mp3" });
            audioFile.value = new File([audioBlob], "recording.mp3", { type: "audio/mp3" });
            audioUrl.value = URL.createObjectURL(audioBlob);
          };
  
          mediaRecorder.value.start();
          isRecording.value = true;
        } catch (error) {
          console.error("Error accessing microphone:", error);
        }
      };
  
      const stopRecording = () => {
        if (mediaRecorder.value) {
          mediaRecorder.value.stop();
          isRecording.value = false;
        }
      };
  
      const uploadAudio = async () => {
        if (!audioFile.value) return;
        await chatStore.uploadAudioMessage(audioFile.value);
        audioFile.value = null;
        audioUrl.value = null;
      };
  
      return {
        isRecording,
        audioUrl,
        startRecording,
        stopRecording,
        uploadAudio,
      };
    },
  };
  </script>
  
  <style scoped>
  .audio-recorder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  button {
    padding: 10px;
    background: #3498db;
    color: white;
    border: none;
    cursor: pointer;
  }
  button:disabled {
    background: #95a5a6;
  }
  </style>
  