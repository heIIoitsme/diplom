import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Registration from '@/pages/Registration.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/register', component: Registration },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;