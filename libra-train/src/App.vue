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
<<<<<<< HEAD
  background-color: #F0F0F0;
=======
>>>>>>> f7a53161d751d5b9efcf25ea8b618fd6a01521a6
}
</style>