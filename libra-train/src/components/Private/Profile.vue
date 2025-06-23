<template>
    <div v-if="user" class="container">
        <div class="profile_full">
            <div class="profile_main">
              <div class="avatar" :style="{ backgroundColor: avatarColor }">
                {{ user.username?.charAt(0).toUpperCase() }}
              </div>
              <h1 class="nickname">{{ user.username }}</h1>
            </div>
            <div class="profile_other">
                <div class="profile_second">
                <div class="profile_last">
                  <span>Последнее прочитанное</span>
                  <template v-if="statsUser.lastReadBook">
                    <router-link :to="`/book/${statsUser.lastReadBook._id}`" class="router-link-custom">
                      <div class="book-card">
                        <img
                          class="book-img"
                          :src="require(`@/assets/covers/${statsUser.lastReadBook.cover}`)"
                          alt="Обложка книги"
                        />
                        <div class="book-info">
                          <div>
                            <div class="book-title">{{ statsUser.lastReadBook.title }}</div>
                            <div class="book-author">
                              {{ statsUser.lastReadBook.author[0]?.fullName }}
                            </div>
                          </div>
                          <div class="user-rating">
                            Оценка пользователя:
                            {{ statsUser.lastReadBook.userRating !== null
                              ? statsUser.lastReadBook.userRating
                              : '—' }}
                          </div>
                        </div>
                      </div>
                    </router-link>
                  </template>
                  <p v-else>Этот пользователь еще не прочитал ни одной книги</p>
                </div>
                    <div class="profile_stata">
                        <router-link :to="`/profile/lists`" class="router-link-custom"><span>Список книг</span></router-link>
                    </div>
                </div>
                <div class="profile_time"></div>
                <div class="profile_end">
                    <div class="admin_statistic" v-if="user?.role === 'admin'">
                        <a>Статистика сайта</a>
                        <h2>Всего книг в системе: {{ statsGeneral.totalBooks }}</h2>
                        <h2>Всего книг прочитано: {{ statsGeneral.totalRead }}</h2>
                        <h2>Самый популярный жанр: {{ statsGeneral.topGenre || '—' }}</h2>
                        <h2>Самая популярная книга: {{ statsGeneral.topBookTitle || '—' }}</h2>
                        <h2>Самая высокооцененная книга: {{ statsGeneral.topRatedBookTitle || '—' }}</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <p v-else>Загрузка...</p>
  </template>
  
<script setup>
import { reactive, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { useProfile } from './useProfile.js'
import { getLastReadBook } from './LastBook.js'

const { user } = useProfile()

// Общая статистика по всем книгам и всем user-books
const statsGeneral = reactive({
  totalBooks: 0,
  totalRead: 0,
  topGenre: '',
  topBookTitle: '',
  topRatedBookTitle: ''
})

// Статистика по конкретному пользователю
const statsUser = reactive({
  lastReadBook: null
})

// ⛳️ ВАЖНО: следим за user отдельно, вне onMounted
watch(user, async (newUser) => {
  if (newUser && newUser._id) {
    try {
      const { data: userBooks } = await axios.get(`${process.env.VUE_APP_API_URL}/api/user-books/user/${newUser._id}`)
      const { data: books } = await axios.get(`${process.env.VUE_APP_API_URL}/api/books`)
      const lastBook = getLastReadBook(userBooks, books)
      statsUser.lastReadBook = lastBook || null
    } catch (e) {
      console.error('Ошибка загрузки пользовательской статистики:', e)
    }
  }
}, { immediate: true })

// Загружаем общую статистику один раз при монтировании
onMounted(async () => {
  try {
    // 1) Все книги
    const { data: books } = await axios.get(`${process.env.VUE_APP_API_URL}/api/books`)
    statsGeneral.totalBooks = books.length

    // 2) Все user-books
    const { data: allUserBooks } = await axios.get(`${process.env.VUE_APP_API_URL}/api/user-books/all`)

    // 3) Прочитанные
    statsGeneral.totalRead = allUserBooks.filter(ub => ub.status?.toLowerCase() === 'прочитано').length

    // 4) Популярный жанр
    const genreCount = {}
    for (const ub of allUserBooks) {
      const book = books.find(b => b._id === ub.bookId) || (ub.book && ub.book[0])
      const genres = book?.genre || []
      genres.forEach(g => {
        genreCount[g] = (genreCount[g] || 0) + 1
      })
    }
    statsGeneral.topGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0]?.[0] || ''

    // 5) Самая популярная книга
    const bookCount = {}
    for (const ub of allUserBooks) {
      const id = ub.bookId
      bookCount[id] = (bookCount[id] || 0) + 1
    }
    const topBookId = Object.entries(bookCount).sort((a, b) => b[1] - a[1])[0]?.[0]
    statsGeneral.topBookTitle = books.find(b => b._id === topBookId)?.title || ''

    // 6) Самая высокооцененная книга
    const ratingAcc = {}
    const ratingNum = {}
    for (const ub of allUserBooks) {
      if (ub.rating != null) {
        const id = ub.bookId
        ratingAcc[id] = (ratingAcc[id] || 0) + ub.rating
        ratingNum[id] = (ratingNum[id] || 0) + 1
      }
    }
    const avgRating = Object.entries(ratingAcc).map(([id, sum]) => ({
      id,
      avg: sum / ratingNum[id]
    }))
    const topRated = avgRating.sort((a, b) => b.avg - a.avg)[0]
    statsGeneral.topRatedBookTitle = books.find(b => b._id === topRated?.id)?.title || ''

  } catch (e) {
    console.error('Ошибка загрузки общей статистики:', e)
  }
})

