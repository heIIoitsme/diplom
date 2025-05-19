<template>
  <div class="container">
    <div class="profile_main">
      <img
        class="image"
        :src="require(`@/assets/covers/anna-karenina.jpeg`)"
        loading="lazy"
      />
      <h1 class="nickname">{{ user.username }}</h1>
    </div>

    <div class="stata_main">
            <div class="stata">
          <div class="rating-block">
            <div class="title">Оценки</div>
            <div class="chart-horizontal">
              <div
                v-for="i in [4, 3, 2, 1, 0]"
                :key="i"
                class="bar-horizontal"
              >
              <span class="bar-score">{{ i+1 }}</span>
                <div
                  class="bar-fill"
                  :style="{ width: ratingPercents[i] + '%' }"
                >
                  <span class="bar-label">{{ ratingCounts[i] }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="genre-block">
            <div class="title">Любимый жанр</div>
            <div class="value">{{ favoriteGenre }}</div>
          </div>
          <div class="read-block">
            <div class="title">Прочитано книг</div>
            <div class="value">{{ readCount }}</div>
          </div>
        </div>
      <div class="lists">
        <p v-if="userBooks.length === 0">У вас пока нет книг в списках.</p>
        <ListCard
          v-for="(entries, status) in groupedByStatus"
          :key="status"
          :title="capitalize(status)"
          :entries="entries"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import ListCard from '@/components/Modules/List-card.vue'

const user = ref(null);
const error = ref('');
const userBooks = ref([])

const props = defineProps({
  username: {
    type: String,
    required: true
  }
})

onMounted(async () => {
      try {
        const res = await fetch(`${process.env.VUE_APP_API_URL}/api/users/${props.username}`);
        if (res.status === 404) {
          error.value = 'Пользователь не найден';
          return;
        }
        if (!res.ok) {
          error.value = 'Ошибка сервера при загрузке профиля';
          return;
        }
        user.value = await res.json();
      } catch (e) {
        console.error(e);
        error.value = 'Сетевая ошибка при загрузке профиля';
      }
    })

watch(
  () => user.value,
  async (u) => {
    if (!u) return
    const res = await fetch(`${process.env.VUE_APP_API_URL}/api/user-books/user/${u._id}`)
    if (res.ok) {
      userBooks.value = await res.json()
    } else {
      console.error('Ошибка загрузки книг:', res.status)
    }
  },
  { immediate: true }
)

const groupedByStatus = computed(() => {
  return userBooks.value.reduce((acc, item) => {
    const status = item.status || 'Без категории'
    if (!acc[status]) acc[status] = []
    acc[status].push(item)
    return acc
  }, {})
})

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const ratingCounts = computed(() => {
  const counts = [0,0,0,0,0]
  userBooks.value.forEach(e => {
    const r = e.rating
    if (r >= 1 && r <= 5) counts[r-1]++
  })
  return counts
})
const totalBooks = computed(() => userBooks.value.length)
const ratingPercents = computed(() =>
  ratingCounts.value.map(c =>
    totalBooks.value > 0 ? (c / totalBooks.value) * 100 : 0
  )
)

// Кол-во прочитанных книг
const readCount = computed(() =>
  userBooks.value.filter(entry => entry.status === 'прочитано').length
)

// Любимый жанр (по количеству появлений)
const favoriteGenre = computed(() => {
  const genreCount = {}
  userBooks.value.forEach(entry => {
    const genres = entry.book?.[0]?.genre || []
    genres.forEach(g => {
      genreCount[g] = (genreCount[g] || 0) + 1
    })
  })
  const sorted = Object.entries(genreCount).sort((a, b) => b[1] - a[1])
  return sorted[0]?.[0] || '—'
})
</script>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: center;  
    padding: 40px;
    gap: 30px;
  }
  
  .profile_full {
    width: 1400px;
    display: flex;
    gap: 40px;
  }
  
  .profile_main {
    width: 360px;
    height: 800px;
    background-color: #ffffff;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .nickname {
    font-size: 22px;
    margin-bottom: 20px;
  }
  
  .image {
    width: 220px;
    height: 220px;
    border-radius: 50%;
    object-fit: cover;
    margin: 30px auto 10px;
  }
  
  .stata_main {
    max-width: 1010px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  
.stata {
    display: flex;
    width: 100%;
    height: 200px;
    background-color: #ffffff;
    border-radius: 20px;
    flex-direction: row;
    justify-content: center;
    gap: 60px;
}
  
  .lists {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .title {
  font-size: 40px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.rating-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Задаём фиксированную ширину, чтобы блоки были равномерно распределены */
  flex: 1;
  max-width: 200px;
}

.chart-horizontal {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.bar-horizontal {
  display: grid;
  grid-template-columns: 24px 1fr; /* 24px для цифры, остальное — полоса */
  align-items: center;
}

.bar-fill {
  position: relative;
  height: 18px;
  background: #000;
  border-radius: 10px;
  transition: width 0.3s;
  overflow: hidden;
}

.bar-label {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  font-size: 14px;
  text-align: right;
  width: calc(100% - 16px);
}

.bar-score {
  font-size: 14px;
  color: #333;
  text-align: left;
}

.genre-block .value,
.read-block .value {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin-top: 40px;
}
  </style>