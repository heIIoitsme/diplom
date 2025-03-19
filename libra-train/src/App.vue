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
  font-family: 'Kreadon';
  background-color: #f0f0f0;
}

@font-face {
  font-family: 'Kreadon';
  src: url('./assets/fonts/Kreadon-Medium.woff') format('woff'),
       url('./assets/fonts/Kreadon-Medium.woff2') format('woff2');
  font-weight: 500; /* Medium обычно соответствует 500 */
  font-style: normal;
  font-display: auto;
}
</style>
