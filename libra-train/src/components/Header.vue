<template>
  <header class="header">
    <div class="logo">
      <router-link to="/"><img src="@/assets/LibraTrain.svg" alt="Логотип"></router-link>
    </div>
    
    <div class="search-container" v-click-outside="closeDropdown">
      <input 
        type="text" 
        v-model="searchQuery"
        placeholder="Поиск книг..."
        @input="handleSearch"
        @keyup.enter="goToSearchPage"
        @focus="showDropdown = true"
      >
      
      <div v-if="showDropdown && filteredBooks.length" class="search-dropdown">
        <div 
          v-for="book in filteredBooks" 
          :key="book._id"
          class="dropdown-item"
          @click="goToBook(book._id)"
        >
          <div class="book-title">{{ book.title }}</div>
          <div class="book-author">{{ book.author }}</div>
        </div>
        
        <div v-if="filteredBooks.length > 3" class="show-all-results" @click="goToSearchPage">
          Показать все результаты ({{ filteredBooks.length }})
        </div>
      </div>
    </div>

    <nav class="nav">
      <router-link to="/">Главная</router-link>
    </nav>
  </header>
</template>

<script>
import books from '@/database/books.json'

export default {
  name: 'Header',
  data() {
    return {
      searchQuery: '',
      showDropdown: false,
      allBooks: books
    }
  },
  computed: {
    filteredBooks() {
      if (!this.searchQuery) return []
      const query = this.searchQuery.toLowerCase().trim()
      
      return this.allBooks.filter(book => {
        return (
          book.title.toLowerCase().includes(query) ||
          (book.author && book.author.toLowerCase().includes(query))
        ).slice(0, 5) // Показываем первые 5 результатов
      })
    }
  },
  methods: {
    handleSearch() {
      this.showDropdown = true
    },
    
    goToSearchPage() {
      if (this.searchQuery.trim()) {
        this.$router.push({
          path: '/search',
          query: { q: this.searchQuery.trim() }
        })
        this.closeDropdown()
      }
    },
    
    goToBook(bookId) {
      this.$router.push(`/books/${bookId}`)
      this.closeDropdown()
    },
    
    closeDropdown() {
      this.showDropdown = false
    }
  },
  directives: {
    'click-outside': {
      bind(el, binding) {
        el.clickOutsideEvent = function(event) {
          if (!el.contains(event.target)) {
            binding.value()
          }
        }
        document.addEventListener('click', el.clickOutsideEvent)
      },
      unbind(el) {
        document.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  }
}
</script>

<style scoped>
.header {
  width: 100%;
  height: 60px; /* Увеличиваем высоту для лучшего визуального восприятия */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 1000;
}
.search-container {
  flex: 1 1 640px; /* Основной растягивающийся элемент */
  width: 640px;
  margin: 0 auto;
  position: absolute; /* Позволяет обеспечить фиксированное положение */
  left: 50%;
  transform: translateX(-50%)
}

.search-container input {
  height: 25px;
  width: 100%;
  padding: 5px 15px 3px 15px;
  border-radius: 15px;
  font-family: 'Kreadon';
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: #f0f0f0;
  border: none;
  box-shadow: inset 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
}
.search-container input:focus {
  outline: none;
  box-shadow: inset 0px 2px 5px 0px rgba(0, 0, 0, 0.65);
}

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 400px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  z-index: 1000;
}

.dropdown-item {
  padding: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #f8f9fa;
}

.book-title {
  font-weight: 500;
  color: #333;
}

.book-author {
  font-size: 0.9em;
  color: #666;
  margin-top: 4px;
}

.show-all-results {
  padding: 12px;
  background: #f8f9fa;
  text-align: center;
  font-weight: 500;
  color: #007bff;
  cursor: pointer;
}

.nav a {
  font-family: Kreadon;
  color: rgb(0, 0, 0);
  margin: 0 1rem;
  text-decoration: none;
}

.nav a:hover {
  text-decoration: underline;
}

/* Адаптивность */
@media (max-width: 768px) {
  .header {
    flex-wrap: wrap;
    height: auto;
    padding: 10px;
    gap: 10px;
  }

  .logo {
    order: 1;
    width: 100%;
    text-align: center;
  }

  .search-container {
    order: 3;
    width: 100%;
    margin: 10px 0;
  }

  .nav {
    order: 2;
    margin-top: 0;
  }

  .nav a {
    margin: 0 0.5rem;
    font-size: 14px;
  }
}
</style>