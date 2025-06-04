<template>
  <div class="register-title">Регистрация</div>
  <form @submit.prevent="submit" class="registration-form">
    <div class="form-group">
      <input
        type="email"
        v-model="formData.email"
        placeholder="Почта"
        :class="{ 'input-error': v$.formData.email.$error }"
        :disabled="isSubmitting"
      >
      <div v-if="v$.formData.email.$error" class="error-message">
        {{ emailError }}
      </div>
    </div>

    <div class="form-group">
      <input
        type="text"
        v-model="formData.username"
        placeholder="Логин"
        :class="{ 'input-error': v$.formData.username.$error }"
        :disabled="isSubmitting"
      >
      <div v-if="v$.formData.username.$error" class="error-message">
        {{ usernameError }}
      </div>
    </div>

    <div class="form-group">
      <div class="password-container">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="formData.password"
          placeholder="Пароль"
          :class="{ 'input-error': v$.formData.password.$error }"
          :disabled="isSubmitting"
        >
        <button
          type="button"
          @click="togglePasswordVisibility"
          class="toggle-password-btn"
          :disabled="isSubmitting"
        >
          <img :src="showPassword ? viewIcon : hideIcon" alt="Toggle Password" />
        </button>
      </div>
      <div v-if="v$.formData.password.$error" class="error-message">
        {{ passwordError }}
      </div>
    </div>

    <button
      type="submit"
      class="submit-btn"
      :disabled="isSubmitting"
    >
      {{ isSubmitting ? 'Регистрация...' : 'Зарегистрироваться' }}
    </button>
  </form>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, maxLength, helpers } from '@vuelidate/validators'
import axios from 'axios'
import hideIcon from '@/assets/pass-hide.svg'
import viewIcon from '@/assets/pass-view.svg'
import { useRouter } from 'vue-router'

const alphaNum = helpers.regex(/^[a-zA-Z0-9_]*$/)
const passwordRegex = helpers.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/)

export default {
  name: 'RegistrationModal',
  setup() {
    const router = useRouter()
    return { v$: useVuelidate(), router }
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
      viewIcon,
      isSubmitting: false,
      serverErrors: {
        email: '',
        username: ''
      }
    }
  },
  validations() {
    return {
      formData: {
        email: { 
          required: helpers.withMessage('Обязательное поле', required),
          email: helpers.withMessage('Некорректный email', email)
        },
        username: {
          required: helpers.withMessage('Обязательное поле', required),
          minLength: helpers.withMessage('Минимум 3 символа', minLength(3)),
          maxLength: helpers.withMessage('Максимум 20 символов', maxLength(20)),
          alphaNum: helpers.withMessage('Только буквы и цифры', alphaNum)
        },
        password: {
          required: helpers.withMessage('Обязательное поле', required),
          minLength: helpers.withMessage('Минимум 6 символов', minLength(6)),
          validPassword: helpers.withMessage(
            'Должна быть минимум 1 цифра, 1 заглавная и 1 строчная буква', 
            passwordRegex
          )
        }
      }
    }
  },
  computed: {
    emailError() {
      return this.serverErrors.email || this.v$.formData.email.$errors[0]?.$message || ''
    },
    usernameError() {
      return this.serverErrors.username || this.v$.formData.username.$errors[0]?.$message || ''
    },
    passwordError() {
      return this.v$.formData.password.$errors[0]?.$message || ''
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    
    async submit() {
      if (this.isSubmitting) return;
      
      this.serverErrors = { email: '', username: '' };
      const isValid = await this.v$.$validate();
      
      if (!isValid) return;
  
      this.isSubmitting = true;
  
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_URL}/api/register`,
          {
            email: this.formData.email,
            username: this.formData.username,
            password: this.formData.password
          }
        );
  
        switch (response.status) {
          case 201:
            this.$emit('registration-success');
            this.showNotification('Регистрация прошла успешно!', 'success');
            this.resetForm();
            this.router.push('/');
            break;
            
          case 204:
            this.showNotification('Данные успешно обработаны', 'info');
            break;
            
          default:
            this.showNotification('Неизвестный ответ сервера', 'warning');
        }
      }
      catch (error) {
        this.handleRegistrationError(error);
      } 
      finally {
        this.isSubmitting = false;
      }
    },
  
    handleRegistrationError(error) {
      if (!error.response) {
        this.showNotification('Ошибка сети. Проверьте соединение', 'error')
        return
      }
  
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          this.showNotification('Некорректные данные', 'error')
          break
          
        case 409:
          if (data.error.includes('email')) {
            this.serverErrors.email = data.error
            this.v$.formData.email.$invalid = true
          } else {
            this.serverErrors.username = data.error
            this.v$.formData.username.$invalid = true
          }
          break
          
        default:
          this.showNotification('Ошибка сервера. Попробуйте позже', 'error')
      }
    },
  
    resetForm() {
      this.formData = { email: '', username: '', password: '' }
      this.v$.$reset()
    },
  
    showNotification(message, type) {
      this.$notify({
        title: type === 'success' ? 'Успех!' : 'Ошибка!',
        text: message,
        type: type,
        duration: 3000
      })
    }
  }
}
</script>

<style scoped>
.register-title {
  font-size: 48px;
}

.form-group {
  width: 600px;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 15px;
  box-sizing: border-box;
  font-family: 'Kreadon';
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.password-container {
  position: relative;
}

.toggle-password-btn {
  height: 22px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  cursor: pointer;
  background: transparent;
  padding: 0 10px;
}

.toggle-password-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.toggle-password-btn img {
  height: 22px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Kreadon';
  font-size: 20px;
  box-shadow: 0px 5px 0px 0px rgba(0, 0, 0, 0.25);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0px 5px 0px 0px rgba(0, 0, 0, 0.25);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(3px);
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.25);
  background-color: #333;
}

.submit-btn:disabled {
  background-color: #666;
  cursor: not-allowed;
  opacity: 0.7;
}

.input-error {
  border-color: #ff4444;
  box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.25);
}

.error-message {
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  min-height: 1.2em;
}
</style>