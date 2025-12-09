<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
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
  <div class="min-h-screen w-full flex bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans">
    <!-- Left Panel (Visual) -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 dark:bg-slate-950 justify-center items-center">
        <!-- Abstract Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 backdrop-blur-xl z-0"></div>
        <div class="absolute top-0 left-0 right-0 h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxmaWx0ZXIgaWQ9Im4iPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjUiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMDAwMDAiIG9wYWNpdHk9IjAuNSIgZmlsdGVyPSJ1cmwoI24pIi8+PC9zdmc+')] opacity-20 mix-blend-overlay z-0"></div>
        
        <!-- Animated Blobs -->
        <div class="absolute -top-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div class="absolute top-1/2 -right-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <!-- Content -->
        <div class="relative z-10 p-12 text-white max-w-lg">
            <div class="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
                <i class="pi pi-comments text-3xl text-white"></i>
            </div>
            <h1 class="text-5xl font-bold mb-6 leading-tight">Connect with <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-200">Confidence</span></h1>
            <p class="text-xl text-white/80 leading-relaxed mb-8">
                Experience the next generation of messaging. Secure, fast, and designed for you.
            </p>
            
             <div class="flex items-center gap-4 hidden">
                 <!-- Placeholders for user avatars if needed -->
                 <div class="flex -space-x-4">
                     <div class="w-10 h-10 rounded-full bg-indigo-400 border-2 border-slate-900"></div>
                     <div class="w-10 h-10 rounded-full bg-purple-400 border-2 border-slate-900"></div>
                     <div class="w-10 h-10 rounded-full bg-emerald-400 border-2 border-slate-900"></div>
                 </div>
                 <span class="text-sm font-medium text-white/70">Joined by 10k+ developers</span>
             </div>
        </div>
    </div>

    <!-- Right Panel (Form) -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
       <!-- Mobile Background Decoration -->
       <div class="lg:hidden absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 z-0"></div>

        <div class="w-full max-w-md space-y-8 relative z-10">
            <!-- Mobile Header -->
            <div class="lg:hidden text-center mb-8">
                 <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white mb-4 shadow-lg shadow-indigo-600/30">
                    <i class="pi pi-comments text-xl"></i>
                </div>
                <h2 class="text-2xl font-bold">Welcome Back</h2>
            </div>
            
            <div class="space-y-2">
                <h2 class="hidden lg:block text-3xl font-bold tracking-tight">Welcome back</h2>
                <p class="text-slate-500 dark:text-slate-400">Please enter your details to sign in.</p>
            </div>

            <form @submit.prevent="login" class="space-y-6">
                <div class="space-y-2">
                    <label for="email" class="text-sm font-medium">Email</label>
                    <InputText id="email" v-model="email" type="email" class="w-full" placeholder="name@company.com" />
                </div>

                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <label for="password" class="text-sm font-medium">Password</label>
                         <a href="#" class="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Forgot password?</a>
                    </div>
                    <Password id="password" v-model="password" :feedback="false" toggleMask class="w-full" inputClass="w-full" placeholder="••••••••" />
                </div>

                <div class="flex items-center gap-2">
                    <Checkbox v-model="rememberMe" inputId="remember" :binary="true" />
                    <label for="remember" class="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">Remember for 30 days</label>
                </div>

                <Button type="submit" label="Sign In" :loading="isLoading" class="w-full font-semibold bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white transition-all shadow-lg shadow-indigo-500/20" />
                
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <span class="w-full border-t border-slate-200 dark:border-slate-700"></span>
                    </div>
                    <div class="relative flex justify-center text-xs uppercase">
                        <span class="bg-white dark:bg-slate-950 px-2 text-slate-500">Or continue with</span>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                     <Button label="Google" severity="secondary" outlined class="w-full" icon="pi pi-google" />
                     <Button label="GitHub" severity="secondary" outlined class="w-full" icon="pi pi-github" />
                </div>
            </form>

            <p class="text-center text-sm text-slate-500 dark:text-slate-400">
                Don't have an account? 
                <router-link to="/register" class="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline">Sign up</router-link>
            </p>
        </div>
    </div>
  </div>
</template>

<style scoped>
.animate-blob {
    animation: blob 7s infinite;
}
.animation-delay-2000 {
    animation-delay: 2s;
}
.animation-delay-4000 {
    animation-delay: 4s;
}

@keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
}
</style>
