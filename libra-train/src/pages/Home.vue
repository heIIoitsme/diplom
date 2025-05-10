<template>
  <div class="home">
    <Announcer />
    <Recomendations />
    <NewsBanner />
    <Categories />
  </div>
</template>

<script>
import Announcer from '@/components/MainPage/Announcer.vue';
import Recomendations from '@/components/MainPage/Recomendations.vue';
import Categories from '@/components/MainPage/Categories.vue';
import NewsBanner from '@/components/MainPage/NewsBanner.vue'

export default {
  name: 'Home',
  components: {
    Announcer,
    Recomendations,
    NewsBanner,
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