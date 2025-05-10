<template>
    <div class="banner">
      <router-link to="/advertising"><img src="@/assets/AdvertisingBaner.svg" loading="lazy" alt="Тут могла быть ваша реклама"></router-link>
    </div>
</template>

<script>
export default {
  name: 'Announcer',
};
</script>

<style scoped>
.banner {
    background-color: white;
    width: 100%; /* Ширина блока */
    max-width: 1240px;
    height: 300px;
    display: flex;
    border-radius: 30px;
    box-shadow: 0px 15px 15px -10px rgba(0, 0, 0, 0.25);
}

@media (max-width: 992px) {
  .banner {
    width: 95%;
    aspect-ratio: 3 / 1;
    border-radius: 15px;
  }
}

@media (max-width: 768px) {
  .banner {
    aspect-ratio: 2 / 1;
    margin: 15px auto;
    border-radius: 12px;
  }
}

@media (max-width: 480px) {
  .banner {
    aspect-ratio: 1.5 / 1;
    border-radius: 10px;
    box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.25);
  }
}
</style>