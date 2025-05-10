<template>
    <div class="fullmodule">
      <router-link :to="`/news/$`" class="router-link-custom"><span class="headline"> Статьи и новости </span></router-link>
        <div class ='news-container'>
            <div v-if="newses.length" class="news-big-grid">
            <NewsBigCard 
                v-for="news in newses.slice(0, 2)" 
                :key="news._id" 
                :news="news"
            />
            </div>
            <div v-if="newses.length" class="news-small-grid">
            <NewsSmallCard 
                v-for="news in newses.slice(2, 5)" 
                :key="news._id" 
                :news="news"
            />
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import NewsBigCard from '@/components/Modules/News-card-big.vue'
  import NewsSmallCard from '@/components/Modules/News-card-small.vue'
  import axios from 'axios'
  
  export default {
    name: 'NewsBanner',
    components: { NewsBigCard, NewsSmallCard },
    data() {
      return {
        newses: []
      }
    },
    async created() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/news`); 
        this.newses = response.data
      } catch (error) {
        console.error('Ошибка загрузки новостей', error)
      }
    },
  }
  </script>
  
  <style scoped>
  .news-container{
    display: flex;
    flex-direction: row;
    max-width: 2000px;
    height: 320px;
    gap: 20px;
  }
  .news-big-grid {
    display: flex;
    flex-direction: row;
    gap: 20px;
  }
  .news-small-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
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