<template>
  <div class="home">
    <Announcer />
  </div>
</template>

<script>
import Announcer from '@/components/Announcer.vue';
export default {
  name: 'Home',
  components: {
    Announcer,
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
</style>