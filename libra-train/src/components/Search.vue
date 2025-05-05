<template>
    <div class="search-results">
      <div v-if="filteredBooks.length">
        <h2>Результаты поиска</h2>
        <ul>
          <li 
            v-for="book in filteredBooks"
            :key="book._id"
            class="book-item"
          >
            <router-link :to="`/books/${book.slug}`">
              {{ book.title }}
            </router-link>
            <p class="author">{{ book.author }}</p>
          </li>
        </ul>
      </div>
      
      <div v-else-if="hasSearchQuery" class="no-results">
        По запросу "{{ searchQuery }}" ничего не найдено
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapState } from 'vuex'
  
  export default {
    computed: {
      ...mapGetters(['filteredBooks']),
      ...mapState(['searchQuery']),
      hasSearchQuery() {
        return this.searchQuery.trim().length > 0
      }
    }
  }
  </script>
  
  <style scoped>
  .search-results {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 15px;
  }
  
  .book-item {
    padding: 1rem;
    margin-bottom: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    transition: transform 0.2s;
  }
  
  .author {
    color: #666;
    font-size: 0.9em;
    margin-top: 0.5rem;
  }
  
  .no-results {
    text-align: center;
    padding: 2rem;
    color: #888;
  }
  
  @media (max-width: 768px) {
    .search-results {
      margin: 1rem auto;
    }
  
    .book-item {
      padding: 0.8rem;
      margin-bottom: 0.8rem;
    }
  
    .book-item a {
      font-size: 15px;
      line-height: 1.4;
    }
  
    .author {
      font-size: 0.8em;
    }
  
    .no-results {
      padding: 1.5rem;
      font-size: 0.9em;
    }
  }
  
  @media (max-width: 480px) {
    .book-item {
      padding: 0.6rem;
      margin-bottom: 0.6rem;
    }
  
    .book-item a {
      font-size: 14px;
    }
  
    .no-results {
      padding: 1rem;
      font-size: 0.85em;
    }
  }
  </style>