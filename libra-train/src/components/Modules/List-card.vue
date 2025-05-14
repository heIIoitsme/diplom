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
            <td>{{ entry.book[0].title }}</td>
            <td>{{ entry.rating || '-' }}</td>
            <td>{{ entry.book[0].genre?.[0] || '—' }}</td>
            <td>{{ entry.book[0].publishedYear }} г.</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
  
<script setup>

import { ref, computed } from 'vue';

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
</script>
  
<style scoped>
  .list-block {
    font-family: 'Kreadon';
  }

  .bg-title {
    background-color: #000;
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
    background-color: #000;
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
    outline: 2px solid #000;
    outline-offset: -1px;
  }

  .list-table th.active-sort {
  text-decoration: underline #fff !important;
}
</style>