<template>
  <div class="full_card">
    <div v-if="review.username && review.username.trim() !== ''" 
         class="avatar" 
         :style="{ backgroundColor: avatarColor }"
         :title="review.username">
      {{ firstLetter }}
    </div>
    <div class="main_info">
      <div class="card_head">
        <div class="nickname">{{ review.username || 'Аноним' }}</div>
        <div class="rating">★ {{ review.rating !== undefined ? review.rating : '?' }}/5</div>
      </div>
      <div class="review_text">{{ review.text }}</div>
      <div class="review_date">{{ formatDate(review.addedAt) }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'; // Импортируем computed

const props = defineProps({
    review: {
        type: Object,
        required: true
    }
});

defineOptions({
    name: 'ReviewCard'
});

// Вычисляем первую букву имени
const firstLetter = computed(() => {
  return props.review.username 
    ? props.review.username.charAt(0).toUpperCase()
    : '';
});

// Вычисляем цвет фона аватарки
const avatarColor = computed(() => {
  const username = props.review.username || '';
  if (!username.trim()) return '';

  const colors = [
    '#6c5ce7', '#00b894', '#0984e3', '#fd79a8', 
    '#e17055', '#fab1a0', '#55efc4', '#ffeaa7'
  ];
  
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
});

const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
.full_card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin-bottom: 1rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  background-color: #fff;
  overflow-y: auto;
  flex-wrap: wrap; /* Разрешает перенос элементов */
  word-break: break-word; /* Принудительный перенос длинных слов */
  overflow-wrap: anywhere; /* Гибкий перенос в любом месте */
  hyphens: auto; /* Автоматическая расстановка переносов (если поддерживается) */
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 24px;
}

.main_info {
  flex: 1;
}

.card_head {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.nickname {
  color: #333;
}

.rating {
  color: #f39c12;
}

.review_text {
  margin-bottom: 0.5rem;
}

.review_date {
  font-size: 0.85rem;
  color: #888;
}
</style>