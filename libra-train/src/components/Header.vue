<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/logo.png" alt="Логотип">
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
<<<<<<< HEAD
  height: 80px;
=======
>>>>>>> f7a53161d751d5b9efcf25ea8b618fd6a01521a6
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
<<<<<<< HEAD
  background-color: white;
=======
  background-color: #333;
  color: white;
>>>>>>> f7a53161d751d5b9efcf25ea8b618fd6a01521a6
}

.logo img {
  height: 50px;
}

.nav a {
  color: white;
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