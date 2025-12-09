<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import chatterboxImg from '@/assets/chatterbox.JPG';

const isMenuOpen = ref(false);
const isScrolled = ref(false);
const showScrollButton = ref(false);

const features = [
    {
        title: 'Real-time Messaging',
        description: 'Instant delivery with WebSocket technology ensures your conversations flow naturally without delay.',
        icon: 'pi-bolt',
        gradient: 'from-amber-400 to-orange-500'
    },
    {
        title: 'Secure Encryption',
        description: 'End-to-end encryption keeps your personal and professional conversations completely private.',
        icon: 'pi-lock',
        gradient: 'from-emerald-400 to-teal-500'
    },
    {
        title: 'Smart Analytics',
        description: 'Gain insights into team utility and communication patterns with our advanced dashboard.',
        icon: 'pi-chart-bar',
        gradient: 'from-blue-400 to-indigo-500'
    }
];

const footerCols = [
    {
        title: 'Product',
        links: ['Features', 'Integrations', 'Pricing', 'Changelog']
    },
    {
        title: 'Company',
        links: ['About Us', 'Careers', 'Blog', 'Contact']
    },
    {
        title: 'Resources',
        links: ['Community', 'Help Center', 'API Docs', 'Status']
    }
];

const scrollToSection = (sectionId) => {
  isMenuOpen.value = false;
  const section = document.getElementById(sectionId);
  if (section) {
    const offset = 80;
    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({
      top: sectionTop,
      behavior: 'smooth'
    });
  }
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
  showScrollButton.value = window.scrollY > 300;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-indigo-500 selection:text-white">
    <!-- Scroll to Top Button -->
    <button
      v-show="showScrollButton"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-indigo-600 dark:text-indigo-400 rounded-full shadow-2xl hover:scale-110 hover:-translate-y-1 transition-all duration-300 z-50 border border-indigo-100 dark:border-slate-700"
    >
      <i class="pi pi-arrow-up text-xl font-bold"></i>
    </button>

    <!-- Navbar -->
    <nav
      class="fixed w-full z-50 transition-all duration-500 border-b border-transparent"
      :class="{
        'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-lg border-slate-200 dark:border-slate-800 py-3': isScrolled,
        'bg-transparent py-6': !isScrolled
      }"
    >
      <div class="container mx-auto px-6 flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center gap-3 cursor-pointer group" @click="scrollToTop">
          <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-400 text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
             <i class="pi pi-comments text-xl"></i>
          </div>
          <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
            ChatterBox
          </span>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-8">
          <a v-for="item in ['Features', 'Pricing', 'Testimonials']" 
             :key="item"
             :href="`#${item.toLowerCase()}`" 
             @click.prevent="scrollToSection(item.toLowerCase())" 
             class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group"
          >
            {{ item }}
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>

        <!-- Action Buttons -->
        <div class="hidden md:flex items-center gap-4">
          <router-link to="/login" class="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors">
            Sign In
          </router-link>
          <router-link to="/register">
             <button class="px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-105 transition-all duration-300">
                Get Started
             </button>
          </router-link>
        </div>

        <!-- Mobile Menu Toggle -->
        <button @click="isMenuOpen = !isMenuOpen" class="md:hidden p-2 text-slate-600 dark:text-slate-300">
          <i :class="['pi text-xl', isMenuOpen ? 'pi-times' : 'pi-bars']"></i>
        </button>
      </div>

      <!-- Mobile Menu -->
      <transition enter-active-class="transition duration-200 ease-out"
                  enter-from-class="transform -translate-y-2 opacity-0"
                  enter-to-class="transform translate-y-0 opacity-100"
                  leave-active-class="transition duration-150 ease-in"
                  leave-from-class="transform translate-y-0 opacity-100"
                  leave-to-class="transform -translate-y-2 opacity-0">
        <div v-if="isMenuOpen" class="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 shadow-xl">
           <div class="flex flex-col p-6 gap-4">
             <a v-for="item in ['Features', 'Pricing']" 
                :key="item"
                :href="`#${item.toLowerCase()}`" 
                @click.prevent="scrollToSection(item.toLowerCase())"
                class="text-lg font-medium text-slate-600 dark:text-slate-300 py-2 border-b border-slate-100 dark:border-slate-800"
             >
                {{ item }}
             </a>
             <div class="flex flex-col gap-3 mt-4">
                <router-link to="/login" class="w-full py-3 text-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold">
                   Sign In
                </router-link>
                <router-link to="/register" class="w-full py-3 text-center rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/30">
                   Get Started
                </router-link>
             </div>
           </div>
        </div>
      </transition>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
         <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[120px] animate-blob"></div>
         <div class="absolute top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-teal-500/20 blur-[100px] animate-blob animation-delay-2000"></div>
         <div class="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 blur-[130px] animate-blob animation-delay-4000"></div>
          <div class="absolute top-0 left-0 right-0 h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxmaWx0ZXIgaWQ9Im4iPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjUiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMDAwMDAiIG9wYWNpdHk9IjAuNSIgZmlsdGVyPSJ1cmwoI24pIi8+PC9zdmc+')] opacity-[0.03] z-0"></div>
      </div>

      <div class="container mx-auto px-6 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-8 animate-fade-in-up border border-indigo-100 dark:border-indigo-800">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          v2.0 is now available
        </div>
        
        <h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] animate-fade-in-up delay-100">
          Connect beyond <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-400">boundaries.</span>
        </h1>
        
        <p class="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 animate-fade-in-up delay-200">
          Experience the next evolution of messaging. Secure, intelligent, and designed to bring people closer together than ever before.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
          <router-link to="/register" class="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg hover:shadow-2xl hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-300">
            Start Free Trial
          </router-link>
          <button class="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
            <i class="pi pi-play-circle text-xl"></i>
            Watch Demo
          </button>
        </div>

        <!-- Dashboard Preview -->
        <div class="mt-20 relative max-w-5xl mx-auto animate-fade-in-up delay-400">
           <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-teal-500 rounded-2xl blur opacity-20 dark:opacity-40"></div>
           <div class="relative bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800">
              <div class="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-white/5">
                <div class="flex gap-1.5">
                  <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div class="mx-auto w-1/3 h-2 rounded-full bg-white/5"></div>
              </div>
              <!-- Placeholder for actual screenshot or mockup -->
              <div class="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center relative overflow-hidden group">
                  <img :src="chatterboxImg" 
                       alt="App Interface" 
                       class="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                  />
                  <!-- Overlay Content Example -->
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div class="absolute bottom-10 left-10 text-left">
                       <div class="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg inline-flex items-center gap-2 mb-4">
                           <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                           <span class="text-xs font-medium text-white">Live Connection</span>
                       </div>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-24 bg-white dark:bg-slate-900 relative">
      <div class="container mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-20">
          <h2 class="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">Redefining Communication</h2>
          <p class="text-lg text-slate-600 dark:text-slate-400">Everything you need to communicate effectively, all in one platform.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(feature, index) in features" :key="index" class="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
            <div :class="`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${feature.gradient} text-white shadow-lg transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`">
              <i :class="`pi ${feature.icon} text-2xl`"></i>
            </div>
            <h3 class="text-xl font-bold mb-3 text-slate-900 dark:text-white">{{ feature.title }}</h3>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials / Social Proof -->
    <section class="py-24 bg-slate-50 dark:bg-slate-950/50 border-y border-slate-200 dark:border-slate-800">
        <div class="container mx-auto px-6 text-center">
            <p class="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-12">Trusted by innovative teams worldwide</p>
            <div class="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <!-- Simple placeholders for logos using text/icons for now -->
                <div class="flex items-center gap-2 text-2xl font-bold text-slate-800 dark:text-slate-200"><i class="pi pi-google"></i> Google</div>
                <div class="flex items-center gap-2 text-2xl font-bold text-slate-800 dark:text-slate-200"><i class="pi pi-microsoft"></i> Microsoft</div>
                <div class="flex items-center gap-2 text-2xl font-bold text-slate-800 dark:text-slate-200"><i class="pi pi-amazon"></i> Amazon</div>
                <div class="flex items-center gap-2 text-2xl font-bold text-slate-800 dark:text-slate-200"><i class="pi pi-discord"></i> Discord</div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-24 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-900/50 pointer-events-none"></div>
        <div class="container mx-auto px-6 relative z-10">
            <div class="text-center max-w-3xl mx-auto mb-20">
                <h2 class="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">Simple, Transparent Pricing</h2>
                <p class="text-lg text-slate-600 dark:text-slate-400">Choose the perfect plan for you or your team.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
                <!-- Starter -->
                <div class="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Starter</h3>
                    <div class="flex items-baseline gap-1 mb-6">
                        <span class="text-4xl font-bold text-slate-900 dark:text-white">$0</span>
                        <span class="text-slate-500">/mo</span>
                    </div>
                    <ul class="space-y-4 mb-8">
                        <li v-for="i in 3" :key="i" class="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                            <i class="pi pi-check text-green-500 text-sm"></i>
                            <span>Essential feature {{ i }}</span>
                        </li>
                    </ul>
                    <button class="w-full py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white font-semibold hover:border-indigo-600 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-colors">
                        Get Started
                    </button>
                </div>

                <!-- Pro -->
                <div class="p-8 rounded-3xl bg-slate-900 dark:bg-slate-700 text-white shadow-2xl shadow-indigo-500/20 transform md:-translate-y-4 relative overflow-hidden">
                     <div class="absolute top-0 right-0 bg-gradient-to-bl from-indigo-500 to-transparent w-24 h-24 opacity-20"></div>
                    <div class="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-4 border border-indigo-500/30">MOST POPULAR</div>
                    <h3 class="text-xl font-bold mb-2">Professional</h3>
                    <div class="flex items-baseline gap-1 mb-6">
                        <span class="text-4xl font-bold">$12</span>
                        <span class="text-white/60">/mo</span>
                    </div>
                    <ul class="space-y-4 mb-8">
                        <li v-for="i in 5" :key="i" class="flex items-center gap-3 text-white/80">
                            <i class="pi pi-check text-indigo-400 text-sm"></i>
                            <span>Advanced feature {{ i }}</span>
                        </li>
                    </ul>
                    <button class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/40 transition-all">
                        Start Free Trial
                    </button>
                </div>

                 <!-- Enterprise -->
                <div class="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Enterprise</h3>
                    <div class="flex items-baseline gap-1 mb-6">
                        <span class="text-4xl font-bold text-slate-900 dark:text-white">$29</span>
                        <span class="text-slate-500">/mo</span>
                    </div>
                    <ul class="space-y-4 mb-8">
                        <li v-for="i in 5" :key="i" class="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                            <i class="pi pi-check text-green-500 text-sm"></i>
                            <span>Enterprise feature {{ i }}</span>
                        </li>
                    </ul>
                    <button class="w-full py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white font-semibold hover:border-indigo-600 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-colors">
                        Contact Sales
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 px-6">
        <div class="container mx-auto max-w-5xl bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/30">
            <!-- Decorative circles -->
            <div class="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div class="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            
            <div class="relative z-10 text-white">
                <h2 class="text-4xl md:text-5xl font-bold mb-6">Ready to get started?</h2>
                <p class="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">Join thousands of developers and teams who trust ChatterBox for their daily communication.</p>
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                     <router-link to="/register" class="px-8 py-4 rounded-full bg-white text-indigo-600 font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                        Start for Free
                     </router-link>
                     <button class="px-8 py-4 rounded-full bg-indigo-700/50 border border-white/20 text-white font-bold text-lg hover:bg-indigo-700 transition-all duration-300">
                        View Pricing
                     </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-50 dark:bg-slate-950 pt-20 pb-10 border-t border-slate-200 dark:border-slate-800">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div class="col-span-1 md:col-span-1">
             <div class="flex items-center gap-2 mb-6">
                <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white">
                    <i class="pi pi-comments"></i>
                </div>
                <span class="text-xl font-bold text-slate-900 dark:text-white">ChatterBox</span>
             </div>
             <p class="text-slate-500 dark:text-slate-400 leading-relaxed">
                Connect beyond boundaries with the world's most advanced secure messaging platform.
             </p>
          </div>
          
          <div v-for="col in footerCols" :key="col.title">
              <h4 class="font-bold text-slate-900 dark:text-white mb-6">{{ col.title }}</h4>
              <ul class="space-y-4">
                  <li v-for="link in col.links" :key="link">
                      <a href="#" class="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{{ link }}</a>
                  </li>
              </ul>
          </div>
        </div>
        
        <div class="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>&copy; 2025 ChatterBox Inc. All rights reserved.</p>
            <div class="flex gap-6">
                <a href="#" class="hover:text-slate-900 dark:hover:text-white">Privacy Policy</a>
                <a href="#" class="hover:text-slate-900 dark:hover:text-white">Terms of Service</a>
            </div>
        </div>
      </div>
    </footer>
  </div>
</template>



<style scoped>
.animate-blob {
  animation: blob 10s infinite;
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

.animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
    opacity: 0;
}

.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>