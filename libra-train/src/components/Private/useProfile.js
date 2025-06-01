import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'          

export function useProfile() {
  const user = ref(null)
  const error = ref('')
  const router = useRouter()

  onMounted(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      return router.replace('/register')
    }

    try {
      const res = await fetch(
        `${process.env.VUE_APP_API_URL}/api/profile`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )

      if (!res.ok) {
        return router.replace('/register')
      }

      user.value = await res.json()

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } catch (e) {
      error.value = 'Не удалось загрузить профиль'
      console.error('useProfile error:', e)
    }
  })

  return { user, error }
}