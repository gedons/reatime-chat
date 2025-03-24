<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const isLoading = ref(false); 

const login = async () => {
  isLoading.value = true; 
  try {
    await authStore.login({ email: email.value, password: password.value });    
  } catch (error) {
    console.error('Login failed:', error);    
  } finally {
    isLoading.value = false; 
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 font-semibold">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl transform transition-all duration-300 hover:scale-105">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back!</h2>
      <form @submit.prevent="login" class="space-y-6">

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Enter your email"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Enter your password"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
        </div>

        <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-purple-600 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all flex items-center justify-center"
        >
            <span v-if="!isLoading">Login</span>
            <span v-else>
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            </span>
        </button>
        
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        Don't have an account?
        <router-link to="/register" class="text-purple-600 hover:underline">Register here</router-link>
      </p>
      
    </div>
  </div>
</template>



