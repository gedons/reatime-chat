// src/stores/chat.js
import { defineStore } from 'pinia';
import { useAuthStore } from '../stores/auth';
import CryptoJS from "crypto-js"; 
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { io } from 'socket.io-client';
import SimplePeer from 'simple-peer';
// Import the ECDH crypto functions
import { getKey, importPublicKey, deriveSharedKey, encryptWithSharedKey, decryptWithSharedKey } from '../utils/crypto';

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const url = `${baseUrl}/api/chats`;
const messageurl = `${baseUrl}/api/messages`;
const uploadurl = `${baseUrl}/api/upload`;
const aiUrl = `${baseUrl}/api/ai`
const toast = useToast();

export const useChatStore = defineStore('chat', {
  state: () => ({
    chats: [],
    pendingChats: [],
    selectedChat: null,
    messages: [],
    socket: null,
    onlineUsers: [],
    typingUsers: {},
    loading: false,
    messageLoading: false,
    error: null,
    soundEnabled: true,
    // For ECDH: store our private key and shared key per conversation
    myECDHPrivateKey: null,  // Generated at login
    sharedKey: null,         // Derived per conversation

    mediaUploadProgress: 0,    
    recording: false, // added to track recording state
    mediaRecorder: null, // to store the recorder instance
    recordedChunks: [], 

    peerConnection: null,
    localStream: null,
    remoteStream: null,
    callStartTime: 0,
    callTimer: null,
    callDuration: 0,
    remoteAudio: null,
    callActive: false,
    callIncoming: false,
  }),

  actions: {
    setAuthHeader() {
      const token = localStorage.getItem('token');
      // console.log('[setAuthHeader] Token:', token);
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    },

    async fetchUserChats() {
      this.loading = true;
      this.setAuthHeader();      
      try {
        const response = await axios.get(`${url}`);        
        this.chats = response.data;
      } catch (error) {
        console.log('[fetchUserChats] Error:', error.response?.data?.message);
        this.error = error.response?.data?.message || 'Failed to fetch chats';
      } finally {
        this.loading = false;
      }
    },
    
    async fetchPendingChats() {
      this.loading = true;
      this.setAuthHeader();
      // console.log('[fetchPendingChats] Fetching pending chats...');
      try {
        const response = await axios.get(`${url}/pending`);
        // console.log('[fetchPendingChats] Pending chats:', response.data);
        this.pendingChats = response.data;
      } catch (error) {
        console.log('[fetchPendingChats] Error:', error.response?.data?.message);
        this.error = error.response?.data?.message || 'Failed to fetch pending chats';
      } finally {
        this.loading = false;
      }
    },

    async createChat(participantsEmails, isGroupChat = false, name = '') {
      this.loading = true;
      this.setAuthHeader();
      // console.log('[createChat] Creating chat with:', { participantsEmails, isGroupChat, name });
      try {
        const response = await axios.post(`${url}/create`, { participantsEmails, isGroupChat, name });
        // console.log('[createChat] Chat created:', response.data);
        this.pendingChats.push(response.data);
        toast.success('Chat created successfully');
      } catch (error) {
        console.log('[createChat] Error:', error.response?.data?.message);
        this.error = error.response?.data?.message || 'Failed to create chat';
        toast.error(error.response?.data?.message || 'Failed to create chat');
      } finally {
        this.loading = false;
      }
    },

    async createAIChat() {
      this.loading = true;
      this.setAuthHeader();
      console.log('[createAIChat] Creating AI chat...');
      try {
        const response = await axios.post(`${url}/ai/create`);
        console.log('[createAIChat] AI chat created:', response.data);
        //  add the new chat to the top of your chats array:
        this.chats.unshift(response.data);
        toast.success('AI chat created successfully');
        return response.data;
      } catch (error) {
        console.error('[createAIChat] Error creating AI chat:', error.response?.data?.message);
        toast.error(error.response?.data?.message || 'Error creating AI chat');
        throw error;
      } finally {
        this.loading = false;
      }
    },
    

    async acceptChat(chatId) {
      this.loading = true;
      this.setAuthHeader();
      // console.log('[acceptChat] Accepting chat:', chatId);
      try {
        await axios.put(`${url}/${chatId}/accept`);
        // console.log('[acceptChat] Chat accepted');
        await this.fetchUserChats();
        await this.fetchPendingChats();
      } catch (error) {
        console.log('[acceptChat] Error:', error.response?.data?.message);
        this.error = error.response?.data?.message || 'Failed to accept chat';
      } finally {
        this.loading = false;
      }
    },

    async deleteChat(chatId) {
      this.loading = true;
      this.setAuthHeader();
      // console.log('[deleteChat] Deleting chat:', chatId);
      try {
        await axios.delete(`${url}/${chatId}`);
        this.chats = this.chats.filter(chat => chat._id !== chatId);
        // console.log('[deleteChat] Chat deleted');
        toast.success('Chat deleted successfully');
      } catch (error) {
        console.log('[deleteChat] Error:', error.response?.data?.message);
        this.error = error.response?.data?.message || 'Failed to delete chat';
        toast.error(error.response?.data?.message || 'Failed to delete chat');
      } finally {
        this.loading = false;
      }
    },


    async selectChat(chat) {
      this.loading = true;
      this.selectedChat = chat;
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`${messageurl}/${chat._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          // console.log('[selectChat] Fetched messages:', response.data);
      
          // For one-on-one chats, derive shared key using otherPublicKey if provided.
          if (!chat.isGroupChat && chat.otherPublicKey) {
            const otherPublicKey = await importPublicKey(chat.otherPublicKey);
            const authStoreInstance = useAuthStore();
            if (!authStoreInstance.ecdhPrivateKey) {
              // Generate and store ECDH key pair on login ideally.
              const keyPair = await window.crypto.subtle.generateKey(
                { name: "ECDH", namedCurve: "P-256" },
                true,
                ["deriveKey", "deriveBits"]
              );
              authStoreInstance.ecdhPrivateKey = keyPair.privateKey;
            }
            this.sharedKey = await deriveSharedKey(authStoreInstance.ecdhPrivateKey, otherPublicKey);
            // console.log('[selectChat] Derived shared key using otherPublicKey:', this.sharedKey);
          } else {
            console.warn('[selectChat] No otherPublicKey found; using fallback key derivation.');
            this.sharedKey = await getKey();
          }
      
          // Decrypt messages (if they have an IV)
          const decryptedMessages = await Promise.all(response.data.map(async (msg) => {
            if (!msg.iv) {
              // console.log('[selectChat] Message has no IV, assuming plaintext:', msg);
              return msg;
            }
            try {
              const decryptedContent = await decryptWithSharedKey(this.sharedKey, msg.content, msg.iv);
              return { ...msg, content: decryptedContent };
            } catch (error) {
              console.log('[selectChat] Error decrypting message:', error);
              return msg;
            }
          }));
          this.messages = decryptedMessages;
      
          // Join the chat room and emit read receipt events
          if (this.socket) {
            this.socket.emit("joinRoom", chat._id);
            const currentUserId = useAuthStore().user._id;
            const unreadMessages = this.messages.filter(msg => !msg.readBy?.includes(currentUserId));
            unreadMessages.forEach(msg => {
              this.socket.emit("messageRead", { messageId: msg._id, chatId: chat._id, userId: currentUserId });
            });
          }
        } catch (error) {
          console.log('[selectChat] Error fetching messages:', error);
          this.messages = []; // Fallback if there's an error
        } finally {
          this.loading = false;
        }
        await this.fetchUserChats();
    },
    
    
    toggleSound() {
      this.soundEnabled = !this.soundEnabled;
      // console.log('[toggleSound] Sound enabled:', this.soundEnabled);
      toast.info(`Sound ${this.soundEnabled ? "Enabled" : "Disabled"}`);
    },

    async editMessage(messageId, newContent) {
        this.messageLoading = true;
        this.setAuthHeader();
        console.log('[editMessage] Editing message:', messageId, 'with new content:', newContent);
        try {
          const response = await axios.put(`${messageurl}/${messageId}`, { newContent });
          // console.log('[editMessage] API Response:', response.data);
          // Emit a socket event so that other clients are notified
          this.socket.emit('editMessage', { messageId, newContent }, (socketResponse) => {
            console.log('[editMessage] Socket response:', socketResponse);
          });
          // Update the local messages array (force reactivity)
          this.messages = this.messages.map(msg =>
            msg._id === messageId ? { ...msg, content: response.data.content } : msg
          );
          toast.success("Message edited successfully");
          return response.data;
        } catch (error) {
          console.error('[editMessage] Error:', error.response?.data?.message);
          toast.error("Error editing message");
          throw error;
        } finally {
          this.messageLoading = false;
        }
    },

    async deleteMessage(messageId) {
      if (!messageId) {
        throw new Error("Message ID is required for deletion");
      }
      this.messageLoading = true;
      this.setAuthHeader();
      console.log('[deleteMessage] Deleting message:', messageId);
      try {
        const response = await axios.delete(`${messageurl}/${messageId}`);
        console.log('[deleteMessage] API Response:', response.data);
        // Emit a socket event so that other clients are notified
        this.socket.emit('deleteMessage', { messageId, chatId: this.selectedChat._id }, (socketResponse) => {
          console.log('[deleteMessage] Socket response:', socketResponse);
        });
        // Remove deleted message from local messages array
        this.messages = this.messages.filter(msg => msg._id !== messageId);
        toast.success("Message deleted successfully");
        return response.data;
      } catch (error) {
        console.error('[deleteMessage] Error:', error.response?.data?.message);
        toast.error("Error deleting message");
        throw error;
      } finally {
        this.messageLoading = false;
      }
    },
      
    connectSocket(userId) {
      if (this.socket) return;
      // console.log('[connectSocket] Connecting socket for user:', userId);
      this.socket = io(baseUrl, { 
        query: { userId },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      this.socket.on('connect', () => {
        // console.log('[connectSocket] Connected to WebSocket');
        this.socket.emit('userOnline', userId);
      });

      this.socket.on('disconnect', () => {
        // console.log('[connectSocket] Disconnected from WebSocket. Reconnecting...');
      });

      this.socket.on('updateOnlineUsers', (users) => {
        // console.log('[connectSocket] Online users:', users);
        this.onlineUsers = users;
      });

      this.socket.on('userLastSeen', ({ userId, lastSeen }) => {
        // console.log(`[connectSocket] User ${userId} last seen at ${lastSeen}`);
        this.chats = this.chats.map(chat => {
          if (chat.participants.some(p => p._id === userId)) {
            return { ...chat, lastSeen };
          }
          return chat;
        });
      });

     
      this.socket.on('receiveMessage', async (message) => {
        // console.log('[connectSocket] Received new message:', message);
        if (!this.sharedKey) {
          // console.log('[connectSocket] No shared key, deriving fallback shared key...');
          this.sharedKey = await getKey();
        }
        try {
          const decryptedContent = await decryptWithSharedKey(this.sharedKey, message.content, message.iv);
          message.content = decryptedContent;
          // console.log('[connectSocket] Decrypted message:', message);
        } catch (error) {
          console.log('[connectSocket] Error decrypting received message:', error);
        }
        if (this.selectedChat && this.selectedChat._id === message.chatId) {
          if (!this.messages.some(msg => msg._id === message._id)) {
            this.messages.push(message);
          }
        }
        const chatIndex = this.chats.findIndex(chat => chat._id === message.chatId);
        if (chatIndex !== -1) {
          this.chats[chatIndex].lastMessage = message;
        }
        const currentUserId = useAuthStore().user?._id || localStorage.getItem('userId');
        if (message.sender && message.sender._id !== currentUserId) {
          toast.info(`New message from ${message.sender.username || 'Unknown User'}`);
          if (this.soundEnabled) {
            // console.log('[connectSocket] Playing incoming sound');
            const audio = new Audio('/sounds/incoming.mp3');
            audio.play();
          }
        }
      });
      

      this.socket.on('messageEdited', (updatedMessage) => {
        // console.log('[connectSocket] Received edited message:', updatedMessage);
        // Force a new array assignment for Vue reactivity.
        this.messages = this.messages.map(msg =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        );
      });


      this.socket.on('messageDeleted', ({ messageId }) => {
        // console.log('[connectSocket] Received delete notification for message:', messageId);
        this.messages = this.messages.filter(msg => msg._id !== messageId);
      });  
    

      this.socket.on('typing', (data) => {
        // console.log('[connectSocket] Typing event:', data);
        if (!this.selectedChat || this.selectedChat._id !== data.chatId) return;
        this.typingUsers[data.userId] = true;
      });
    
      this.socket.on('stopTyping', (data) => {
        // console.log('[connectSocket] Stop typing event:', data);
        if (!this.selectedChat || this.selectedChat._id !== data.chatId) return;
        delete this.typingUsers[data.userId];
      });    

      this.socket.on('incomingVoiceCall', (data) => {
        console.log('[connectSocket] Incoming voice call:', data);
        // Display a notification to the user (e.g., using toast or a modal)
        toast.info(`Incoming voice call from ${data.caller}`);
        // You may also update your UI state here to show an "Incoming call" modal
      });
    },

    async sendMessage(plainText) {
      if (!this.selectedChat || !plainText) {
        toast.error('Invalid chat or empty message content');
        return;
      }
    
      // If the chat is an AI chat, handle it separately.
      if (this.selectedChat.isAIChat) {
        console.log('[sendMessage] Detected AI chat, calling AI endpoint.');
        try {
          const aiResponse = await this.getAIResponse(plainText);
          if (aiResponse) {
            const aiMsg = {
              _id: Date.now().toString(), // temporary id (for UI uniqueness)
              chatId: this.selectedChat._id,
              content: aiResponse,
              sender: { _id: "ai", username: "AI Assistant" },
              createdAt: new Date().toISOString(),
              isRead: true,
              delivered: true,
              status: 'delivered'
            };
            console.log('[sendMessage] AI message received:', aiMsg);
            this.messages.push(aiMsg);
            return aiMsg;
          }
        } catch (error) {
          console.error('[sendMessage] Error getting AI response:', error);
          toast.error('Failed to get AI response');
        }
        newMessage.value = "";
        return;
      }
    
      try {
        // Ensure we have a valid shared key.
        if (!this.sharedKey) {
          console.log('[sendMessage] No shared key, deriving fallback shared key...');
          this.sharedKey = await getKey();
        }
        // Encrypt the plain text message.
        const encryptionResult = await encryptWithSharedKey(this.sharedKey, plainText);
        console.log('[sendMessage] Encryption result:', encryptionResult);
        if (!encryptionResult.iv || !encryptionResult.ciphertext) {
          console.error('[sendMessage] Encryption failed: Missing IV or ciphertext');
          toast.error('Encryption failed, please try again');
          return;
        }
        const authStoreInstance = useAuthStore();
        const messageData = {
          chatId: this.selectedChat._id,
          content: encryptionResult.ciphertext, // Encrypted content
          iv: encryptionResult.iv,              // Initialization vector
          sender: localStorage.getItem('userId') || authStoreInstance.user?._id,
        };
        console.log('[sendMessage] Encrypted Message Data:', messageData);
    
        // Emit the message via WebSocket and wait for server confirmation.
        this.socket.emit('sendMessage', messageData, async (response) => {
          console.log('[sendMessage] Server response:', response);
          if (response?.success) {
            try {
              // Decrypt the sent message before updating the UI.
              const decryptedContent = await decryptWithSharedKey(
                this.sharedKey,
                response.data.content,
                response.data.iv
              );
              response.data.content = decryptedContent;
              response.data.delivered = true;
              response.data.status = 'delivered';
              console.log('[sendMessage] Decrypted sent message:', response.data);
            } catch (error) {
              console.error('[sendMessage] Error decrypting sent message:', error);
            }
            // Only add the server-returned message to the UI.
            this.messages.push(response.data);
            return response.data;
          } else {
            console.error('[sendMessage] Failed to send message:', response);
            toast.error(response?.message || 'Failed to send message');
          }
        });
      } catch (error) {
        console.error('[sendMessage] Error:', error);
        toast.error('Failed to send message');
      }
    },     

    async uploadMediaFile(file) {
      console.log('[uploadMediaFile] Uploading file:', file.name || 'Audio Blob');
      const formData = new FormData();
      formData.append('file', file);
      
      // Reset progress to 0 before starting
      this.mediaUploadProgress = 0;
      try {

        const token = localStorage.getItem('token');

        const response = await axios.post(`${uploadurl}/upload`, formData, {
          headers: { Authorization: `Bearer ${token}` },
          onUploadProgress: progressEvent => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            this.mediaUploadProgress = percentCompleted;
            // console.log('[uploadMediaFile] Progress:', percentCompleted);
          }
        });
        // console.log('[uploadMediaFile] Upload complete:', response.data);
        // Reset progress once done
        this.mediaUploadProgress = 0;
        // Return the fileUrl from Cloudinary (or your file storage)
        return response.data.fileUrl;
      } catch (error) {
        this.mediaUploadProgress = 0;
        console.log('[uploadMediaFile] Upload error:', error);
        throw error;
      }
    },
    
    async sendMediaMessage(file) {
      try {
        // Use the correct function name to upload the media file.
        const fileUrl = await this.uploadMediaFile(file);
        // Now send a new message with the fileUrl
        const authStoreInstance = useAuthStore();
        const messageData = {
          chatId: this.selectedChat._id,
          content: '', // For media messages, content can be empty or a caption if you like.
          fileUrl,     // URL of the uploaded media
          iv: 'dummy', // Use a dummy IV for media messages (or update as needed)
          sender: localStorage.getItem('userId') || authStoreInstance.user?._id,
        };
        // console.log('[sendMediaMessage] Message Data:', messageData);
        this.socket.emit('sendMessage', messageData, (response) => {
          if (response?.success) {
            // console.log('[sendMediaMessage] Message sent:', response.data);
            this.messages.push(response.data);
          } else {
            console.log('[sendMediaMessage] Failed to send media message:', response);
            toast.error(response?.message || 'Failed to send media message');
          }
        });
      } catch (error) {
        console.log('[sendMediaMessage] Error:', error);
      }
    },

    async startAudioRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.recordedChunks = [];
        const mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder = mediaRecorder;
        this.recording = true;
        
        mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          // When recording stops, create a Blob and upload it.
          const audioBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
          // Optionally, convert Blob to File (if your upload API needs a File object)
          // const audioFile = new File([audioBlob], "audio_message.webm", { type: 'audio/webm' });
          try {
            const fileUrl = await this.uploadMediaFile(audioBlob);
            console.log('[startAudioRecording] File uploaded, URL:', fileUrl);
            // Now send a media message with fileUrl.
            const authStoreInstance = useAuthStore();
            const messageData = {
              chatId: this.selectedChat._id,
              content: '', // no text content
              fileUrl,     // the uploaded media URL
              iv: 'dummy', // use a dummy IV for media (or update if you implement encryption)
              sender: localStorage.getItem('userId') || authStoreInstance.user?._id,
            };
            this.socket.emit('sendMessage', messageData, (response) => {
              if (response?.success) {
                console.log('[startAudioRecording] Media message sent:', response.data);
                this.messages.push(response.data);
              } else {
                console.error('[startAudioRecording] Failed to send media message:', response);
                toast.error(response?.message || 'Failed to send audio message');
              }
            });
          } catch (uploadError) {
            console.error('[startAudioRecording] Upload error:', uploadError);
            toast.error('Failed to upload audio message');
          }
          this.recording = false;
        };

        mediaRecorder.start();
        console.log('[startAudioRecording] Recording started');
      } catch (error) {
        console.error('[startAudioRecording] Error starting audio recording:', error);
        toast.error('Failed to start audio recording');
      }
    },

    stopAudioRecording() {
      if (this.mediaRecorder && this.recording) {
        this.mediaRecorder.stop();
        console.log('[stopAudioRecording] Recording stopped');
      }
    },  

    async startVoiceCall() {
      try {
        console.log('[startVoiceCall] Requesting local audio stream...');
        this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('[startVoiceCall] Local audio stream obtained.');
    
        // Create the RTCPeerConnection with a public STUN server.
        this.peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });
        console.log('[startVoiceCall] RTCPeerConnection created.');
    
        // Add local audio tracks.
        this.localStream.getTracks().forEach(track => {
          this.peerConnection.addTrack(track, this.localStream);
        });
        console.log('[startVoiceCall] Local tracks added to the peer connection.');
    
        // When a remote track is received, add it to remoteStream and play.
        this.peerConnection.ontrack = (event) => {
          if (!this.remoteStream) {
            this.remoteStream = new MediaStream();
          }
          this.remoteStream.addTrack(event.track);
          if (!this.remoteAudio) {
            this.remoteAudio = new Audio();
            this.remoteAudio.srcObject = this.remoteStream;
            this.remoteAudio.play().catch(err => console.error('Error playing remote audio:', err));
          }
        };
    
        // Handle ICE candidates by sending them via socket.
        this.peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            this.socket.emit("voiceCallCandidate", {
              candidate: event.candidate,
              chatId: this.selectedChat._id
            });
            console.log('[startVoiceCall] ICE candidate generated:', event.candidate);
          }
        };
    
        // Create an SDP offer.
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        console.log('[startVoiceCall] SDP Offer created and set.');
    
        // Emit the voice call offer along with the caller's name.
        const authStoreInstance = useAuthStore();
        this.socket.emit("voiceCallOffer", {
          chatId: this.selectedChat._id,
          offer,
          caller: authStoreInstance.user._id,
          callerName: authStoreInstance.user.username
        });
        console.log('[startVoiceCall] Voice call offer sent.');
    
        // Mark call as active and start a timer.
        this.callActive = true;
        this.callStartTime = Date.now();
        this.callTimer = setInterval(() => {
          this.callDuration = Math.floor((Date.now() - this.callStartTime) / 1000);
          console.log('[startVoiceCall] Call duration:', this.callDuration, 'seconds');
        }, 1000);
      } catch (error) {
        console.error('[startVoiceCall] Error starting voice call:', error);
        toast.error("Failed to start voice call");
      }
    },
    

    async answerVoiceCall(offerData) {
      try {
        // Set that there is an incoming call
        this.callIncoming = true;
        // Get local audio stream
        this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Create new RTCPeerConnection
        this.peerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" }
          ]
        });
        this.localStream.getTracks().forEach(track => {
          this.peerConnection.addTrack(track, this.localStream);
        });

        // Handle remote track reception
        this.peerConnection.ontrack = (event) => {
          if (!this.remoteStream) {
            this.remoteStream = new MediaStream();
          }
          this.remoteStream.addTrack(event.track);
        };

        this.peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            this.socket.emit("voiceCallCandidate", {
              candidate: event.candidate,
              chatId: this.selectedChat._id
            });
          }
        };

        // Set the remote description using the incoming offer
        await this.peerConnection.setRemoteDescription(offerData.offer);
        // Create an answer
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        // Send answer back via socket
        this.socket.emit("voiceCallAnswer", {
          chatId: this.selectedChat._id,
          answer,
          caller: offerData.caller
        });

        this.callActive = true;
        this.callIncoming = false;
        console.log("[answerVoiceCall] Answer sent.");
      } catch (error) {
        console.error("[answerVoiceCall] Error answering voice call:", error);
        toast.error("Failed to answer voice call");
      }
    },

    hangUpVoiceCall() {
      // Stop local media tracks.
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }
      // Stop remote media tracks.
      if (this.remoteStream) {
        this.remoteStream.getTracks().forEach(track => track.stop());
        this.remoteStream = null;
      }
      // Close the peer connection.
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }
      // Stop and clear the call timer.
      if (this.callTimer) {
        clearInterval(this.callTimer);
        this.callTimer = null;
        this.callDuration = 0;
      }
      this.callActive = false;
      console.log('[hangUpVoiceCall] Voice call ended.');
      // Optionally, emit a hang-up event so the remote peer knows the call ended.
      if (this.socket && this.selectedChat) {
        this.socket.emit("hangUpVoiceCall", { chatId: this.selectedChat._id });
      }
    },

    // Add handlers for incoming signaling events:
    async handleIncomingOffer(data) {
      console.log("[handleIncomingOffer] Received offer:", data);
      // You can show a UI prompt to the user to accept the call.
      // For demo, we answer immediately:
      await this.answerVoiceCall(data);
    },

    async handleIncomingAnswer(data) {
      console.log("[handleIncomingAnswer] Received answer:", data);
      if (this.peerConnection) {
        await this.peerConnection.setRemoteDescription(data.answer);
      }
    },

    async handleIncomingCandidate(data) {
      if (this.peerConnection) {
        try {
          await this.peerConnection.addIceCandidate(data.candidate);
        } catch (error) {
          console.error("[handleIncomingCandidate] Error adding ICE candidate:", error);
        }
      }
    },
    
    async getAIResponse(prompt) {
      console.log('[getAIResponse] Prompt:', prompt);
      try {
        // Our AI endpoint expects a JSON with "messages" as an array of message objects
        const response = await axios.post(`${aiUrl}/chat`, {
          messages: [{ role: "user", content: prompt }]
        });
        console.log('[getAIResponse] Response from AI endpoint:', response.data);
        if (response.data.success) {
          // Return only the AI message text
          return response.data.message;
        } else {
          toast.error('Failed to get AI response');
          return null;
        }
      } catch (error) {
        console.error('[getAIResponse] Error:', error.response ? error.response.data : error.message);
        toast.error(error.response?.data?.message || "Error calling AI API");
        throw error;
      }
    },

    startTyping() {
      if (!this.selectedChat || !this.socket) return;     
      this.socket.emit('typing', {
      chatId: this.selectedChat._id,
      userId: useAuthStore().user._id,
      });

      // Set a timeout to stop typing after 3 seconds
      setTimeout(() => {
      this.stopTyping();
      }, 5000);
    },

    stopTyping() {
      if (this.socket && this.selectedChat) {      
        this.socket.emit('stopTyping', {
          chatId: this.selectedChat._id,
          userId: useAuthStore().user?._id,
        });
      }
    }
  }
});
