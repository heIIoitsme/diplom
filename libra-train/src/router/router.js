import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Registration from '@/pages/Registration.vue';
import NewsSingle from '@/pages/NewsSingle.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/register', component: Registration },
  { path: '/news:slug', component: NewsSingle, props: true }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;