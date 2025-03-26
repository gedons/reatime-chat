<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white font-semibold">
    <!-- Scroll to Top Button -->
    <button 
      v-show="showScrollButton"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 p-4 bg-white text-blue-600 rounded-full shadow-xl hover:scale-105 transition-transform duration-300 z-40"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
      </svg>
    </button>

    <!-- Navbar -->
    <nav 
      class="p-6 fixed w-full z-50 transition-all duration-300"
      :class="{
        'bg-white text-gray-900 shadow-md': isScrolled || isMenuOpen,
        'md:bg-white/5 md:text-white md:backdrop-blur-md md:border-b md:border-white/10': !isScrolled && !isMenuOpen,
        'bg-white text-gray-900': isMenuOpen
      }"
    >
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-2xl font-semibold flex items-center space-x-2">          
          <img class="w-8 h-8" src="/chat.svg"/>
          <span>ChatterBox</span>
        </div>
        
        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-8">
          <a href="#hero" @click.prevent="scrollToSection('hero')" class="hover:text-purple-300 transition-all duration-300 relative group">
            Home
            <span class="absolute -bottom-1 left-0 w-0 h-[2px] bg-purple-300 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#features" @click.prevent="scrollToSection('features')" class="hover:text-purple-300 transition-all duration-300 relative group">
            Features
            <span class="absolute -bottom-1 left-0 w-0 h-[2px] bg-purple-300 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#pricing" @click.prevent="scrollToSection('pricing')" class="hover:text-purple-300 transition-all duration-300 relative group">
            Pricing
            <span class="absolute -bottom-1 left-0 w-0 h-[2px] bg-purple-300 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#cta" @click.prevent="scrollToSection('cta')" class="text-white bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 rounded-full hover:scale-105 transition-transform duration-300 shadow-lg">
            Sign Up
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="isMenuOpen = !isMenuOpen" class="md:hidden cursor-pointer p-2 rounded-lg transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMenuOpen" class="md:hidden absolute top-full left-0 right-0 bg-white text-gray-900 shadow-lg">
        <div class="container mx-auto px-6 py-4 flex flex-col space-y-4">
          <a href="#hero" @click.prevent="scrollToSection('hero')" class="hover:text-purple-500 py-2 transition-colors">Home</a>
          <a href="#features" @click.prevent="scrollToSection('features')" class="hover:text-purple-500 py-2 transition-colors">Features</a>
          <a href="#pricing" @click.prevent="scrollToSection('pricing')" class="hover:text-purple-500 py-2 transition-colors">Pricing</a>
          <a href="#cta" @click.prevent="scrollToSection('cta')" class="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full text-center hover:opacity-90 transition-opacity">
            Sign Up
          </a>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="hero" class="container mx-auto px-6 pt-32 pb-20 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-6xl font-semibold mb-6 leading-tight animate-fadeInUp">
          Connect Beyond Boundaries with
          <span class="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">ChatterBox</span>
        </h1>
        <p class="text-xl md:text-2xl text-gray-200 mb-12 animate-fadeInUp delay-100">
          Revolutionize your communication with AI-powered, secure, and intuitive messaging.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4 animate-fadeInUp delay-200">
          <router-link to="/register" class="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-xl">
            Start Free Trial
          </router-link>
          <button class="border-2 cursor-pointer border-white/30 px-8 py-4 rounded-full font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center justify-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Watch Demo
          </button>
        </div>
        <div class="mt-16 animate-fadeInUp delay-300">
          <div class="relative max-w-4xl mx-auto bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-1 rounded-2xl shadow-2xl">
            <img src="https://herobot.app/wp-content/uploads/2022/11/11-Reasons-Why-A-Chat-Application-Is-Great-For-Business_1.jpg" 
                alt="Chat Interface"
                class="rounded-xl transform hover:scale-[1.01] transition-transform duration-300">
            <div class="absolute inset-0 bg-gradient-to-t from-blue-600/40 to-transparent rounded-xl"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="bg-gray-50 text-gray-900 py-20">
      <div class="container mx-auto px-6">
        <div class="max-w-4xl mx-auto text-center mb-16">
          <h2 class="text-4xl font-semibold mb-6">Transform Your Communication</h2>
          <p class="text-gray-600 text-lg">Next-generation features designed for modern teams and individuals</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-semibold mb-4">Lightning-Fast Messaging</h3>
            <p class="text-gray-600">Near-instant delivery with our distributed network architecture</p>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-semibold mb-4">Advanced File Sharing</h3>
            <p class="text-gray-600">Share documents, images, and videos with built-in preview and cloud storage</p>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div class="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <h3 class="text-2xl font-semibold mb-4">AI-Powered Smart Replies</h3>
            <p class="text-gray-600">Get intelligent response suggestions powered by machine learning</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
      <div class="container mx-auto px-6">
        <div class="max-w-4xl mx-auto text-center mb-16">
          <h2 class="text-4xl text-gray-950 font-semibold mb-4">Simple, Transparent Pricing</h2>
          <p class="text-gray-600 text-lg">Choose the plan that works best for you or your team</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Free Tier -->
          <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 class="text-2xl font-semibold mb-4 text-gray-950">Starter</h3>
            <div class="text-4xl font-bold mb-6">
              <span class="text-3xl text-gray-700">$0 </span>
              <span class="text-lg text-gray-500">/month</span>
            </div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Basic Messaging
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                5GB File Storage
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Group Chats
              </li>
            </ul>
            <button class="w-full py-3 rounded-full border-2 border-purple-600 text-purple-600 hover:bg-purple-600 cursor-pointer hover:text-white transition-colors duration-300">
              Get Started
            </button>
          </div>

          <!-- Pro Tier (Featured) -->
          <div class="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
            <div class="mb-4">
              <span class="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-bold">Most Popular</span>
            </div>
            <h3 class="text-2xl font-semibold mb-4">Professional</h3>
            <div class="text-4xl font-bold mb-6">
              <span class="text-3xl">$</span>12
              <span class="text-lg text-purple-200">/month</span>
            </div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Unlimited Messaging
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                50GB File Storage
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                AI Smart Replies
              </li>
            </ul>
            <button class="w-full py-3 rounded-full bg-white text-purple-600 cursor-pointer hover:bg-gray-100 transition-colors duration-300">
              Start Free Trial
            </button>
          </div>

          <!-- Enterprise Tier -->
          <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 class="text-2xl font-semibold mb-4 text-gray-700">Enterprise</h3>
            <div class="text-4xl font-bold mb-6">
              <span class="text-3xl text-gray-700">$29 </span>
              <span class="text-lg text-gray-500">/month</span>
            </div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Everything in Pro
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Team Management
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Priority Support
              </li>
            </ul>
            <button class="w-full py-3 rounded-full border-2 border-purple-600 text-purple-600 hover:bg-purple-600 cursor-pointer hover:text-white transition-colors duration-300">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section id="cta" class="relative bg-gradient-to-r from-blue-700 to-purple-700 py-24 overflow-hidden">
      <div class="container mx-auto px-6 text-center relative z-10">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-4xl font-semibold mb-6">Ready for the Future of Chat?</h2>
          <p class="text-xl text-gray-200 mb-8">Join 1M+ users transforming their communication daily</p>
          <div class="flex justify-center gap-4">
            <router-link to="/register" class="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform duration-300 flex items-center gap-2 shadow-xl">
              Start Free Trial
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </router-link>
          </div>
        </div>
      </div>
      <div class="absolute inset-0 opacity-10 z-0">
        <div class="pattern-dots pattern-blue-500 pattern-opacity-20 pattern-size-4 w-full h-full"></div>
      </div>
    </section>


    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-300 py-12">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Footer columns content -->
        </div>
        <div class="border-t border-gray-800 mt-12 pt-8 text-center">
          <p>&copy; 2025 ChatterBox. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      isMenuOpen: false,
      isScrolled: false,
      showScrollButton: false
    }
  },
  methods: {
    scrollToSection(sectionId) {
      this.isMenuOpen = false;
      const section = document.getElementById(sectionId);
      if (section) {
        const offset = 80; 
        const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
          top: sectionTop,
          behavior: 'smooth'
        });
      }
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
      this.showScrollButton = window.scrollY > 300;
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
};
</script>

<style scoped>
.animate-fadeInUp {
  animation: fadeInUp 0.8s ease-out forwards;
}

.delay-100 {
  animation-delay: 0.2s;
}

.delay-200 {
  animation-delay: 0.4s;
}

.delay-300 {
  animation-delay: 0.6s;
}

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

.pattern-dots {
  background-image: radial-gradient(currentColor 1px, transparent 1px);
  background-size: calc(10 * 1px) calc(10 * 1px);
}
</style>