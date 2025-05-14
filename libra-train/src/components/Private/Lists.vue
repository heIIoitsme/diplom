<template>
  <div class="container">
    <div class="profile_main">
      <img
        class="image"
        :src="require(`@/assets/covers/anna-karenina.jpeg`)"
        loading="lazy"
      />
      <h1 class="nickname">{{ user.username }}</h1>
    </div>

    <div class="lists">
      <p v-if="userBooks.length === 0">У вас пока нет книг в списках.</p>
      <ListCard
        v-for="(entries, status) in groupedByStatus"
        :key="status"
        :title="capitalize(status)"
        :entries="entries"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useProfile } from './useProfile.js'
import ListCard from '@/components/Modules/List-card.vue'

const { user } = useProfile()
const userBooks = ref([])

// как только user.value появится — грузим книги
watch(
  () => user.value,
  async (u) => {
    if (!u) return
    const token = localStorage.getItem('token')
    const res = await fetch(`${process.env.VUE_APP_API_URL}/api/user-books/${u._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      userBooks.value = await res.json()
    } else {
      console.error('Ошибка загрузки книг:', res.status)
    }
  },
  { immediate: true }
)

const groupedByStatus = computed(() => {
  return userBooks.value.reduce((acc, item) => {
    const status = item.status || 'Без категории'
    if (!acc[status]) acc[status] = []
    acc[status].push(item)
    return acc
  }, {})
})

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