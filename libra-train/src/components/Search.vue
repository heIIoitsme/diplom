<template>
  <div class="search-results">
    <!-- 1) Если есть книги в массиве -->
    <div v-if="books.length">
      <h2>Результаты поиска</h2>
      <ul>
        <li
          v-for="book in books"
          :key="book._id"
          class="book-item"
        >
          <router-link :to="`/book/${book._id}`">
            {{ book.title }}
          </router-link>
          <p class="author">{{ book.author }}</p>
        </li>
      </ul>
    </div>

    <!-- 2) Если нет книг, но запрос есть -->
    <div v-else-if="hasSearchQuery" class="no-results">
      По запросу «{{ query }}» ничего не найдено
    </div>

    <!-- 3) Если не введён запрос -->
    <div v-else class="prompt">
      Введите запрос в поисковую строку
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const query = ref(route.query.q || '')
const books = ref([])

// Показываем «ничего не найдено» только если в query что‑то есть
const hasSearchQuery = computed(() => query.value.trim().length > 0)

// Функция запроса в API
async function fetchBooks() {
  const q = query.value.trim()
  if (!q) {
    books.value = []
    return
  }
  try {
    const res = await axios.get(
      `${process.env.VUE_APP_API_URL}/api/books`,
      { params: { search: q } }
    )
    books.value = res.data
  } catch (err) {
    console.error('Ошибка при поиске книг:', err)
    books.value = []
  }
}

// При изменении параметра ?q=... автоматически делать новый запрос
watch(
  () => route.query.q,
  newQ => {
    query.value = newQ || ''
    fetchBooks()
  }
)

onMounted(fetchBooks)
</script>

<style scoped>
.search-results {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 15px;
}

.search-results h2 {
  margin-bottom: 1rem;
}

ul {
  list-style: none;
  padding: 0;
}

.book-item {
  padding: 1rem;
  margin-bottom: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s;
}

.book-item:hover {
  transform: translateY(-2px);
}

.book-item .author {
  color: #666;
  font-size: 0.9em;
  margin-top: 0.5rem;
}

.no-results,
.prompt {
  text-align: center;
  padding: 2rem;
  color: #888;
}

@media (max-width: 768px) {
  .search-results { margin: 1rem auto; }
  .book-item { padding: 0.8rem; margin-bottom: 0.8rem; }
  .book-item a { font-size: 1rem; line-height: 1.4; }
  .book-item .author { font-size: 0.8em; }
  .no-results,
  .prompt { padding: 1.5rem; font-size: 0.9em; }
}

@media (max-width: 480px) {
  .book-item { padding: 0.6rem; margin-bottom: 0.6rem; }
  .book-item a { font-size: 0.9rem; }
  .no-results,
  .prompt { padding: 1rem; font-size: 0.85em; }
}
</style>