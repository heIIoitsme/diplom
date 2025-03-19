<template>
    <div class="modal-overlay" @click="close">
      <div class="login-modal" @click.stop>
        <div class="modal-header">
          <h2>Вход</h2>
          <button class="close-modal" @click="close">
            <span class="close-icon"></span>
          </button>
        </div>
        <form @submit.prevent="submit">
          <div class="form-group">
            <input
              type="text"
              v-model="formData.username"
              placeholder="Логин"
              required
              class="form-input"
            >
          </div>
          <div class="form-group">
            <input
              type="password"
              v-model="formData.password"
              placeholder="Пароль"
              required
              class="form-input"
            >
          </div>
          <button type="submit" class="submit-btn">Войти</button>
        </form>
        <p class="register-text">
          Нет аккаунта? 
          <router-link to="/register" class="register-link" @click="close">Зарегистрироваться</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        formData: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      close() {
        this.$emit('close')
      },
      submit() {
        this.$emit('submit', this.formData)
        this.formData = { username: '', password: '' }
      }
    }
  }
  </script>
  
  <style scoped>

    .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    }

    .login-modal {
    background: white;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 300px;
    }

    .login-modal h2 {
    margin: 0 0;
    font-family: 'Kreadon';
    }

    .login-modal input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 15px;
    box-sizing:border-box;
    }

    .login-modal button {
    padding: 10px;
    cursor: pointer;
    }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .close-modal {
    top: 15px;
    right: 15px;
    width: 24px;
    height: 24px;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    transition: transform 0.2s; /* Добавлено для плавного увеличения */
}

.close-icon {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    transition: transform 0.2s; /* Добавлено для плавного увеличения */
}

.close-modal:hover .close-icon {
    transform: scale(1.2); /* Увеличиваем размер на 20% при наведении */
}

.close-icon::before,
.close-icon::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 18px;
    height: 2px;
    background: #333;
    transform: translate(-50%, -50%) rotate(45deg);
}

.close-icon::after {
    transform: translate(-50%, -50%) rotate(-45deg);
}
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-family: 'Kreadon';
    font-size: 14px;
    transition: border-color 0.3s;
  }
  
  .form-input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
  
  .submit-btn {
    width: 100%;
    padding: 12px;
    background: #000;
    color: white;
    border: none;
    border-radius: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.3s;
    font-family: 'Kreadon';
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
  
  .register-text {
    text-align: center;
    margin-top: 15px;
    color: #666;
  }
  
  .register-link {
    color: #007bff;
    text-decoration: none;
  }
  
  .register-link:hover {
    text-decoration: underline;
  }
  </style>