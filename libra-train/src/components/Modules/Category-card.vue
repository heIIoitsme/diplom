<template>
  <router-link :to="`/category/${category.slug}`" class="router-link-custom"><div class="card_container">
      <img 
        class="image" 
        :src="require(`@/assets/categories/${category.cover}`)"
        loading="lazy" 
        :alt="category.title"
      />
      <div class="categoryname">{{ category.title }}</div>
  </div></router-link>
</template>
  
  <script>
  export default {
    name: 'CategoryCard',
    props: {
      category: {
        type: Object,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .categoryname {
    position: absolute;
    font-family: 'Kreadon';
    font-size: clamp(1rem, 9vw, 1.5rem); /* Минимальный размер 1rem, максимальный 2rem */
    text-align: center;
    color: #1a1a1a;
    z-index: 2;
    width: 150px;
  }
  .card_container {
    position: relative;
    width: 155px;
    height: 315px;
    border-radius: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: transform 0.3s ease;
  }
  .card_container:hover {
  transform: translateY(-3px);
  }
  .card_container img {
    width: 155px;
    height: 315px;
    border-radius: 30px;
    z-index: 1;
    text-align: center;
  }
  .router-link-custom {
  text-decoration: none;
  display: inline-block;
  }
  </style>