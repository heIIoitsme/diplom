<template>
    <div v-if="book" class='container'>
        <div class='first_container'>
            <img
              class='book_img'
              :src="require(`@/assets/covers/${book.cover}`)"
            />
            <div class='main_info'>
                <a1>{{ book.title }}</a1>
                <a2>{{ book.author[0].fullName }}</a2>
                <div class='rating_info'>
                    <div>
                        <a3>Рейтинг {{ book.rating }}</a3>
                        <div>Звездочки</div>
                    </div>
                    <div class="dropdown-wrapper">
                      <button @click="toggleDropdown" class="list_button">
                        <span class="add-list">
                          {{ currentStatus ? capitalize(currentStatus) : '+  Добавить в список' }}
                        </span>
                        <span class="arrow">{{ showDropdown ? '▼' : '▶' }}</span>
                      </button>
                      <ul v-if="showDropdown" class="dropdown-menu">
                        <li v-for="s in availableStatuses" :key="s"
                            class="dropdown-item" @click="selectStatus(s)">
                          {{ capitalize(s) }}
                        </li>
                        <li v-if="currentStatus" class="dropdown-item delete"
                            @click="deleteEntry">
                          Удалить из списка
                        </li>
                      </ul>
                    </div>
                </div>
            </div>
            <div class='second_container'>
                <p>{{ book.description }}</p>
            </div>
        </div>
    </div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>Загрузка...</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const book = ref(null)
const error = ref('')
const showDropdown  = ref(false)
const currentStatus = ref(null)
const statuses      = [
  'прочитано',
  'запланировано',
  'брошено',
  'читаю',
  'отложено'
]
  const availableStatuses = computed(() => 
  statuses.filter(s => s !== currentStatus.value))

// Получаем id из маршрута и загружаем одну книгу
onMounted(async () => {
  const id = route.params.id
  try {
    const res = await axios.get(`${process.env.VUE_APP_API_URL}/api/books/${id}`)
    book.value = res.data
    console.log(res)
  } catch (err) {
    console.error('Ошибка загрузки книги:', err)
    error.value = 'Ошибка при загрузке книги'
  }


  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const resStatus = await axios.get(
      `${process.env.VUE_APP_API_URL}/api/user-books/book/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    console.log('>>> GET /api/user-books response.data:', resStatus.data)
    currentStatus.value = resStatus.data?.status || null
  } catch (e) {
    console.error('Ошибка получения статуса книги:', e)
  }
})

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

async function selectStatus(status) {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Пожалуйста, войдите в систему')
      return
    }
    const bookId = route.params.id
    await axios.post(
      `${process.env.VUE_APP_API_URL}/api/user-books`,
      { bookId, status, addedAt: new Date() },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    currentStatus.value = status
    showDropdown.value = false
  } catch (e) {
    console.error('Ошибка добавления в список:', e)
  }
}
async function deleteEntry() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return
    const bookId = route.params.id
    await axios.delete(
      `${process.env.VUE_APP_API_URL}/api/user-books/${bookId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    currentStatus.value = null
    showDropdown.value = false
  } catch (e) {
    console.error('Ошибка удаления из списка:', e)
  }
}


</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px
  }
  .first_container{
    display: flex;
    flex-direction: row;
    height: 260px;
    width: 1400px;
    border-radius: 20px;
    background-color: #fff;
  }
  .main_info {
    display: flex;
    flex-direction: column;
    padding: 20px;
  }
  .main_info a1 {
    font-size: 48px;
  }
  .main_info a2 {
    font-size: 32px;
  }
  .main_info a3 {
    font-size: 24px;
  }
  .rating_info {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
  .list_button {
    height: 25px;
    width: 170px;
    border-radius: 25px;
    background-color: black;
  }
  .list_button span {
    font-family: Kreadon;
    color: #fff;
  }
  .book_img {
    height: 220px;
    width: 135px;
    padding: 20px;
    border-radius: 30px;
  }

  .dropdown-wrapper {
  position: relative;
  display: inline-block;
}
.dropdown-menu {
  position: absolute;
  left: 0;
  margin-top: 2px;
  min-width: 170px;
  z-index: 100;
  list-style: none;
  padding: 0;
}
.dropdown-item {
  padding: 2px;
  cursor: pointer;
  font-size: 14px;
  text-align: center;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  border-right: 1px solid #C8C8C8;
  border-bottom: 1px solid #C8C8C8;
  border-left: 1px solid #C8C8C8;
}
.dropdown-item:hover {
  background: #f0f0f0;
}
.dropdown-item.delete {
  color: red;
}

.arrow {
  display: inline-block;
  margin-left: 8px;
  font-size: 10px;
  color: #fff;
}

.add-list {
  font-size: 14px;
}

</style>