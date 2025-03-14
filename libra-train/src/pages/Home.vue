<template>
  <div class="home">
    <Announcer />
    <Recomendations />
    <Categories />
  </div>
</template>

<script>
import Announcer from '@/components/Announcer.vue';
import Recomendations from '@/components/Recomendations.vue';
import Categories from '@/components/Categories.vue';

export default {
  name: 'Home',
  components: {
    Announcer,
    Recomendations,
    Categories,
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