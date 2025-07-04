<template>
  <div v-if="book" class="container">
    <div class="breadcrumbs">
      <router-link to="/">Главная</router-link>
      <span> / </span>
      <router-link :to="{ name: 'AllBooks' }">Все книги</router-link>
      <span> / </span>
      <span>{{ book.title }}</span>
    </div>
    <div class="first_container">
      <img
        class="book_img"
        :src="require(`@/assets/covers/${book.cover}`)"
        alt="Обложка книги"
      />
      <div class="main_info">
        <div style="display: flex; flex-direction: column;">
          <a1>{{ book.title }}</a1>
          <a2>{{ book.author[0].fullName }}</a2>
        </div>
        <div class="rating_info">
          <div>
            <div class="rating_text">
              <a3>Рейтинг</a3>
              <a3>{{ book.rating != null ? book.rating.toFixed(1).replace('.', ',') : '—' }}</a3>
            </div>
            <div class="stars">
              <svg 
                v-for="n in 5"
                :key="n"
                class="star"
                width="30"
                height="30"
                viewBox="0 0 30 30"
              >
                <defs>
                  <linearGradient :id="`gradient-${n}`">
                    <stop offset="0%" stop-color="#000"/>
                    <stop :offset="getFillPercent(n)" stop-color="#000"/>
                    <stop :offset="getFillPercent(n)" stop-color="transparent"/>
                    <stop offset="100%" stop-color="transparent"/>
                  </linearGradient>
                </defs>
                <path 
                  d="M13.5361 1.49023C13.6939 1.099 14.2236 1.07454 14.4277 1.41699L14.4639 1.49023L17.5225 9.08691C17.7068 9.54462 18.102 9.8786 18.5742 9.98828L18.7803 10.0205L26.6904 10.7275C27.0964 10.7641 27.2804 11.2366 27.0371 11.5371L26.9824 11.5947L20.9004 17.1406C20.5533 17.4573 20.3777 17.9153 20.417 18.376L20.4473 18.5732L22.2607 26.7559C22.3507 27.1632 21.9368 27.4828 21.5752 27.3242L21.5039 27.2861L14.8047 23.0293C14.3444 22.7369 13.7643 22.7187 13.2891 22.9746L13.1953 23.0293L6.49609 27.2861C6.14391 27.5099 5.70307 27.2298 5.72852 26.8359L5.73926 26.7559L7.55273 18.5732C7.65441 18.1143 7.53483 17.6384 7.2373 17.2842L7.09961 17.1406L1.01758 11.5947C0.716252 11.3199 0.855911 10.8322 1.23145 10.7402L1.30957 10.7275L9.21973 10.0205C9.71086 9.97657 10.144 9.69527 10.3857 9.27539L10.4775 9.08691L13.5361 1.49023Z"
                  :fill="`url(#gradient-${n})`"
                  stroke="#2D2D2D"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <div class="status-buttons">
            <button
              v-for="s in statuses"
              :key="s"
              @click="s === currentStatus ? deleteEntry() : selectStatus(s)"
              @mouseenter="hoverStatus = s"
              @mouseleave="hoverStatus = null"
              :class="{ active: s === currentStatus }"
            >
              <!-- Если это текущий статус и на него наводят, показываем "Удалить..." -->
              {{ (s === currentStatus && hoverStatus === s)
                  ? 'Удалить'
                  : capitalize(s) }}
            </button>
          </div>
        </div>
      </div>
      <div class="second_container">
        <a2>О книге</a2>
        <div class="content">
          <p class="description">{{ book.description }}</p>
        </div>
      </div>
    </div>

    <div class="reviews_container">
      <div class="all_reviews">
        <div class="reviews_content">
          <span>Все отзывы ({{ reviews.length }})</span>

          <div class="reviews-scrollable">
            <div class="review_list">
              <ReviewCard
              v-for="review in reviews"
              :key="review._id"
              :review="review"
            />
            </div>
            <p v-if="reviews.length === 0">Будьте первым, кто напишет отзыв к этой книге!</p>
          </div>

          <div class="new_review">
            <h4>Добавить отзыв</h4>
            <textarea
              v-model="newReviewText"
              placeholder="Ваш отзыв..."
              :disabled="isSubmitting"
            ></textarea>
            <button
              @click="submitReview"
              :disabled="!newReviewText.trim() || isSubmitting"
              class="submit-button"
            >
              {{ isSubmitting ? 'Отправка...' : 'Отправить' }}
            </button>
          </div>
        </div>
      </div>
      <div class="write_review">
        <span>Что-нибудь еще</span>
      </div>
    </div>
  </div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>Загрузка...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useNotification } from '@kyvg/vue3-notification'
