<template>
  <div id="app">
    <LibraHeader />
    <router-view />
    <notifications position="top right" />
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

.vue-notification {
  padding: 15px 20px;
  border-radius: 50px;
  font-weight: 500;
  color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin: 10px;
}

/* Успешные уведомления */
.vue-notification.success {
  background-color: #39b175;
}

/* Ошибки */
.vue-notification.error {
  background-color: #E63946;
}

/* Предупреждения */
.vue-notification.warn {
  background-color: #FFBE0B !important;
  color: black;
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
