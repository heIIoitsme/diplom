
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/router.js'
import Notifications from '@kyvg/vue3-notification'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

// 1. Настраиваем Axios-интерцепторы

// Перед каждым запросом: подставляем валидный токен
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const { exp } = jwtDecode(token)
      if (Date.now() < exp * 1000) {
        config.headers.Authorization = `Bearer ${token}`
      } else {
        // Токен истёк — удаляем
        localStorage.removeItem('token')
      }
    } catch {
      localStorage.removeItem('token')
    }
  }
  return config
})

// После ответа: при 401 — очищаем токен (и можно редиректить)
axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      // Опционально: сразу вернуть пользователя на регистрацию
      // router.push('/register')
    }
    return Promise.reject(err)
  }
)

// 2. Инициализация Vue-приложения
const app = createApp(App)

app.config.errorHandler = err => {
  console.error('Global error:', err)
}

// 3. Передаём Axios в глобальный контекст (если хочешь)
app.config.globalProperties.$axios = axios

app
  .use(router)
  .use(Notifications)
  .mount('#app')