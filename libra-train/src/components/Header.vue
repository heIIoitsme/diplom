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
    <button class="loginButton" @click="showLoginModal = true"><a>Войти</a></button>

    <LoginModal
      v-if="showLoginModal"
      @close="showLoginModal = false"
      @submit="handleLogin"
    />

  </header>
</template>

<script>
import books from '@/database/books.json'
import LoginModal from '@/components/LoginModal.vue'

export default {
  name: 'Header',
  data() {
    return {
      searchQuery: '',
      showDropdown: false,
      allBooks: books,
      showLoginModal: false,
      loginData: {
        username: '',
        password: ''
      }
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
        )
      }).slice(0, 5) // Показываем первые 5 результатов
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
    },
    
    closeLoginModal() {
      this.showLoginModal = false
      this.loginData.username = ''
      this.loginData.password = ''
    },
    
    handleLogin() {
      // Здесь можно добавить логику для обработки входа
      console.log('Login data:', this.loginData)
      this.closeLoginModal()
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
  },
  components: {
    LoginModal
  },
}
</script>

<style scoped>
.header {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 1000;
}
.search-container {
  flex: 1 1 640px;
  width: 640px;
  margin: 0 auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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
.search-container input::placeholder {
  color: grey;
}
.search-container input:focus::placeholder {
  color: #b8b8b8;
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

.loginButton {
  width: 120px;
  height: 30px;
  background-color: black;
  border-radius: 15px;
  margin-right: 30px;
  box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.loginButton a {
  color: rgb(255, 255, 255);
  font-family: Kreadon;
  font-size: 20px;
  position: relative;
  z-index: 1;
  transition: color 0.15s;
}

/* Эффект при наведении */
.loginButton:hover {
  transform: translateY(-1px);
  box-shadow: 0px 5px 0px 0px rgba(0, 0, 0, 0.25);
}

/* Эффект при нажатии */
.loginButton:active {
  transform: translateY(3px);
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.25);
  background-color: #333;
}

/* Дополнительный эффект "волны" при клике */
.loginButton::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s;
}

.loginButton:active::after {
  width: 200px;
  height: 200px;
}

.logo {
  margin-left: 30px;
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