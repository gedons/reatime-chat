// src/stores/auth.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
// Import ECDH functions from our crypto module
import { generateECDHKeys, exportPublicKey } from '../utils/crypto';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const token = ref(localStorage.getItem('token') || '');
  const router = useRouter();
  const toast = useToast();
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const url = `${baseUrl}/api/auth`;

  // Set Axios Authorization header if token exists
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  }

  const isAuthenticated = computed(() => !!user.value);
  const currentUserId = computed(() => user.value?._id || null);

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${url}/login`, credentials);

      if (!response.data.token || !response.data.user) {
        throw new Error('Invalid response from server');
      }

      token.value = response.data.token;
      user.value = response.data.user; // Store the user object from the server

      // Generate ECDH key pair on login
      console.log('[login] Generating ECDH key pair...');
      const keyPair = await generateECDHKeys();
      // Export the public key so that it can be shared with others (or stored in the backend)
      const exportedPublicKey = await exportPublicKey(keyPair.publicKey);
      // Attach the keys to the user object (private key remains only in memory)
      user.value.ecdhPublicKey = exportedPublicKey;
      user.value.ecdhPrivateKey = keyPair.privateKey; // Do not persist private key in localStorage

      // Save token and updated user to localStorage (only store public key)
      localStorage.setItem('token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));

      // Set Axios Authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;

      toast.success('Login successful');
      router.push('/chat');
    } catch (error) {
      console.error('Login Error:', error.response || error.message);
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData) => {
    try {
      await axios.post(`${url}/register`, userData);
      toast.success('Registration successful! You can now log in.');
      router.push('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    token.value = '';
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    delete axios.defaults.headers.common['Authorization'];

    toast.success('Logged out');
    router.push('/login');
  };

  return { user, token, isAuthenticated, currentUserId, login, register, logout };
});
