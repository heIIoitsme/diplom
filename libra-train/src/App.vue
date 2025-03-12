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
  font-family: Kreadon;
  background-color: #F0F0F0;
}

@font-face {
  font-family: 'Kreadon';
  src: local('Kreadon Medium'), local('Kreadon-Medium'),
    url('@fonts/Kreadon-Medium.woff2') format('woff2'),
    url('@fonts/Kreadon-Medium.woff') format('woff');
  font-weight: 100;
  font-style: normal;
}
</style>