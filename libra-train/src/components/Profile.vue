<template>
    <div class="container">
        <div class="profile_full">
            <div class="profile_main">
                <img 
                  class="image" 
                  :src="require(`@/assets/covers/anna-karenina.jpeg`)"
                  loading="lazy" 
                />
                <!-- Динамическое имя пользователя -->
                <h1 class="nickname">{{ user.username }}</h1>
            </div>
            <div class="profile_other">
                <div class="profile_second">
                    <div class="profile_last"></div>
                    <div class="profile_stata">
                        <a> Список книг </a>
                    </div>
                </div>
                <div class="profile_time"></div>
                <div class="profile_end"></div>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'Profile',
    setup() {
      const user = ref(null);
      const error = ref('');
      const router = useRouter();
  
      onMounted(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          return router.replace('/register');
        }
  
        try {
          const res = await fetch('http://localhost:3000/api/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!res.ok) {
            return router.replace('/register');
          }
          user.value = await res.json();
        } catch (e) {
          error.value = 'Не удалось загрузить профиль';
        }
      });
  
      return { user, error };
    }
  };
  </script>
  
  <style scoped>
  .container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px
  }
  
  .profile_full {
      width: 1400px;
      height: 800px;
      display: flex;
      gap: 40px;
      position: relative;
  }
  
  .profile_main {
      width: 360px;
      height: 100%;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      border-radius: 20px;
      gap: 10px;
  }
  
  .profile_other {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 30px;
  }
  
  .profile_second {
      display: flex;
      gap: 40px;
      height: 300px;
  }
  
  .profile_last {
      width: 480px;
      background-color: #ffffff;
      border-radius: 20px;
  }
  
  .profile_stata {
      width: 480px;
      background-color: #ffffff;
      border-radius: 20px;
  }
  .profile_stata a {
    display: block;
    font-size: 32px;
    margin: 20px;
  }
  
  .profile_time {
      height: 140px;
      background-color: #ffffff;
      border-radius: 20px;
  }
  
  .profile_end {
      height: 410px;
      background-color: #ffffff;
      border-radius: 20px;
  }
  
  .image {
      height: 250px;
      width: 250px;
      border-radius: 50%;
      padding: 55px;
  }
  
  .nickname {
      text-align: center;
      margin: 0px
  }
  
  @media (max-width: 1500px) {
  .profile_full {
      transform: scale(0.9);
      transform-origin: center;
  }
  }
  
  @media (max-width: 1300px) {
  .profile_second {
      grid-template-columns: 1fr 1fr;
  }
  
  .profile_last,
  .profile_stata {
      width: 100% !important;
      max-width: none;
  }
  }
  
  @media (max-width: 1024px) {
  .profile_full {
      flex-direction: column;
      width: 95%;
      height: auto;
      gap: 30px;
  }
  
  .profile_main {
      width: 100%;
      height: 300px;
      display: flex;
      flex-direction: row;
  }
  
  .image {
      padding: 25px;
  }
  
  .profile_second {
      grid-template-columns: 1fr;
      height: auto;
      gap: 20px;
  }
  
  .profile_last,
  .profile_stata {
      height: 250px;
  }
  }
  
  @media (max-width: 768px) {
  .profile_last,
  .profile_stata {
      height: 200px;
  }
  
  .profile_time,
  .profile_end {
      height: 120px;
  }
  }
  </style>