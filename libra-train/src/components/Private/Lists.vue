<template>
    <div v-if="user" class="container">
      <div class="profile_full">
        <div class="profile_main">
          <img 
            class="image" 
            :src="require(`@/assets/covers/anna-karenina.jpeg`)" 
            loading="lazy" 
          />
          <h1 class="nickname">{{ user.username }}</h1>
        </div>
  
        <div class="stata_main">
          <div class="stata_first">
            <div class="rating"></div>
            <div class="main_genre"></div>
          </div>
  
          <div class="lists">
            <ListCard
              v-for="(entries, status) in groupedByStatus"
              :key="status"
              :title="capitalize(status)"
              :entries="entries"
            />
          </div>
        </div>
      </div>
    </div>
    <p v-else>Загрузка...</p>
  </template>
  
<script setup>
  import { useProfile } from './useProfile.js';
  const { user } = useProfile()
</script>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 40px;
  }
  
  .profile_full {
    width: 1400px;
    display: flex;
    gap: 40px;
  }
  
  .profile_main {
    width: 360px;
    height: 800px;
    background-color: #ffffff;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .nickname {
    font-size: 22px;
    margin-bottom: 20px;
  }
  
  .image {
    width: 220px;
    height: 220px;
    border-radius: 50%;
    object-fit: cover;
    margin: 30px auto 10px;
  }
  
  .stata_main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  
  .lists {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  </style>