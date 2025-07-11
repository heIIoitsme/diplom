<template>
  <div class="container">
    <div class="profile_main">
      <div class="avatar" :style="{ backgroundColor: avatarColor }">
        {{ user.username?.charAt(0).toUpperCase() }}
      </div>
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
                <div class="bar-fill" :style="{ width: ratingPercents[i] + '%' }">
                <span 
                  class="bar-label"
                  v-text="ratingCounts[i]"
                  v-measure-visibility
                ></span>
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
import { ref, computed, watch } from 'vue'
import { useProfile } from './useProfile.js'
import ListCard from '@/components/Modules/List-card.vue'

const { user } = useProfile()
const userBooks = ref([])

// как только user.value появится — грузим книги
watch(
  () => user.value,
  async (u) => {
    if (!u) return
    const token = localStorage.getItem('token')
    const res = await fetch(`${process.env.VUE_APP_API_URL}/api/user-books/user/${u._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
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

const vMeasureVisibility = {
  mounted(el) {
    checkVisibility(el)
    new ResizeObserver(() => checkVisibility(el)).observe(el.parentElement)
  }
}

function checkVisibility(el) {
  const parent = el.parentElement
  const labelWidth = el.scrollWidth
  const availableWidth = parent.offsetWidth - 16 // 8px padding с каждой стороны
  
  el.style.visibility = labelWidth <= availableWidth ? 'visible' : 'hidden'
}

const avatarColor = computed(() => user.value ? getColorFromUsername(user.value.username) : '#ccc');
function getColorFromUsername(username) {
  const colors = ['#6c5ce7', '#00b894', '#0984e3', '#fd79a8', '#e17055', '#fab1a0', '#55efc4', '#ffeaa7'];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}
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
  text-align: center;
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
  overflow: hidden;
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

@media(max-width: 1290px) {
  .profile_main {
    display: none;
  }
}

@media(max-width:1024px) {
  .stata {
    gap:30px;
  }
}

@media (max-width:930px) {
  .title {
    font-size: 25px;
  }
  .genre-block .value,
  .read-block .value {
    font-size: 20px;
  }
  .stata {
    justify-content: space-evenly;
  }
  .rating-block {
    max-width: 150px;
  }
  .genre-block {
    max-width: 150px;
  }
  .read-block {
    max-width: 150px;
  }
}

@media (max-width: 650px) {
  .stata {
    display: none;
  }
}
</style>