<template>
  <form @submit.prevent="submit" class="registration-form">
    <!-- Email -->
    <div class="form-group">
      <input
        type="email"
        v-model="formData.email"
        placeholder="Почта"
        :class="{ 'input-error': v$.formData.email.$error }"
      >
      <div v-if="v$.formData.email.$error" class="error-message">
        {{ emailError }}
      </div>
    </div>

    <!-- Логин -->
    <div class="form-group">
      <input
        type="text"
        v-model="formData.username"
        placeholder="Логин"
        :class="{ 'input-error': v$.formData.username.$error }"
      >
      <div v-if="v$.formData.username.$error" class="error-message">
        {{ usernameError }}
      </div>
    </div>

    <!-- Пароль -->
    <div class="form-group">
      <div class="password-container">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="formData.password"
          placeholder="Пароль"
          :class="{ 'input-error': v$.formData.password.$error }"
        >
        <button type="button" @click="togglePasswordVisibility" class="toggle-password-btn">
          <img :src="showPassword ? viewIcon : hideIcon" alt="Toggle Password" />
        </button>
      </div>
      <div v-if="v$.formData.password.$error" class="error-message">
        {{ passwordError }}
      </div>
    </div>

    <button type="submit" class="submit-btn">Зарегистрироваться</button>
  </form>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, maxLength, helpers } from '@vuelidate/validators'

import hideIcon from '@/assets/pass-hide.svg';
import viewIcon from '@/assets/pass-view.svg';

const alphaNum = helpers.regex(/^[a-zA-Z0-9_]*$/)
const passwordRegex = helpers.regex(/^(?=.*\d)(?=.*[A-Z]).*$/)

export default {
  name: 'RegistrationModal',
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      formData: {
        email: '',
        username: '',
        password: '',
      },
      showPassword: false,
      hideIcon,
      viewIcon, // Новое состояние для видимости пароля
    }
  },
  validations() {
    return {
      formData: {
        email: { 
          required: helpers.withMessage('Поле обязательно', required),
          email: helpers.withMessage('Некорректный email', email)
        },
        username: {
          required: helpers.withMessage('Поле обязательно', required),
          minLength: helpers.withMessage('Минимум 3 символа', minLength(3)),
          maxLength: helpers.withMessage('Максимум 20 символов', maxLength(20)),
          alphaNum: helpers.withMessage('Только буквы и цифры', alphaNum)
        },
        password: {
          required: helpers.withMessage('Поле обязательно', required),
          minLength: helpers.withMessage('Минимум 6 символов', minLength(6)),
          containsUppercase: helpers.withMessage(
            'Должна быть заглавная буква', 
            passwordRegex
          )
        }
      }
    }
  },
  computed: {
    emailError() {
      return this.v$.formData.email.$errors[0]?.$message || ''
    },
    usernameError() {
      return this.v$.formData.username.$errors[0]?.$message || ''
    },
    passwordError() {
      return this.v$.formData.password.$errors[0]?.$message || ''
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword; // Переключение состояния видимости пароля
    },
    async submit() {
      const isValid = await this.v$.$validate()
      if (!isValid) return
      
      this.$emit('submit', this.formData)
      this.formData = { email: '', username: '', password: '' }
      this.v$.$reset()
    },
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
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 15px;
  box-sizing: border-box;
  font-family: 'Kreadon';
  font-size: 14px;
}
.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.password-container {
  position: relative; /* Позволяет позиционировать кнопку внутри контейнера */
}

.toggle-password-btn {
  height: 22px;
  position: absolute;
  right: 10px; /* Отступ от правого края */
  top: 50%; /* Центрирование по вертикали */
  transform: translateY(-50%); /* Центрирование по вертикали */
  border: none;
  cursor: pointer;
  font-family: 'Kreadon';
  font-size: 16px;
  background: linear-gradient(to right, transparent, white 10%);
  padding: 0 10px
}

.toggle-password-btn img {
  height: 22px;
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

.input-error {
  border-color: rgb(255, 68, 68);
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.25);
}

.error-message {
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>