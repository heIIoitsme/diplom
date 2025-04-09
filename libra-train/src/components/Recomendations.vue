<template>
    <div class="fullmodule">
      <router-link :to="`/book/`" class="router-link-custom"><span class="headline"> Рекомендации </span></router-link>
            <div v-if="books.length" class="books-grid">
            <BookCard 
                v-for="book in books.slice(0, 7)" 
                :key="book._id" 
                :book="book"
            />
            </div>
    </div>
  </template>
  
  <script>
  import BookCard from '@/components/Book-card.vue'
  
  export default {
    name: 'Recomendations',
    components: { BookCard },
    data() {
      return {
        books: []
      }
    },
    async created() {
      try {
        const response = await import('@/database/books.json')
        this.books = response.default
      } catch (error) {
        console.error('Ошибка загрузки книг:', error)
      }
    },
  }
  </script>
  
  <style scoped>
  .books-grid {
    display: flex;
    gap: 55px;
    max-width: 2000px;
    height: 260px;
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