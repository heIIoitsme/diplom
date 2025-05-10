<template>
  <div id="app">
    <LibraHeader />
    <router-view />
  </div>
</template>

<script>
import LibraHeader from '@/components/LibraHeader.vue';


export default {
  name: 'App',
  components: {
    LibraHeader,
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
