import { defineStore } from 'pinia';
import { useChatStore } from './chat';
import { useAuthStore } from './auth';
import { io } from 'socket.io-client';
import apiurl from '../axiosConfig';

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [],
    loading: false,
    error: null,
    socket: null
  }),

  actions: {
    // ✅ Initialize WebSocket Connection
    initSocket() {
      if (this.socket) return; // Prevent multiple socket instances

      this.socket = io(import.meta.env.VITE_API_BASE_URL); // Your backend WebSocket URL

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      // ✅ Listen for incoming messages
      this.socket.on('newMessage', (message) => {
        console.log('Received new message:', message);
        this.messages.push(message);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket');
      });
    },

    // ✅ Fetch Messages for a Chat
    async fetchMessages(chatId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/messages/${chatId}`);
        const data = await response.json();
        this.messages = data;
      } catch (error) {
        this.error = 'Failed to load messages';
      } finally {
        this.loading = false;
      }
    },

    // ✅ Send a New Message
    async sendMessage(chatId, content) {
      const authStore = useAuthStore();
      const user = authStore.user;

      if (!user) {
        this.error = 'User not authenticated';
        return;
      }

      const newMessage = {
        chatId,
        sender: user._id,
        content
      };

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/messages/send`,{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMessage)
        });

        if (!response.ok) throw new Error('Failed to send message');

        const savedMessage = await response.json();
        this.messages.push(savedMessage);

        // ✅ Emit the message to WebSocket
        if (this.socket) {
          this.socket.emit('sendMessage', savedMessage);
        }
      } catch (error) {
        this.error = 'Error sending message';
      }
    }
  }
});
