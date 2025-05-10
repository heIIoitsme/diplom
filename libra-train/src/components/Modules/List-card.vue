<template>
    <div class="list-block">
      <h2 class="list-title">{{ title }}</h2>
      <table class="list-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Название</th>
            <th>Оценка</th>
            <th>Жанр</th>
            <th>Дата публикации</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in entries" :key="entry._id">
            <td>{{ index + 1 }}</td>
            <td>{{ entry.book.title }}</td>
            <td>{{ entry.rating || '-' }}</td>
            <td>{{ entry.book.genre?.[0] || '—' }}</td>
            <td>{{ entry.book.publishedYear }} г.</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
  
<script setup>
  defineProps({
    title: String,
    entries: Array
})

  defineOptions({
  name: 'ListCard'
})
</script>
  
<style scoped>
  .list-block {
    margin-bottom: 40px;
    font-family: 'Kreadon';
  }
  
  .list-title {
    font-size: 22px;
    margin-bottom: 10px;
  }
  
  .list-table {
    width: 100%;
    border-collapse: collapse;
    background: #f9f9f9;
  }
  
  .list-table thead {
    background-color: #000;
    color: #fff;
  }
  
  .list-table th,
  .list-table td {
    padding: 10px 16px;
    text-align: left;
    border: 1px solid #ddd;
  }
  
  .list-table tbody tr:hover {
    background-color: #f0f0f0;
  }
</style>