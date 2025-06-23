<template>
  <div class="full_card">
    <div class="avatar">
      <img src="/default-avatar.png" alt="avatar" />
    </div>
    <div class="main_info">
      <div class="card_head">
        <div class="nickname">{{ review.username || 'Аноним' }}</div>
        <div class="rating">★ {{ review.rating }}/5</div>
      </div>
      <div class="review_text">{{ review.text }}</div>
      <div class="review_date">{{ formatDate(review.addedAt) }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
    review: {
        type: Object,
        required: true
    }
})
defineOptions({
    name: 'ReviewCard'
})

const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
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
}

.avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
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