// Цвет аватарки по нику
const avatarColor = computed(() => user.value ? getColorFromUsername(user.value.username) : '#ccc')

function getColorFromUsername(username) {
  const colors = ['#6c5ce7', '#00b894', '#0984e3', '#fd79a8', '#e17055', '#fab1a0', '#55efc4', '#ffeaa7']
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % colors.length
  return colors[index]
}
</script>
  
  <style scoped>
  .container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px
  }
  
  .profile_full {
      width: 1400px;
      height: 800px;
      display: flex;
      gap: 40px;
      position: relative;
  }
  
  .profile_main {
      width: 360px;
      height: 100%;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      border-radius: 20px;
      gap: 10px;
  }
  
  .profile_other {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 30px;
  }
  
  .profile_second {
      display: flex;
      gap: 40px;
      height: 300px;
  }
  
  .profile_last {
      width: 480px;
      background-color: #ffffff;
      border-radius: 20px;
  }
  .profile_last span {
    display: block;
    font-size: 32px;
    margin: 20px;
  }
  .profile_last p {
    display: flex;
    justify-content: center;
    align-items: center;
    font-style: italic;
  }
  
  .profile_stata {
      width: 480px;
      background-color: #ffffff;
      border-radius: 20px;
  }
  .profile_stata a {
    display: block;
    font-size: 32px;
    margin: 20px;
  }
  
  .profile_time {
      height: 140px;
      background-color: #ffffff;
      border-radius: 20px;
  }
  
  .profile_end {
      height: 410px;
      background-color: #ffffff;
      border-radius: 20px;
  }
.profile_end a {
    display: block;
    font-size: 32px;
    margin: 20px;
}
  .admin_statidtic h1,
  .admin_statistic h2 {
    padding-left: 35px;
    font-weight: normal;
}
  
  .avatar {
      height: 250px;
      width: 250px;
      border-radius: 50%;
      background-color: #f0f0f0;
      margin-top: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 96px;
      font-weight: bold;
      text-transform: uppercase;
  }
  
  .nickname {
      text-align: center;
      margin: 0px
  }

  .router-link-custom{
    text-decoration: none;
    display: inline-block;
    color: inherit;
  }

  .book-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-radius: 8px;
  margin: 0px 20px 20px;
}

.book-img {
  width: 135px;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
}

.book-info {
  height: 180px;
  width: 290px;
  display: flex;
  flex-direction: column;
  justify-content:space-between;
}

.book-title {
  font-size: 30px;
}

.book-author {
  color: #666;
  font-size: 26px;
}

.user-rating {
  font-size: 22px;
}
  </style>