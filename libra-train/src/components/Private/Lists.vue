<template>
    <div class="container">
      <div class="profile_full">
        <div class="profile_main">
          <img 
            class="image" 
            :src="require(`@/assets/covers/anna-karenina.jpeg`)" 
            loading="lazy" 
          />
          <h1 class="nickname">{{ user.username }}</h1>
        </div>
  
        <div class="stata_main">
          <div class="stata_first">
            <div class="rating"></div>
            <div class="main_genre"></div>
          </div>
  
          <div class="lists">
            <ListCard
              v-for="(entries, status) in groupedByStatus"
              :key="status"
              :title="capitalize(status)"
              :entries="entries"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import ListCard from '@/components/Modules/List-card.vue'
  
  // Состояние
  const user = ref({ username: 'Загрузка...' })
  const userBooks = ref([])
  const groupedByStatus = ref({})
  
  // Получаем ID пользователя (из localStorage или props)
  const userId = localStorage.getItem('userId')
  
  // Загрузка данных при монтировании
  onMounted(async () => {
    try {
      // Загружаем имя пользователя
      const userRes = await axios.get(`${process.env.VUE_APP_API_URL}/api/users/${userId}`)
      user.value = userRes.data
  
      // Загружаем книги пользователя
      const listRes = await axios.get(`${process.env.VUE_APP_API_URL}/api/user-books/${userId}`)
      userBooks.value = listRes.data
  
      // Группируем по статусу
      groupedByStatus.value = userBooks.value.reduce((acc, item) => {
        const status = item.status || 'Без категории'
        if (!acc[status]) acc[status] = []
        acc[status].push(item)
        return acc
      }, {})
    } catch (err) {
      console.error('Ошибка загрузки данных:', err)
    }
  })
  
  // Функция: красиво отобразить статус
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  </script>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 40px;
  }
  
  .profile_full {
    width: 1400px;
    display: flex;
    gap: 40px;
  }
  
  .profile_main {
    width: 360px;
    height: 800px;
    background-color: #ffffff;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .nickname {
    font-size: 22px;
    margin-bottom: 20px;
  }
  
  .image {
    width: 220px;
    height: 220px;
    border-radius: 50%;
    object-fit: cover;
    margin: 30px auto 10px;
  }
  
  .stata_main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  
  .lists {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  </style>