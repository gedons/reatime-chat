<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Card from 'primevue/card';
import FloatLabel from 'primevue/floatlabel';

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
  <div class="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 p-4">
    <Card class="w-full max-w-md shadow-xl">
        <template #title>
            <div class="text-center text-2xl font-bold mb-2">Welcome Back!</div>
        </template>
        <template #content>
            <form @submit.prevent="login" class="flex flex-col gap-6 mt-4">
                <FloatLabel>
                    <InputText id="email" v-model="email" type="email" class="w-full" required />
                    <label for="email">Email</label>
                </FloatLabel>

                <FloatLabel>
                    <Password id="password" v-model="password" :feedback="false" toggleMask class="w-full" :inputClass="'w-full'" required />
                    <label for="password">Password</label>
                </FloatLabel>

                <Button type="submit" label="Login" :loading="isLoading" class="w-full" />
            </form>

            <div class="mt-6 text-center text-sm text-surface-600 dark:text-surface-400">
                Don't have an account?
                <router-link to="/register" class="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Register here</router-link>
            </div>
        </template>
    </Card>
  </div>
</template>
