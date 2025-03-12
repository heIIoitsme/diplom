<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/LibraTrain.png" alt="Логотип" >
    </div>
    <nav class="nav">
      <router-link to="/">Главная</router-link>
      <router-link to="/about">О нас</router-link>
      <router-link to="/contact">Контакты</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header',
};
</script>

<style scoped>
.header {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
}

.logo img {
  height: 50px;
}

.nav a {
  font-family: Kreadon;
  color: rgb(0, 0, 0);
  margin: 0 1rem;
  text-decoration: none;
}

.nav a:hover {
  text-decoration: underline;
}

/* media-запросы */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    text-align: center;
  }

  .nav {
    
    margin-top: 1rem;
  }

  .nav a {
    display: block;
    margin: 0.5rem 0;
  }
}
</style>