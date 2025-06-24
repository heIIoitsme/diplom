<template>
  <header class="header">
    <!-- Логотип и поиск оставляем без изменений -->
    <div class="logo">
      <router-link to="/">
        <img src="@/assets/LibraTrain.svg" alt="Логотип">
      </router-link>
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
          <div class="book-author">{{ book.author[0].fullName }}</div>
        </div>
        <div 
          v-if="filteredBooks.length > 3" 
          class="show-all-results" 
          @click="goToSearchPage"
        >
          Показать все результаты ({{ filteredBooks.length }})
        </div>
      </div>
    </div>

    <!-- Блок авторизации / профиля -->
    <div class="auth-section" v-click-outside="closeProfileMenu">
      <!-- Кнопка Войти просто открывает LoginModal -->
      <button 
        v-if="!isLoggedIn" 
        class="loginButton" 
        @click="showLoginModal = true"
      >
      <a>Войти</a>
      </button>

      <!-- Если залогинен, показываем меню профиля -->
      <div v-else class="profile-menu">
        <button class="profile-icon" @click="toggleProfileMenu" :style="{ backgroundColor: avatarColor }">
          {{ username.charAt(0).toUpperCase() }}
        </button>
        <div v-if="showProfileMenu" class="profile-dropdown">
          <router-link 
            to="/profile" 
            class="dropdown-item"
            @click="closeProfileMenu"
          >
            Личный кабинет
          </router-link>
          <router-link 
            to="/profile/lists" 
            class="dropdown-item"
            @click="closeProfileMenu"
          >
            Мои списки
          </router-link>
          <div 
            class="dropdown-item logout"
            @click="handleLogout"
          >
            Выход
          </div>
        </div>
      </div>
    </div>

    <!-- Сам LoginModal -->
    <LoginModal
      v-if="showLoginModal"
      @close="showLoginModal = false"
      @login-success="handleLoginSuccess"
    />
  </header>
</template>

<script>
import LoginModal from '@/components/LoginModal.vue'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios';

