<template>
    <div class="list-block">
      <div class="bg-title">
        <h2 class="list-title">{{ title }}</h2>
      </div>
      <table class="list-table">
          <thead>
            <tr>
          <th>#</th>
          <th @click="handleSort('title')" :class=" { 'active-sort': sortBy === 'title' }">
            Название
            <span v-if="sortBy === 'title'"></span>
          </th>
          <th @click="handleSort('rating')" :class=" { 'active-sort': sortBy === 'rating' }">
            Оценка
            <span v-if="sortBy === 'rating'"></span>
          </th>
          <th @click="handleSort('genre')" :class=" { 'active-sort': sortBy === 'genre' }">
            Жанр
            <span v-if="sortBy === 'genre'"></span>
          </th>
          <th @click="handleSort('publishedYear')" :class="{ 'active-sort': sortBy === 'publishedYear' }">
            Дата публикации
            <span v-if="sortBy === 'publishedYear'"></span>
          </th>
            </tr>
          </thead>
        <tbody>
          <tr v-for="(entry, index) in sortedEntries" :key="entry._id">
            <td>{{ index + 1 }}</td>
            <td><router-link :to="`/book/${entry.book[0]._id}`" class="router-link-custom">{{ entry.book[0].title }}</router-link></td>
            <td class="rating-cell">
              <div v-if="isPrivateListsPage && editingId === entry._id" class="rating-select">
                <select v-model="editedRating" @change="saveRating(entry)">
                  <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
              <div
                v-else-if="isPrivateListsPage"
                @click="startEditing(entry)"
                class="rating-display"
              >
                {{ entry.rating || '—' }}
              </div>
              <div v-else class="rating-display-disabled">
                {{ entry.rating || '—' }}
              </div>
            </td>
            <td>{{ entry.book[0].genre?.[0] || '—' }}</td>
            <td>{{ entry.book[0].publishedYear }} г.</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
  
<script setup>

import { ref, computed } from 'vue';
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const editingId    = ref(null)
const editedRating = ref(null)

const isPrivateListsPage = computed(() => route.path === '/profile/lists')

const props = defineProps({
    title: String,
    entries: Array
})

  defineOptions({
  name: 'ListCard'
})

const sortBy = ref(null);
const sortDirection = ref('asc');

const handleSort = (field) => {
  if (sortBy.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortDirection.value = ['rating', 'publishedYear'].includes(field) 
      ? 'desc' 
      : 'asc';
  }
};

const sortedEntries = computed(() => {
  if (!sortBy.value) return props.entries;
  
  return [...props.entries].sort((a, b) => {
    const getValue = (item, field) => {
      switch (field) {
        case 'title':
          return item.book[0]?.title?.toLowerCase() || '';
        case 'rating':
          return item.rating === '-' ? -Infinity : Number(item.rating);
        case 'genre':
          return item.book[0]?.genre?.[0]?.toLowerCase() || '';
        case 'publishedYear':
          return item.book[0]?.publishedYear || 0;
        default:
          return '';
      }
    };

    const valueA = getValue(a, sortBy.value);
    const valueB = getValue(b, sortBy.value);
    
    let comparison = 0;
    if (valueA > valueB) comparison = 1;
    else if (valueA < valueB) comparison = -1;
    
    return sortDirection.value === 'asc' ? comparison : -comparison;
  });
});

function startEditing(entry) {
  if (!isPrivateListsPage.value) return
  editingId.value = entry._id
  editedRating.value = entry.rating
}

async function saveRating(entry) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Пожалуйста, войдите в систему');
    return;
  }

  const bookId = entry.bookId; // ❗️строго аналогично route.params.id из selectStatus

  try {
    await axios.post(
      `${process.env.VUE_APP_API_URL}/api/user-books`,
      {
        bookId,
        status: entry.status,
        rating: Number(editedRating.value),
        addedAt: entry.addedAt || new Date()
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    entry.rating = Number(editedRating.value);
    editingId.value = null;
  } catch (e) {
    console.error('Ошибка обновления оценки:', e.response?.data || e.message);
  }
}
</script>
  
<style scoped>
  .list-block {
    font-family: 'Kreadon';
  }

  .bg-title {
    background-color: #1a1a1a;
    border-radius: 20px 20px 0 0 ;
  }
  
  .list-title {
    max-width: 1010px;
    height: 40px;
    font-size: 24px;
    margin: unset;
    background: #fff;
    border-radius: 10px;
    font-weight: normal;

    display: flex;
    align-items: center;        /* ← по вертикали */
    justify-content: flex-start;/* ← по горизонтали */
    padding-left: 16px;
  }
  
  .list-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }
  
  .list-table thead {
    width: 100%;
    background-color: #1a1a1a;
    color: #fff;
  }

  .list-table th:first-child {
    border-bottom-left-radius: 10px;
  }
  .list-table th:nth-child(2), .list-table td:nth-child(2) {
    text-align: left;
  }
  .list-table th:last-child {
    border-bottom-right-radius: 10px;
  }

.list-table th:nth-child(1),
.list-table td:nth-child(1) {
  width: 5%;
}

.list-table th:nth-child(3),
.list-table td:nth-child(3) {
  width: 7%;
}

.list-table th:nth-child(4),
.list-table td:nth-child(4) {
  width: 25%;
}

.list-table th:nth-child(5),
.list-table td:nth-child(5) {
  width: 15%;
}
  
  .list-table th,
  .list-table td {
    font-size: 14px;
    height: 25px;
    cursor: pointer;
    user-select: none;
    text-align: center;
    font-weight: normal;
  }

  .list-table th:hover {
  text-decoration: underline #fff;
}
  .list-table tbody tr:hover {
    border-radius: 5px;
    outline: 2px solid #1a1a1a;
    outline-offset: -1px;
  }

  .list-table th.active-sort {
  text-decoration: underline #fff !important;
}

.router-link-custom{
  text-decoration: none;
  display: inline-block;
  color: inherit;
}
.router-link-custom:hover{
  text-decoration: underline;
}
</style>