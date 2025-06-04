<template>
    <div v-if="user" class="container">
        <div class="profile_full">
            <div class="profile_main">
                <img 
                  class="image" 
                  :src="require(`@/assets/covers/anna-karenina.jpeg`)"
                  loading="lazy" 
                />
                <!-- Динамическое имя пользователя -->
                <h1 class="nickname">{{ user.username }}</h1>
            </div>
            <div class="profile_other">
                <div class="profile_second">
                    <div class="profile_last" v-if="stats.lastReadBook">
                      <span>Последнее прочитанное</span>
                      <div class="book-card">
                        <img
                          class="book-img"
                          :src="require(`@/assets/covers/${stats.lastReadBook.cover}`)"
                          alt="Обложка книги"
                        />
                        <div class="book-info">
                          <div>
                            <div class="book-title">{{ stats.lastReadBook.title }}</div>
                            <div class="book-author">{{ stats.lastReadBook.author[0]?.fullName }}</div>
                          </div>
                          <div class="user-rating">
                            Оценка пользователя: {{ stats.lastReadBook.userRating !== null ? stats.lastReadBook.userRating : '—' }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="profile_stata">
                        <router-link :to="`/profile/lists`" class="router-link-custom"><span>Список книг</span></router-link>
                    </div>
                </div>
                <div class="profile_time"></div>
                <div class="profile_end">
                    <div class="admin_statistic" v-if="user?.role === 'admin'">
                        <a>Статистика сайта</a>
                        <h2>Всего книг в системе: {{ stats.totalBooks }}</h2>
                        <h2>Всего книг прочитано: {{ stats.totalRead }}</h2>
                        <h2>Самый популярный жанр: {{ stats.topGenre || '—' }}</h2>
                        <h2>Самая популярная книга: {{ stats.topBookTitle || '—' }}</h2>
                        <h2>Самая высокооцененная книга: {{ stats.topRatedBookTitle || '—' }}</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <p v-else>Загрузка...</p>
  </template>
  
<script setup>
import { reactive, onMounted } from 'vue'
import axios from 'axios'
import { useProfile } from './useProfile.js'
import { getLastReadBook } from './LastBook.js'

const { user } = useProfile()

const stats = reactive({
  totalBooks: 0,
  totalRead: 0,
  topGenre: '',
  topBookTitle: '',
  topRatedBookTitle: ''
})

onMounted(async () => {
  try {
    // 1) Берём все книги
    const { data: books } = await axios.get(`${process.env.VUE_APP_API_URL}/api/books`)
    stats.totalBooks = books.length

    // 2) Берём все пользовательские книжки
    const { data: userBooks } = await axios.get(`${process.env.VUE_APP_API_URL}/api/user-books/all`)
    // в userBooks ожидаем массив { bookId: {...}, status, rating }

    // 3) Считаем, сколько прочитано
    stats.totalRead = userBooks.filter(ub => ub.status === 'прочитано' || ub.status === 'Прочитано').length

    // 4) Самый популярный жанр: считаем по userBooks
    const genreCount = {}
    for (const ub of userBooks) {
      const book = books.find(b => b._id === ub.bookId) || (ub.book && ub.book[0])
      const genres = book?.genre || []
      genres.forEach(g => {
        genreCount[g] = (genreCount[g] || 0) + 1
      })
    }
    stats.topGenre = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || ''

    // 5) Самая популярная книга: по числу записей в userBooks
    const bookCount = {}
    for (const ub of userBooks) {
      const id = ub.bookId
      bookCount[id] = (bookCount[id] || 0) + 1
    }
    const topBookId = Object.entries(bookCount)
      .sort((a, b) => b[1] - a[1])[0]?.[0]
    stats.topBookTitle = books.find(b => b._id === topBookId)?.title || ''

    // 6) Самая высокооцененная книга: по среднему rating из userBooks
    const ratingAcc = {}
    const ratingNum = {}
    for (const ub of userBooks) {
      if (ub.rating != null) {
        const id = ub.bookId
        ratingAcc[id] = (ratingAcc[id] || 0) + ub.rating
        ratingNum[id] = (ratingNum[id] || 0) + 1
      }
    }
    // вычисляем среднее
    const avgRating = Object.entries(ratingAcc).map(([id, sum]) => ({
      id,
      avg: sum / ratingNum[id]
    }))
    const topRated = avgRating.sort((a, b) => b.avg - a.avg)[0]
    stats.topRatedBookTitle = books.find(b => b._id === topRated?.id)?.title || ''

    const lastBook = getLastReadBook(userBooks, books)
      if (lastBook) {
        stats.lastReadBook = lastBook
      }

  } catch (e) {
    console.error('Ошибка загрузки статистики:', e)
  }
})
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
  
  .image {
      height: 250px;
      width: 250px;
      border-radius: 50%;
      padding: 55px;
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