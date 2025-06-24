<template>
    <div class="card_container">
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
            <div class="newsname">{{ news.title }}</div>
        </div>
    </div>
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
    color: #1a1a1a;
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

  @media(max-width: 850px) {
    .card_container {
      width: 250px;
      height: 250px;
    }
    .text_container {
      width: 210px;
      height: 250px;
    }
  }
    @media(max-width: 570px) {
    .card_container {
      width: 185px;
      height: 185px;
    }
    .text_container {
      width: 145px;
      height: 185px;
    }
  }
      @media(max-width: 430px) {
    .card_container {
      width: 170px;
      height: 170px;
    }
    .text_container {
      width: 130px;
      height: 170px;
      font-size: 20px;
    }
  }
  </style>