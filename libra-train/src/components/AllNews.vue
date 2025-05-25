<template>
  <div class="allPage">
    <h1 class="page-title">Все новости</h1>
    <div class="news-list">
      <router-link
        v-for="item in newsItems"
        :key="item._id"
        :to="`/news/${item.slug}`"
        class="news-item-link"
      >
        <div class="news-item">
          <img
            class="news-image"
            :src="require(`@/assets/covers/${item.cover}`)"
            :alt="item.title"
            loading="lazy"
          />
          <div class="news-content">
            <h2 class="news-title">{{ item.title }}</h2>
            <p class="news-excerpt">
              {{ item.description.length > 400
                 ? item.description.slice(0, 400) + '…'
                 : item.description }}
            </p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const newsItems = ref([])

onMounted(async () => {
  try {
    const res = await axios.get(`${process.env.VUE_APP_API_URL}/api/news`)
    newsItems.value = res.data
  } catch (err) {
    console.error('Ошибка загрузки новостей:', err)
  }
})
</script>

<style scoped>
.allPage {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #f0f0f0;
}
.page-title {
  font-size: 36px;
  margin-bottom: 30px;
  color: #1a1a1a;
}
.news-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
/* Снимаем стандартные стили ссылки */
.news-item-link {
  text-decoration: none;
  color: inherit;
}
/* Сама карточка */
.news-item {
  display: flex;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.news-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.news-image {
  width: 400px;
  object-fit: cover;
  flex-shrink: 0;
}
.news-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.news-title {
  font-size: 24px;
  margin: 0 0 10px;
  color: #111111;
}
.news-excerpt {
  font-size: 16px;
  line-height: 1.5;
  color: #555555;
  flex-grow: 1;
}

/* Адаптив */
@media (max-width: 768px) {
  .news-item {
    flex-direction: column;
  }
  .news-image {
    width: 100%;
    height: 180px;
  }
}
</style>