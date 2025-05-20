<template>
  <div class="allPage" @scroll.passive="handleScroll" ref="scrollContainer">
    <a1 class="page-title">
      <!-- Пока genres не пришли -->
      <span v-if="genreTitle === null">Загрузка…</span>
      <!-- Когда загрузили и есть книги -->
      <span v-else-if="displayedBooks.length">Категория: {{ genreTitle }}</span>
      <!-- Если жанр есть, но книг нет -->
      <span v-else>Книг в жанре «{{ genreTitle }}» не найдено</span>
    </a1>

    <div class="mainInfo">
      <div class="allBooks">
        <div v-if="displayedBooks.length" class="books-grid">
          <BookCard
            v-for="book in displayedBooks"
            :key="book._id"
            :book="book"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { defineProps } from 'vue'
import axios from 'axios'
import BookCard from '@/components/Modules/Book-card.vue'

// 1) Получаем slug из URL
const props = defineProps({ slug: String })
const slug = props.slug

// 2) Реактивные данные
const books = ref([])
const genres = ref([])

// 3) После загрузки genres вычисляем title текущего жанра
const genreTitle = computed(() => {
  if (!genres.value.length) return null
  const g = genres.value.find(x => x.slug === slug)
  return g ? g.title : ''
})

// 4) Infinite-scroll
const loadStep = 36
const loaded = ref(0)
const scrollContainer = ref(null)

const filteredBooks = computed(() => {
  if (!genreTitle.value) return []
  return books.value.filter(b =>
    Array.isArray(b.genre) && b.genre.includes(genreTitle.value)
  )
})

const displayedBooks = computed(() =>
  filteredBooks.value.slice(0, loaded.value)
)

function loadMore() {
  const rem = filteredBooks.value.length - loaded.value
  const inc = Math.min(loadStep, rem)
  if (inc > 0) loaded.value += inc
}

function handleScroll() {
  const el = scrollContainer.value
  if (!el) return
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
    loadMore()
  }
}

// 5) Загрузка данных
onMounted(async () => {
  try {
    const [gRes, bRes] = await Promise.all([
      axios.get(`${process.env.VUE_APP_API_URL}/api/genres`),
      axios.get(`${process.env.VUE_APP_API_URL}/api/books`)
    ])
    genres.value = gRes.data
    books.value  = bRes.data
    loadMore()
  } catch (e) {
    console.error('Ошибка при загрузке:', e)
  }
})
</script>

<style scoped>
.allPage {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  height: 100vh;
  overflow-y: auto;
}

.page-title {
  font-size: 48px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 1400px;
}

.mainInfo {
  display: flex;
  width: 100%;
  max-width: 1400px;
}

.allBooks {
  flex: 1;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 40px;
}

.no-results {
  font-size: 18px;
  color: #666;
  text-align: center;
  margin-top: 40px;
}
</style>