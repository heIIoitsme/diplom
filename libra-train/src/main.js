import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/router.js'
import Notifications from '@kyvg/vue3-notification'

// Инициализация приложения
const app = createApp(App)

// Глобальная обработка ошибок
app.config.errorHandler = (err) => {
  console.error('Global error:', err)
}

app
  .use(router)
  .use(Notifications)
  .mount('#app')