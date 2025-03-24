import { createRouter, createWebHistory } from 'vue-router';

const Index = () => import('../views/Index.vue');
const LoginView = () => import('../views/LoginView.vue');
const RegisterView = () => import('../views/RegisterView.vue');
const ChatView = () => import('../views/ChatView.vue');


const routes = [   
  { path: '/', component: Index },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/chat', component: ChatView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
