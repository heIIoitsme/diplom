<template>
    <div class="register">
      <RegistrationModal />
    </div>
  </template>
  
  <script>
  import RegistrationModal from '@/components/RegistrationModal.vue';
  
  export default {
    name: 'Register',
    components: {
        RegistrationModal,
    },
  };
  
  
  </script>
  
  <style scoped>
  .register {
    height: auto;
    gap: 20px;
    padding: 40px 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  @media (max-width: 768px) {
    .register {
      gap: 5px;
      padding: 20px 20px;
    }
  }
  </style>