<template>
  <div class="allPage" @scroll.passive="handleScroll" ref="scrollContainer">
    <a1 class="page-title">Все книги</a1>
    <div class="mainInfo">
      <div class="allBooks" @scroll.passive="handleScroll" ref="scrollContainer">
            <!-- 1) Если есть отрисованные книги -->
            <div v-if="displayedBooks.length" class="books-grid">
            <BookCard
                v-for="book in displayedBooks"
                :key="book._id"
                :book="book"
            />
            </div>

            <!-- 2) Если книг в отфильтрованном списке нет (и фильтр применён) -->
            <p 
            v-else-if="!filteredBooks.length && selectedGenres.length"
            class="no-results"
            >
            Нет результатов по выбранным критериям фильтрации
            </p>

            <!-- 3) Во всех прочих случаях (ещё загружаем) -->
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
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import BookCard from '@/components/Modules/Book-card.vue'

// 1) Все книги из БД
const books = ref([])

// 2) Жанры вычисляем динамически из поля genre всех книг
const genres = computed(() => {
  const allGenres = books.value.flatMap(b => b.genre || [])
  return Array.from(new Set(allGenres))
})

// 3) Выбранные пользователем жанры
const selectedGenres = ref([])

// 4) Infinite scroll: шаг загрузки и счётчик
const loadStep = 36
const loaded = ref(0)
const scrollContainer = ref(null)

// 5) Список книг с учётом фильтрации по жанрам
//    Если нет выбранных жанров — возвращаем все.
//    Если есть — показываем только те книги, у которых массив genre содержит **все** выбранные жанры.
const filteredBooks = computed(() => {
  if (!selectedGenres.value.length) {
    return books.value
  }
  return books.value.filter(book => {
    const bookGenres = book.genre || []
    return selectedGenres.value.every(g => bookGenres.includes(g))
  })
})

// 6) Массив для рендера (slice от filteredBooks)
const displayedBooks = computed(() =>
  filteredBooks.value.slice(0, loaded.value)
)

// 7) Функция подгрузки следующей порции
function loadMore() {
  const remaining = filteredBooks.value.length - loaded.value
  const toLoad = Math.min(loadStep, remaining)
  if (toLoad > 0) {
    loaded.value += toLoad
  }
}

// 8) Обработчик скролла
function handleScroll() {
  const el = scrollContainer.value
  if (!el) return
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
    loadMore()
  }
}

// 9) Сброс фильтров
function resetFilters() {
  selectedGenres.value = []
  loaded.value = 0
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = 0
  }
  loadMore()
}

// 10) Перезагрузка при смене фильтра
watch(selectedGenres, () => {
  loaded.value = 0
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = 0
  }
  loadMore()
})

// 11) При монтировании загружаем книги и первую порцию
onMounted(async () => {
  try {
    const res = await axios.get(`${process.env.VUE_APP_API_URL}/api/books`)
    books.value = res.data
    loadMore()
  } catch (e) {
    console.error('Ошибка загрузки книг:', e)
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

.sortSettings {
  position: sticky;
  top: 40px;
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