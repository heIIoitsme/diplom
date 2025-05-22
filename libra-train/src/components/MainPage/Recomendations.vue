<template>
  <div class="fullmodule">
    <router-link :to="`/books/`" class="router-link-custom">
      <span class="headline"> Что почитать? </span>
    </router-link>
    <div v-if="books.length" class="books-grid">
      <BookCard 
        v-for="book in shuffledBooks.slice(0, 7)" 
        :key="book._id" 
        :book="book"
      />
    </div>
  </div>
</template>

<script>
import BookCard from '@/components/Modules/Book-card.vue'
import axios from 'axios'

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
      const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/books`)
      this.books = response.data
    } catch (error) {
      console.error('Ошибка загрузки книг:', error)
    }
  },
  computed: {
    shuffledBooks() {
      return this.books
        .map(b => ({ b, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(obj => obj.b)
    }
  }
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