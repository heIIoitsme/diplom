<template>
  <div class="card_container">
      <img 
        class="image" 
        :src="require(`@/assets/categories/${category.cover}`)" 
        :alt="category.title"
      />
      <nameText class="categoryname">{{ category.title }}</nameText>
  </div>
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
    font-family: 'Kreadon';
    font-size: clamp(1rem, 9vw, 1.5rem); /* Минимальный размер 1rem, максимальный 2rem */
    text-align: center;
    z-index: 2;
    width: 150px;
  }
  .card_container {
    width: 155px;
    height: 300px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .card_container img {
    position: absolute;
    z-index: 1;
  }
  </style>