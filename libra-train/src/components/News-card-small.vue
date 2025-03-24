<template>
    <div class="card_container">
        <img
        class="filter" 
        :src="require(`@/assets/filters/horiz-white.svg`)" 
        />
        <img 
        class="image" 
        :src="require(`@/assets/covers/${news.cover}`)" 
        />
        <div class="text_container">
            <nameText class="newsname">{{ news.title }}</nameText>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NewsSmallCard',
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
    width: 560px;
    height: 100px;
    border-radius: 30px;
    overflow: hidden;
  }
  .text_container {
    width: 260px;
    height: 80px;
    bottom: 10px;
    left: 20px;
    display: flex;
    align-items: center;
    position: absolute;
    font-family: 'Kreadon';
    font-size: 24px;
    color: #000000;
    z-index: 2;
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