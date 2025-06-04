import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/router.js'
import Notifications from '@kyvg/vue3-notification'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'


axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const { exp } = jwtDecode(token)
      if (Date.now() < exp * 1000) {
        config.headers.Authorization = `Bearer ${token}`
      } else {
        localStorage.removeItem('token')
      }
    } catch {
      localStorage.removeItem('token')
    }
  }
  return config
})


axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
    }
    return Promise.reject(err)
  }
)

const app = createApp(App)

app.config.errorHandler = err => {
  console.error('Global error:', err)
}

app.config.globalProperties.$axios = axios

app
  .use(router)
  .use(Notifications)
  .mount('#app')