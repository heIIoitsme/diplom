import { createRouter, createWebHistory } from 'vue-router';

// Статический импорт всех компонентов, которые вы используете в маршрутах
import Home from '@/pages/Home.vue';
import Registration from '@/pages/Registration.vue';
import NewsSingle from '@/pages/NewsSingle.vue';
import Profile from '@/components/Private/Profile.vue';
import UserProfile from '@/components/Public/UserProfile.vue';
import FullBook from '@/components/FullBook.vue';
import Lists from '@/components/Private/Lists.vue';
import UserLists from '@/components/Public/UserLists.vue';
import AllBooks from '@/components/AllBooks.vue';
import AllCategoryBooks from '@/components/AllCategoryBooks.vue';

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
    meta: { title: 'Профиль', requiresAuth: true },
    children: [
      {
        path:'',
        name: 'Profile',
        component: Profile,
      },
      {
        path:'lists',
        name: 'Lists',
        component: Lists,
        props: true
      }
    ]
  },
  {
    path: '/user/:username',
    name: 'UserProfile',
    component: UserProfile,
    props: true
  },
    {
    path: '/user/:username/lists',
    name: 'UserLists',
    component: UserLists,
    props: true
  },
  {
    path: '/book/:id',
    name: 'FullBook',
    component: FullBook,
    props: true,
    meta: { title: 'Книга'}
  },
  {
    path: '/books',
    name: 'AllBooks',
    component: AllBooks,
    props: true,
    meta: { title: 'Книга'}
  },
  {
    path: '/category/:slug',
    name: 'AllCategoryBooks',
    component: AllCategoryBooks,
    props: true,
    meta: { title: 'Книга'}
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }; // Всегда прокручивать наверх
  }
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