export default {
  name: 'LibraHeader',
  components: {
    LoginModal
  },
  data() {
    return {
      searchQuery: '',
      showDropdown: false,
      allBooks: [],
      showLoginModal: false,
      showProfileMenu: false,
      token: localStorage.getItem('token') || '',
      isLoading: false,
      searchError: null
    }
  },
  computed: {
  isLoggedIn() {
    if (!this.token) return false
    try {
      const { exp } = jwtDecode(this.token)
      return Date.now() < exp * 1000
    } catch {
      return false
    }
  },
    filteredBooks() {
      if (!this.searchQuery) return []
      const q = this.searchQuery.toLowerCase().trim()
      return this.allBooks.filter(b => 
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.author && this.formatAuthor(b.author).toLowerCase().includes(q))
      ).slice(0, 5)
    },
    username() {
    try {
      return jwtDecode(this.token).username || ''
    } catch {
      return ''
    }
  },
  avatarColor() {
    const colors = ['#6c5ce7', '#00b894', '#0984e3', '#fd79a8', '#e17055', '#fab1a0', '#55efc4', '#ffeaa7']
    let hash = 0
    for (let i = 0; i < this.username.length; i++) {
      hash = this.username.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % colors.length
    return colors[index]
  }
  },
  methods: {
    // Поиск
    async loadAllBooks() {
      try {
        this.isLoading = true
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/books`
        )
        this.allBooks = response.data
      } catch (error) {
        console.error('Ошибка загрузки книг:', error)
        this.loadError = 'Не удалось загрузить данные'
      } finally {
        this.isLoading = false
      }
    },

    formatAuthor(author) {
      if (typeof author === 'string') return author
      if (Array.isArray(author)) return author.map(a => a.fullName).join(', ')
      return author?.fullName || 'Неизвестный автор'
    },

    handleSearch() {
      this.showDropdown = true
    },

    goToSearchPage() {
      if (this.searchQuery.trim()) {
        this.$router.push({ 
          path: '/search', 
          query: { q: this.searchQuery.trim() } 
        });
        this.closeDropdown();
      }
    },
    goToBook(id) {
      this.$router.push(`/book/${id}`)
      this.closeDropdown()
    },
    closeDropdown() {
      this.showDropdown = false
    },

    // Профиль
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu
    },
    closeProfileMenu() {
      this.showProfileMenu = false
    },
    handleLogout() {
      localStorage.removeItem('token')     // 1. Удаляем токен
      this.showProfileMenu = false
      this.token = ''         // 2. Прячем меню
      this.showLoginModal = false          // 3. Закрываем модалку
      this.$router.push('/')               // 4. Перенаправляем, если нужно

      // 5. Форсируем перерендер (если нужно, но скорее всего не понадобится)
      this.$forceUpdate()
      console.log('Текущий токен:', localStorage.getItem('token'))
    },

    handleLoginSuccess(serverResponse) {
      this.token = serverResponse.token
      this.showLoginModal = false
      // Никакого this.token = ...
    },
  },
  directives: {
    'click-outside': {
      bind(el, binding) {
        el.clickOutsideEvent = e => {
          if (!el.contains(e.target)) binding.value()
        }
        document.addEventListener('click', el.clickOutsideEvent)
      },
      unbind(el) {
        document.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  },
mounted() {
  this.loadAllBooks()
  // Здесь можно обновить токен из localStorage, если нужно
    this.token = localStorage.getItem('token') || ''
    try {
      const { exp } = jwtDecode(this.token)
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem('token')
        this.token = ''
      }
    } catch {
      localStorage.removeItem('token')
      this.token = ''
    }
  }
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

.logo {
  margin-left: 30px;
}

.search-container {
  flex: 1 1 640px;
  width: 50%;
  margin: 0 auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.search-container input {
  height: 25px;
  width: 100%;
  padding: 5px 0px 3px 0px;
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

.loginButton {
  width: 120px;
  height: 30px;
  background-color: #1a1a1a;
  border-radius: 15px;
  margin-right: 30px;
  box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
}

.loginButton a {
  color: rgb(255, 255, 255);
  font-family: Kreadon;
  font-size: 20px;
  text-decoration: none;
}

.loginButton:hover {
  transform: translateY(-1px);
  box-shadow: 0px 5px 0px 0px rgba(0, 0, 0, 0.25);
}

.loginButton:active {
  transform: translateY(3px);
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.25);
  background-color: #333;
}

.profile-menu {
  position: relative;
  margin-right: 30px;
}

.profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0f0f0;
  border: 1px solid #C8C8C8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 20px;
  text-transform: uppercase;
}

.profile-icon:hover {
  background: #e0e0e0;
  transform: scale(1.05);
}

.avatar-placeholder {
  font-size: 24px;
}

.profile-dropdown {
  position: absolute;
  right: 0;
  top: 50px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
}

.profile-dropdown .dropdown-item {
  border-radius: 8px;
  padding: 12px 16px;
  color: #333;
  text-decoration: none;
  display: block;
  transition: background 0.2s;
}

.profile-dropdown .dropdown-item:hover {
  background-color: #f8f9fa;
}

.profile-dropdown .logout {
  color: #ff4444;
  border-top: 1px solid #eee;
  padding-top: 12px;
}

@media (max-width: 1024px) {
  .logo {
    margin-left: 15px;
  }
  .search-container {
    flex: 1 1 500px;
    max-width: 500px;
  }
}

@media (max-width: 900px) {
  .search-container {
    flex: 1 1 400px;
    max-width: 400px;
  }
}

@media (max-width: 768px) {
  .header {
    flex-wrap: wrap;
    height: auto;
    padding: 10px 0;
    gap: 10px;
  }

  .logo {
    order: 1;
    width: auto;
    margin-left: 15px;
    margin-right: auto;
  }

  .auth-section {
    order: 2;
    width: auto;
    margin-right: 15px;
  }

  .search-container {
    order: 3;
    position: relative;
    width: calc(100% - 30px);
    flex: 1 1 100%;
    max-width: 100%;
    margin: 10px 15px;
    left: 0;
    transform: none;
  }

  .search-container input {
    width: 100%;
  }

  .profile-menu {
    margin-right: 0;
  }
}

@media (max-width: 480px) {
  .logo img {
    width: 140px; /* Уменьшаем логотип */
  }
  
  .loginButton {
    width: 90px;
    height: 26px;
  }
  
  .loginButton a {
    font-size: 16px;
  }
}
</style>