<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Card from 'primevue/card';
import FloatLabel from 'primevue/floatlabel';

const authStore = useAuthStore();
const username = ref('');
const email = ref('');
const password = ref('');
const isLoading = ref(false);

const register = async () => {
  isLoading.value = true; 
  try {
    await authStore.register({ username: username.value, email: email.value, password: password.value });
  } catch (error) {
    console.error('Registration failed:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 p-4">
    <Card class="w-full max-w-md shadow-xl">
        <template #title>
            <div class="text-center text-2xl font-bold mb-2">Create an Account</div>
        </template>
        <template #content>
            <form @submit.prevent="register" class="flex flex-col gap-6 mt-4">
                <FloatLabel>
                    <InputText id="username" v-model="username" class="w-full" required />
                    <label for="username">Username</label>
                </FloatLabel>

                <FloatLabel>
                    <InputText id="email" v-model="email" type="email" class="w-full" required />
                    <label for="email">Email</label>
                </FloatLabel>

                <FloatLabel>
                    <Password id="password" v-model="password" toggleMask class="w-full" :inputClass="'w-full'" required promptLabel="Choose a password" weakLabel="Too simple" mediumLabel="Average complexity" strongLabel="Complex password" />
                    <label for="password">Password</label>
                </FloatLabel>

                <Button type="submit" label="Register" :loading="isLoading" class="w-full" />
            </form>

            <div class="mt-6 text-center text-sm text-surface-600 dark:text-surface-400">
                Already have an account?
                <router-link to="/login" class="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Login here</router-link>
            </div>
        </template>
    </Card>
  </div>
</template>