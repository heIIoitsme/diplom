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
                    <div class="profile_last"></div>
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
  
  @media (max-width: 1500px) {
  .profile_full {
      transform: scale(0.9);
      transform-origin: center;
  }
  }
  
  @media (max-width: 1300px) {
  .profile_second {
      grid-template-columns: 1fr 1fr;
  }
  
  .profile_last,
  .profile_stata {
      width: 100% !important;
      max-width: none;
  }
  }
  
  @media (max-width: 1024px) {
  .profile_full {
      flex-direction: column;
      width: 95%;
      height: auto;
      gap: 30px;
  }
  
  .profile_main {
      width: 100%;
      height: 300px;
      display: flex;
      flex-direction: row;
  }
  
  .image {
      padding: 25px;
  }
  
  .profile_second {
      grid-template-columns: 1fr;
      height: auto;
      gap: 20px;
  }
  
  .profile_last,
  .profile_stata {
      height: 250px;
  }
  }
  
  @media (max-width: 768px) {
  .profile_last,
  .profile_stata {
      height: 200px;
  }
  
  .profile_time,
  .profile_end {
      height: 120px;
  }
  }
  </style>