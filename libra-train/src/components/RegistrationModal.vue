<template>
          <div class="form-group">
            <input
              type="text"
              v-model="formData.email"
              placeholder="Почта"
              required
              class="form-input"
            >
            <input
              type="text"
              v-model="formData.username"
              placeholder="Логин"
              required
              class="form-input"
            >
            <input
              type="password"
              v-model="formData.password"
              placeholder="Пароль"
              required
              class="form-input"
            >
          </div>
          <button type="submit" class="submit-btn">Войти</button>
  </template>
  
  <script>
  export default {
    name: 'RegistrationModal',
    data() {
      return {
        formData: {
            email: '',
            username: '',
            password: '',
        }
      }
    },
    methods: {
      close() {
        this.$emit('close')
      },
      submit() {
        this.$emit('submit', this.formData)
        this.formData = { email: '', username: '', password: '' }
      }
    }
  }
  </script>
  
  <style scoped>
  .form-group {
    width: 600px;
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 30px;
  }
  .form-group input {
    height: 35px;
    width: 100%;
    border-radius: 15px;
    padding: 10px;
    font-family: 'Kreadon';
    font-size: 18px;
    box-sizing: border-box;
  }

  .submit-btn {
    width: 100%;
    padding: 12px;
    background: #000;
    color: white;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    transition: background 0.3s;
    font-family: 'Kreadon';
    font-size: 20px;
    box-shadow: 0px 5px 0px 0px rgba(0, 0, 0, 0.25)
  }

  .submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0px 5px 0px 0px rgba(0, 0, 0, 0.25);
}

/* Эффект при нажатии */
.submit-btn:active {
  transform: translateY(3px);
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.25);
  background-color: #333;
}

/* Дополнительный эффект "волны" при клике */
.submit-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.2s, height 0.2s;
}

.submit-btn:active::after {
  width: 300px;
  height: 100px;
}

  </style>