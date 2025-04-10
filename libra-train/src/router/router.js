import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Registration from '@/pages/Registration.vue';
import NewsSingle from '@/pages/NewsSingle.vue';

const routes = [
  {
    path: '/',
    component: Home,
    meta: {
      title: 'Главная страница'
    }
  },
  {
    path: '/register',
    component: Registration,
    meta: {
      title: 'Регистрация'
    }
  },
  {
    path: '/news:slug',
    component: NewsSingle,
    props: true,
    meta: {
      title: 'Новость'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Автоматическое обновление title страницы
router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.find(record => record.meta.title);
  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  }
  next();
});

// Отслеживание переходов для Google Analytics
router.afterEach((to) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', 'G-R4F3MW01BJ', {
      page_path: to.fullPath,
      page_title: to.meta.title || document.title // Используем meta.title или document.title
    });
  }
});

export default router;