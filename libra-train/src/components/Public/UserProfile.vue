<template>
  <div v-if="user" class="container">
    <div class="profile_full">
      <div class="profile_main">
        <div class="avatar" :style="{ backgroundColor: avatarColor }">
            {{ user.username?.charAt(0).toUpperCase() }}
        </div>
        <h1 class="nickname">{{ user.username }}</h1>
      </div>

      <div class="profile_other">
        <div class="profile_second">
          <div class="profile_last" v-if="stats.lastReadBook">
            <span>Последнее прочитанное</span>
              <router-link :to="`/book/${stats.lastReadBook._id}`" class="router-link-custom"><div class="book-card">
              <img
                class="book-img"
                :src="require(`@/assets/covers/${stats.lastReadBook.cover}`)"
                alt="Обложка книги"
              />
              <div class="book-info">
                <div>
                  <div class="book-title">{{ stats.lastReadBook.title }}</div>
                  <div class="book-author">
                    {{ stats.lastReadBook.author[0]?.fullName }}
                  </div>
                </div>
                <div class="user-rating">
                  Оценка пользователя:
                  {{ stats.lastReadBook.userRating !== null
                    ? stats.lastReadBook.userRating
                    : '—' }}
                </div>
              </div>
            </div></router-link>
          </div>
          <div class="profile_stata">
            <router-link
              :to="{ name: 'UserLists', params: { username: user.username } }"
              class="router-link-custom"
            >
              <span>Список книг</span>
            </router-link>
          </div>
        </div>

        <div class="profile_time"></div>
        <div class="profile_end"></div>
      </div>
    </div>
  </div>
  <p v-else>Загрузка...</p>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { getLastReadBook } from '../Private/LastBook.js'

export default {
  name: 'UserProfile',
  props: {
    username: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const user = ref(null)
    const error = ref('')
    const stats = reactive({
      lastReadBook: null
    })

    function getColorFromUsername(username) {
      const colors = ['#6c5ce7', '#00b894', '#0984e3', '#fd79a8', '#e17055', '#fab1a0', '#55efc4', '#ffeaa7']
      let hash = 0
      for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash)
      }
      const index = Math.abs(hash) % colors.length
      return colors[index]
    }

    const avatarColor = computed(() =>
      user.value ? getColorFromUsername(user.value.username) : '#ccc'
    )

    onMounted(async () => {
      try {
        const resUser = await fetch(
          `${process.env.VUE_APP_API_URL}/api/users/${props.username}`
        )
        if (!resUser.ok) {
          error.value =
            resUser.status === 404
              ? 'Пользователь не найден'
              : 'Ошибка сервера при загрузке профиля'
          return
        }
        user.value = await resUser.json()

        const userBooksRes = await fetch(
          `${process.env.VUE_APP_API_URL}/api/user-books/user/${user.value._id}`
        )
        if (!userBooksRes.ok) return
        const userBooks = await userBooksRes.json()

        const booksRes = await fetch(`${process.env.VUE_APP_API_URL}/api/books`)
        if (!booksRes.ok) return
        const books = await booksRes.json()

        const lastBook = getLastReadBook(userBooks, books)
        if (lastBook) {
          stats.lastReadBook = lastBook
        }
      } catch (e) {
        console.error('Ошибка при загрузке публичного профиля:', e)
        error.value = 'Сетевая ошибка при загрузке профиля'
      }
    })

    return {
      user,
      error,
      stats,
      avatarColor // обязательно возвращаем!
    }
  }
}
</script>


<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px
}

.profile_full {
    width: 1400px;
    height: 800px;
    display: flex;
    gap: 40px;
    position: relative;
}

.profile_main {
    width: 360px;
    height: 100%;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    border-radius: 20px;
    gap: 10px;
}

.profile_other {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.profile_second {
    display: flex;
    gap: 40px;
    height: 300px;
}

.profile_last {
    width: 480px;
    background-color: #ffffff;
    border-radius: 20px;
}

  .profile_last span {
    display: block;
    font-size: 32px;
    margin: 20px;
  }

.profile_stata {
    width: 480px;
    background-color: #ffffff;
    border-radius: 20px;
}

.profile_stata a {
    display: block;
    font-size: 32px;
    margin: 20px;
}

.profile_time {
    height: 140px;
    background-color: #ffffff;
    border-radius: 20px;
}

.profile_end {
    height: 410px;
    background-color: #ffffff;
    border-radius: 20px;
}

  .avatar {
      height: 250px;
      width: 250px;
      border-radius: 50%;
      background-color: #f0f0f0;
      margin-top: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 96px;
      font-weight: bold;
      text-transform: uppercase;
  }

.nickname {
    text-align: center;
    margin: 0px
}

  .router-link-custom{
    text-decoration: none;
    display: inline-block;
    color: inherit;
  }

    .image {
      height: 250px;
      width: 250px;
      border-radius: 50%;
      padding: 55px;
  }
  
  .nickname {
      text-align: center;
      margin: 0px
  }

  .router-link-custom{
    text-decoration: none;
    display: inline-block;
    color: inherit;
  }

  .book-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-radius: 8px;
  margin: 0px 20px 20px;
}

.book-img {
  width: 135px;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
}

.book-info {
  height: 180px;
  width: 290px;
  display: flex;
  flex-direction: column;
  justify-content:space-between;
}

.book-title {
  font-size: 30px;
}

.book-author {
  color: #666;
  font-size: 26px;
}

.user-rating {
  font-size: 22px;
}
</style>

