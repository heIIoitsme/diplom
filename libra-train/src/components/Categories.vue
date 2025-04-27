<template>
    <div class="fullmodule">
      <router-link :to="`/category/`" class="router-link-custom"><span class="headline"> Категории </span></router-link>
            <div v-if="categories.length" class="rec-grid">
            <CategoryCard
                v-for="category in categories.slice(0, 7)" 
                :key="category._id" 
                :category="category"
            />
            </div>
    </div>
  </template>
  
  <script>

import CategoryCard from '@/components/Category-card.vue'
import axios from 'axios';
  
  export default {
    name: 'Categories',
    components: { CategoryCard },
    data() {
      return {
        categories: []
      }
    },
    async created() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/genres`); 
        this.categories = response.data
      } catch (error) {
        console.error('Ошибка загрузки книг:', error)
      }
    },
  }
  </script>
  
  <style scoped>
  .rec-grid {
    display: flex;
    gap: 25px;
    max-width: 2000px;
    height: 315px;
  }
  .headline {
    font-family: 'Kreadon';
    font-size: 40px;
    color: black;
  }
  .fullmodule {
    display: flex;
    flex-direction: column;
    gap:10px;
  }
  .router-link-custom{
    text-decoration: none;
    display: inline-block;
  }
  </style>