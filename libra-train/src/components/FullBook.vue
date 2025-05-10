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
                    <button class='list_button'>
                        <a>+ Добавить в список</a>
                    </button>
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const book = ref(null)
const error = ref('')

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
})
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
    width: 150px;
    border-radius: 25px;
    background-color: black;
  }
  .list_button a {
    font-family: Kreadon;
    font-size: 14px;
    color: #fff;
  }
  .book_img {
    height: 220px;
    width: 135px;
    padding: 20px;
    border-radius: 30px;
  }

</style>