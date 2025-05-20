<template>
  <div class="allPage" ref="scrollContainer">
    <a1 class="page-title">Все книги</a1>
    <div class="mainInfo">
      <div class="allBooks">
        <div v-if="displayedBooks.length" class="books-grid">
          <BookCard
            v-for="book in displayedBooks"
            :key="book._id"
            :book="book"
          />
        </div>

        <p 
          v-else-if="!filteredBooks.length && selectedGenres.length"
          class="no-results"
        >
          Нет результатов по выбранным критериям фильтрации
        </p>

        <p v-else class="loading-text">Загрузка книг...</p>
      </div>

      <aside class="sortSettings">
        <header class="filter-header">
          <h2 class="sort-title">Фильтр</h2>
          <button class="filter-reset" @click="resetFilters">Сбросить</button>
        </header>
        <section class="filter-section">
          <h3 class="sort-item">Жанр</h3>
          <ul class="filter-list">
            <li v-for="genre in genres" :key="genre">
              <label class="checkbox">
                <input type="checkbox" :value="genre" v-model="selectedGenres" />
                <span class="checkbox-custom"></span>
                <span class="checkbox-label">{{ genre }}</span>
              </label>
            </li>
          </ul>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import BookCard from '@/components/Modules/Book-card.vue'

const books = ref([])
const selectedGenres = ref([])
const loadStep = 18
const loaded = ref(0)

// жанры
const genres = computed(() => {
  const allGenres = books.value.flatMap(b => b.genre || [])
  return Array.from(new Set(allGenres))
})

// фильтрация
const filteredBooks = computed(() => {
  if (!selectedGenres.value.length) return books.value
  return books.value.filter(b =>
    selectedGenres.value.every(g => (b.genre || []).includes(g))
  )
})

// отображаемые книги
const displayedBooks = computed(() =>
  filteredBooks.value.slice(0, loaded.value)
)

function loadMore() {
  const remain = filteredBooks.value.length - loaded.value
  const inc = Math.min(loadStep, remain)
  if (inc > 0) loaded.value += inc
}

function onScroll() {
  const scrollY = window.scrollY || document.documentElement.scrollTop
  const viewportH = window.innerHeight
  const fullH = document.documentElement.scrollHeight

  if (scrollY + viewportH >= fullH - 50) {
    loadMore()
  }
}

watch(selectedGenres, () => {
  loaded.value = 0
  loadMore()
})

watch(books, () => {
  loaded.value = 0
  loadMore()
})

function resetFilters() {
  selectedGenres.value = []
  loaded.value = 0
  loadMore()
}

onMounted(async () => {
  try {
    const res = await axios.get(`${process.env.VUE_APP_API_URL}/api/books`)
    books.value = res.data
    window.addEventListener('scroll', onScroll, { passive: true })
  } catch (e) {
    console.error('Ошибка загрузки книг:', e)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.allPage {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  height: 100vh;
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
  align-items: flex-start;
}

.allBooks {
  flex: 1;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 40px;
}

.sortSettings {
  position: sticky;
  top: 100px;
  border-radius: 20px;
  width: 250px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding-bottom: 20px;
}

.sort-title {
  font-size: 32px;
  width: 100%;
  margin: 10px 5px;
  font-weight: normal;
}

.sort-item {
  font-size: 24px;
  width: 100%;
  font-weight: normal;
  margin-top: 5px;
  margin-bottom: 5px;
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
}

.filter-reset {
  font-size: 14px;
  font-family: Kreadon;
  background: #000;
  color: #FFF;
  border: none;
  border-radius: 12px;
  padding: 4px 12px;
  cursor: pointer;
}

.filter-section {
  padding: 0 20px 20px 20px;
}

.filter-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.filter-list li + li {
  margin-top: 12px;
}

.checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox input {
  display: none;
}

.checkbox-custom {
  width: 15px !important;
  height: 15px ;
  border: 2px solid #000;
  border-radius: 4px;
  margin-right: 10px;
  position: relative;
}

.checkbox input:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 11px;
  height: 11px;
  background: #000;
  border-radius: 2px;
}

.checkbox-label {
  font-size: 16px;
}

/* 1) Смартфоны до 375px */
@media (max-width: 375px) {
  .mainInfo {
    flex-direction: column;
    align-items: stretch;
  }
  .sortSettings {
    order: -1;
    position: relative;
    width: 100%;
    margin: 0 0 16px;
    top: auto;
  }
  .books-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

/* 2) Смартфоны 376px–425px */
@media (min-width: 376px) and (max-width: 425px) {
  .mainInfo {
    flex-direction: column;
    align-items: stretch;
  }
  .sortSettings {
    order: -1;
    position: relative;
    width: 100%;
    margin: 0 0 16px;
    top: auto;
  }
  .books-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

/* 3) Планшет портрет 426px–768px */
@media (min-width: 426px) and (max-width: 768px) {
  .mainInfo {
    flex-direction: column;
    align-items: stretch;
  }
  .sortSettings {
    order: -1;
    position: relative;
    width: 100%;
    margin: 0 0 20px;
    top: auto;
  }
  .books-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

/* 4) Планшеты и малые десктопы 769px–1024px */
@media (min-width: 769px) and (max-width: 1024px) {
  .mainInfo {
    flex-direction: row;
  }
  .sortSettings {
    position: sticky;
    top: 20px;
    width: 250px;
    margin-left: 20px;
    margin-bottom: 0;
  }
  .books-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}

/* 5) Десктоп 1025px–1439px */
@media (min-width: 1025px) and (max-width: 1439px) {
  .mainInfo {
    flex-direction: row;
  }
  .sortSettings {
    position: sticky;
    top: 40px;
    width: 250px;
    margin-left: 30px;
  }
  .books-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
  }
}

/* 6) Широкие экраны 1440px+ */
@media (min-width: 1440px) {
  .books-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 40px;
  }
}
</style>