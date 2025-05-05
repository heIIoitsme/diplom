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
          <div class="book-author">{{ book.author }}</div>
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
        <button class="profile-icon" @click="toggleProfileMenu">
          <div class="avatar-placeholder"></div>
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
import books from '@/database/books.json'
import LoginModal from '@/components/LoginModal.vue'

export default {
  name: 'Header',
  components: {
    LoginModal
  },
  data() {
    return {
      searchQuery: '',
      showDropdown: false,
      allBooks: books,
      showLoginModal: false,
      isLoggedIn: false,
      showProfileMenu: false
    }
  },
  computed: {
    filteredBooks() {
      if (!this.searchQuery) return []
      const q = this.searchQuery.toLowerCase().trim()
      return this.allBooks
        .filter(b => 
          b.title.toLowerCase().includes(q) ||
          (b.author && b.author.toLowerCase().includes(q))
        )
        .slice(0, 5)
    }
  },
  methods: {
    // Поиск
    handleSearch() {
      this.showDropdown = true
    },
    goToSearchPage() {
      if (this.searchQuery.trim()) {
        this.$router.push({ path: '/search', query: { q: this.searchQuery.trim() } })
        this.closeDropdown()
      }
    },
    goToBook(id) {
      this.$router.push(`/books/${id}`)
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
      this.isLoggedIn = false
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('token')
      this.closeProfileMenu()
      this.$router.push('/')
    },

    // ОБРАБОТКА УСПЕШНОГО ЛОГИНА (LoginModal.vue эмитит login-success)
    handleLoginSuccess(serverResponse) {
      // serverResponse содержит { token, userId, ... }
      console.log('Успешный вход:', serverResponse)
      // Сохраняем флаг входа (токен уже был сохранён в LoginModal.vue)
      this.isLoggedIn = true
      // Закрываем модалку
      this.showLoginModal = false
    },

    checkAuth() {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    }
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
    this.checkAuth()
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

.loginButton {
  width: 120px;
  height: 30px;
  background-color: black;
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
  border: 2px solid #ddd;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
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
    margin-left: 10px;
  }
}

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
    margin-left: 0;
  }

  .search-container {
    order: 2;
    width: 25%;
    margin: 10px 0;
    position: static;
    transform: none;
  }

  .auth-section {
    order: 3;
    width: 100%;
    text-align: center;
    margin: 10px 0;
  }

  .profile-menu {
    margin-right: 0;
    display: inline-block;
  }

  .loginButton {
    margin-right: 0;
  }
}
</style>