import ReviewCard from '@/components/Modules/Review-card.vue'

const newReviewText = ref('');
const isSubmitting = ref(false);

const reviews = ref([])

const { notify } = useNotification()
const route = useRoute()

const book = ref(null)
const error = ref('')
const currentStatus = ref(null)
// для отслеживания наведения
const hoverStatus = ref(null)

const statuses = [
  'прочитано',
  'запланировано',
  'брошено',
  'читаю',
  'отложено'
]

onMounted(async () => {
  console.log('Компонент смонтирован')
  const id = route.params.id

  // Загрузка книги
  try {
    const res = await axios.get(
      `${process.env.VUE_APP_API_URL}/api/books/${id}`
    )
    book.value = res.data

    document.title = book.value.title
  } catch (e) {
    console.error('Ошибка загрузки книги:', e)
    error.value = 'Ошибка при загрузке книги'
    return
  }

  try {
    const resReviews = await axios.get(`${process.env.VUE_APP_API_URL}/api/reviews/${id}`)
    console.log('Полученные отзывы:', resReviews.data);
    reviews.value = resReviews.data
  } catch (e) {
    console.error('Ошибка загрузки отзывов:', e)
  }

  // Загрузка текущего статуса
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const resStatus = await axios.get(
      `${process.env.VUE_APP_API_URL}/api/user-books/book/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    currentStatus.value = resStatus.data?.status || null
  } catch (e) {
    console.error('Ошибка получения статуса книги:', e)
  }
})

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

async function selectStatus(status) {
  const token = localStorage.getItem('token')
  if (!token) {
    notify({
      title: 'Внимание!',
      text: 'Войдите или зарегистрируйтесь',
      type: 'warn',
      duration: 2000
    })
    return
  }

  try {
    const bookId = route.params.id
    await axios.post(
      `${process.env.VUE_APP_API_URL}/api/user-books`,
      { bookId, status, addedAt: new Date() },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    currentStatus.value = status
  } catch (e) {
    console.error('Ошибка добавления в список:', e)
  }
}

async function deleteEntry() {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const bookId = route.params.id
    await axios.delete(
      `${process.env.VUE_APP_API_URL}/api/user-books/${bookId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    currentStatus.value = null
  } catch (e) {
    console.error('Ошибка удаления из списка:', e)
  }
}

const submitReview = async () => {
  try {
    isSubmitting.value = true;
    const token = localStorage.getItem('token');
    
    if (!token) {
      notify({
        title: 'Ошибка',
        text: 'Необходимо авторизоваться',
        type: 'error',
        duration: 2000
      });
      return;
    }

    if (!newReviewText.value.trim()) {
      notify({
        title: 'Ошибка',
        text: 'Текст отзыва не может быть пустым',
        type: 'error',
        duration: 2000
      });
      return;
    }

    // Дебаг-логи перед отправкой
    console.log('Отправка отзыва:', {
      bookId: route.params.id,
      text: newReviewText.value.trim(),
      endpoint: `${process.env.VUE_APP_API_URL}/api/reviews`
    });

    await axios.post(
      `${process.env.VUE_APP_API_URL}/api/reviews`,
      {
        bookId: route.params.id,
        text: newReviewText.value.trim()
      },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Обновляем список
    const { data } = await axios.get(
      `${process.env.VUE_APP_API_URL}/api/reviews/${route.params.id}`
    );
    reviews.value = data;
    
    notify({
      title: 'Успех!',
      text: 'Отзыв добавлен',
      type: 'success',
      duration: 2000
    });
    
    newReviewText.value = '';

  } catch (error) {
    console.error('Полная ошибка:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });

    notify({
      title: 'Ошибка',
      text: error.response?.data?.error || 
            error.response?.data?.message || 
            'Не удалось отправить отзыв',
      type: 'error',
      duration: 3000
    });
  } finally {
    isSubmitting.value = false;
  }
};

const getFillPercent = (position) => {
  const rating = book.value?.rating || 0;
  const fill = Math.min(Math.max(rating - (position - 1), 0), 1); // Ограничиваем от 0 до 1
  return `${fill * 100}%`;
}
</script>

<style scoped>

.breadcrumbs {
  margin: 10px 0;
  font-size: 14px;
  color: #666;
}

.breadcrumbs a {
  color: #337ab7;
  text-decoration: none;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px
  }
  .first_container{
    display: flex;
    flex-direction: row;
    max-width: 1400px;
    width: 100%;
    border-radius: 20px;
    background-color: #fff;
}

  .second_container {
    height: 310px;
    max-width: 450px;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
}

  .second_container .content {
  max-height: 240px; /* или 100% - высота заголовка - отступы */
  overflow-y: auto;
  padding-right: 5px;
}
  
  .second_container a2 {
    display: block;
    margin-bottom: 10px;
    font-size: 32px;
  }
  .second_container .description {
    overflow-y: auto;
    padding-right: 5px;
    font-size: 20px;
    white-space: pre-line;
  }

  .main_info {
    max-width: 690px;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px;
    justify-content: space-between;
  }
  .main_info a1 {
    font-size: 48px;
  }
  .main_info a2 {
    color: #555555;
    font-size: 32px;
  }
  .main_info a3 {
    font-size: 24px;
  }
  .rating_info {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .rating_text {
    display: flex;
    width: 150px;
    justify-content: space-between;
  }

  .list_button {
    height: 25px;
    width: 170px;
    border-radius: 25px;
    background-color: #1a1a1a;
  }
  .list_button span {
    font-family: Kreadon;
    color: #fff;
  }
  .book_img {
    height: 310px;
    padding: 20px;
    border-radius: 30px;
    object-fit: cover;
  }

  .dropdown-wrapper {
  position: relative;
  display: inline-block;
}
.dropdown-menu {
  position: absolute;
  left: 0;
  margin-top: 2px;
  min-width: 170px;
  z-index: 100;
  list-style: none;
  padding: 0;
}
.dropdown-item {
  padding: 2px;
  cursor: pointer;
  font-size: 14px;
  text-align: center;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  border-right: 1px solid #C8C8C8;
  border-bottom: 1px solid #C8C8C8;
  border-left: 1px solid #C8C8C8;
}
.dropdown-item:hover {
  background: #f0f0f0;
}
.dropdown-item.delete {
  color: #E63946;
}

.arrow {
  display: inline-block;
  margin-left: 8px;
  font-size: 10px;
  color: #fff;
}

.add-list {
  font-size: 14px;
}

.status-buttons {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}
.status-buttons button {
  padding: 2px 12px 0px 12px;
  border: 1px solid #dcdcdc;
  background: #fff;
  cursor: pointer;
  border-radius: 15px;
  width: 130px;
  height: 30px;
  font-family: Kreadon;
  font-size: 14px;
  text-align: center;
  box-sizing: border-box;
}

.status-buttons button:hover {
  border: 1px solid #c8c8c8;
  background-color: #dcdcdc;
}
.status-buttons button.active {
  background: #3A86FF;
  color: #fff;
  border-color: #dcdcdc;
}

.status-buttons button.active:hover {
  background: #E63946;
}

.stars {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
}

.reviews_container {
  display: flex;
  max-width: 1400px;
  width: 100%;
  flex-direction: row;
  gap: 40px;
  margin-top: 20px;
}

.reviews_content {
  display: flex;
  flex-direction: column;
  height: 100%; /* Занимаем всю высоту */
}
.all_reviews {
  display: flex;
  position: relative;
  flex-direction: column;
  overflow-y: auto;
  height: 550px;
  max-width: 800px;
  width: 100%;
  background-color: #fff;
  border-radius: 20px;
}
.all_reviews span {
  display: block;
  font-size: 32px;
    margin: 20px;
}
.reviews-list {
  flex: 1; /* Занимает все доступное пространство */
  overflow-y: auto; /* Прокрутка при большом количестве отзывов */
  margin-bottom: 120px; /* Место для фиксированного блока */
}

.new_review {
  position: sticky; /* Фиксируем внизу */
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: white;
  padding: 15px;
  border-top: 1px solid #eee;
  z-index: 100; /* Поверх других элементов */
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1); /* Визуальное отделение */
}
.new_review textarea {
  border-radius: 10px;
  font-size: 16px;
  padding-left: 10px;
  padding-top: 5px;
  height: 100px;
  margin-bottom: 10px;
  resize: none;
  font-family: Kreadon;
}
.new_review h4 {
  font-size: 20px;
  margin-block-start: 0px;
  margin-block-end: 15px;
}
.new_review button {
  border-radius: 15px;
  height: 30px;
  font-family: Kreadon;
  font-size: 14px;
  background: #fff;
  border: 1px solid #dcdcdc;
}
.new_review button:enabled:hover {
  border: 1px solid #c8c8c8;
  background-color: #dcdcdc;
}


.reviews-scrollable {
  flex: 1; /* Занимает все доступное пространство */
  overflow-y: auto; /* Включаем скролл только здесь */
  margin-bottom: 10px; /* Отступ от формы */
}
.reviews-scrollable p {
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: italic;
}

.write_review {
  display: flex;
  height: 550px;
  max-width: 550px;
  width: 100%;
  background-color: #fff;
  border-radius: 20px;
}
.write_review span {
  display: block;
  font-size: 32px;
  margin: 20px;
}


@media (max-width: 1400px) {
  .first_container {
    flex-wrap: wrap; /* Разрешаем перенос элементов */
  }
  
  .second_container {
    max-width: 100%; /* Занимает всю ширину */
    height: auto; /* Автоматическая высота */
    margin-top: 20px; /* Отступ сверху */
  }
}

@media (max-width: 1200px) {
  .reviews_container {
    flex-direction: column; /* Колонка вместо ряда */
    align-items: center; /* Центрирование */
    gap: 0px;
  }
  
  .all_reviews,
  .write_review {
    max-width: 100%; /* На всю ширину */
  }
  
  .write_review {
    margin-top: 20px; /* Отступ сверху */
    height: 300px; /* Уменьшаем высоту */
  }
}

@media (max-width: 992px) {
  .first_container {
    align-items: center; /* Центрирование */
    justify-content: center;
  }
  
  .book_img {
    max-width: 250px; /* Уменьшаем изображение */
    height: auto; /* Сохраняем пропорции */
  }
  
  .main_info {
    padding: 15px 10px; /* Уменьшаем отступы */
  }
  
  .main_info a1 {
    font-size: 36px; /* Уменьшаем шрифт */
  }
  
  .main_info a2 {
    font-size: 24px; /* Уменьшаем шрифт */
  }
  
  .status-buttons button {
    width: 130px; /* Уменьшаем кнопки */
  }
  
  .second_container a2 {
    font-size: 28px; /* Уменьшаем шрифт */
  }
  
  .description {
    font-size: 18px; /* Уменьшаем шрифт */
  }
}

@media (max-width: 768px) {
  .main_info {
  }

  .container {
    padding: 20px; /* Уменьшаем отступы */
  }
  
  .main_info a1 {
    font-size: 28px; /* Уменьшаем шрифт */
  }
  
  .rating_text a3 {
    font-size: 20px; /* Уменьшаем шрифт */
  }
  
  .status-buttons {
    flex-direction: column; /* Кнопки в колонку */
  }
  
  .status-buttons button {
    width: 100%; /* На всю ширину */
  }
  
  .all_reviews span,
  .write_review span {
    font-size: 24px; /* Уменьшаем шрифт */
  }
  
  .new_review h4 {
    font-size: 18px; /* Уменьшаем шрифт */
  }
  
  .breadcrumbs {
    font-size: 12px; /* Уменьшаем шрифт */
  }
}

@media (max-width: 480px) {
  .book_img {
    max-width: 200px; /* Уменьшаем изображение */
  }
  
  .main_info a1 {
    font-size: 24px; /* Уменьшаем шрифт */
    text-align: center; /* Центрируем текст */
  }
  
  .main_info a2 {
    font-size: 18px; /* Уменьшаем шрифт */
    text-align: center; /* Центрируем текст */
  }
  
  .second_container a2 {
    font-size: 22px; /* Уменьшаем шрифт */
  }
  
  .description {
    font-size: 16px; /* Уменьшаем шрифт */
  }
  
  .all_reviews {
    height: 500px; /* Уменьшаем высоту */
  }
  
  .write_review {
    height: 250px; /* Уменьшаем высоту */
  }
}
</style>