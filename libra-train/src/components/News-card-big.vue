<template>
    <router-link :to="`/news/${news.slug}`"><div class="card_container">
        <img 
        class="image" 
        :src="require(`@/assets/covers/${news.cover}`)"
        loading="lazy" 
        />
        <img
        class="filter" 
        :src="require(`@/assets/filters/radial-white.svg`)"
        loading="lazy" 
        />
        <div class="text_container">
            <nameText class="newsname">{{ news.title }}</nameText>
        </div>
    </div></router-link>
  </template>
  
  <script>
  export default {
    name: 'NewsBigCard',
    props: {
      news: {
        type: Object,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .card_container {
    position: relative;
    width: 320px;
    height: 320px;
    border-radius: 30px;
    display: flex;
    justify-content: center;
    overflow: hidden;
  }
  .text_container {
    display: flex;
    text-align: center;
    align-items: center;
    position: absolute;
    width: 280px;
    height: 320px;
    font-family: 'Kreadon';
    font-size: 24px;
    color: #000000;
    z-index: 2;
    text-shadow: #fff 0px 0px 15px, #fff 0px 0px 15px, #fff 0px 0px 20px, #fff 0px 0px 20px;
  }
  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    z-index: 0;
    filter: blur(2px)
  }
  .filter {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
  }
  </style>