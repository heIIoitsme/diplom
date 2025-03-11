<template>
  <div id="app">
    <Header />
    <router-view />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';

export default {
  name: 'App',
  components: {
    Header,
  },
};
</script>

<style>
/* Глобальные стили */
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>