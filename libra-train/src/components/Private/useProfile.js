import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

/**
 * Хук для загрузки профиля пользователя и проверки авторизации.
 * Возвращает ref user и ref error.
 */
export function useProfile() {
  const user = ref(null)
  const error = ref('')
  const router = useRouter()

  onMounted(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      // Если нет токена — перенаправляем на регистрацию
      return router.replace('/register')
    }

    try {
      const res = await fetch(
        `${process.env.VUE_APP_API_URL}/api/profile`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )

      if (!res.ok) {
        // Токен просрочен или недействителен
        return router.replace('/register')
      }

      user.value = await res.json()
    } catch (e) {
      error.value = 'Не удалось загрузить профиль'
      console.error('useProfile error:', e)
    }
  })

  return { user, error }
}