import { createRouter, createWebHistory } from 'vue-router';

// Статический импорт всех компонентов, которые вы используете в маршрутах
import Home from '@/pages/Home.vue';
import Registration from '@/pages/Registration.vue';
import NewsSingle from '@/pages/NewsSingle.vue';
import Profile from '@/components/Profile.vue';
import UserProfile from '@/components/UserProfile.vue';
import FullBook from '@/components/FullBook.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Главная страница' }
  },
  {
    path: '/register',
    name: 'Registration',
    component: Registration,
    meta: { title: 'Регистрация' }
  },
  {
    path: '/news/:slug',
    name: 'NewsSingle',
    component: NewsSingle,
    props: true,
    meta: { title: 'Новость' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,              // ← тут теперь статически привязан
    meta: { title: 'Профиль', requiresAuth: true }
  },
  {
    path: '/user/:username',
    name: 'UserProfile',
    component: UserProfile,
    props: true      // чтобы внутри пропсами пришёл username
  },
  {
    path: '/books/:slug',
    name: 'FullBook',
    component: FullBook,
    meta: { title: 'Книга'}
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  // Берём JWT-токен из localStorage
  const token = localStorage.getItem('token');

  // Если маршрут требует авторизации и токена нет — на /register
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    return next('/register');
  }

  // Обновляем title страницы, если задано в meta
  const nearestWithTitle = to.matched.find(record => record.meta.title);
  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  }

  next();
});

export default router;