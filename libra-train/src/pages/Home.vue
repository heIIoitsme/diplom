<template>
  <div class="home">
    <Announcer />
    <Bookcard />
  </div>
</template>

<script>
import Announcer from '@/components/Announcer.vue';
import Bookcard from '@/components/Book-card.vue';
export default {
  name: 'Home',
  components: {
    Announcer,
    Bookcard,
  },
};
</script>

<style scoped>
.home {
  height: auto;
  gap: 20px;
  padding: 40px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (max-width: 768px) {
  .home {
    gap: 5px;
    padding: 20px 20px;
  }
}
</style>