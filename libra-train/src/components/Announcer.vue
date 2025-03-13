<template>
    <div class="main">
      <router-link to="/advertising"><img src="@/assets/Advertising baner.svg" alt="Тут могла быть ваша реклама"></router-link>
    </div>
</template>

<script>
export default {
  name: 'Announcer',
};
</script>

<style scoped>
.main {
    background-color: white;
    width: 100%; /* Ширина блока */
    max-width: 1240px;
    height: 300px;
    display: flex;
    border-radius: 30px;
    box-shadow: 0px 15px 15px -10px rgba(0, 0, 0, 0.25);
}

@media (max-width: 768px) {
  .main {
    height: 150px;
    max-width: 460px;
  }
}
</style>