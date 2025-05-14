<template>
    <div class="list-block">
      <h2 class="list-title">{{ title }}</h2>
      <table class="list-table">
        <div class="bg-head">
          <thead>
            <tr>
              <th>#</th>
              <th>Название</th>
              <th>Оценка</th>
              <th>Жанр</th>
              <th>Дата публикации</th>
            </tr>
          </thead>
        </div>
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
    max-width: 1010px;
    height: 40px;
    font-size: 22px;
    margin: unset;
    background: #fff;
    border-radius: 10px;
  }
  
  .list-table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
  }
  
  .list-table thead {
    width: 100%;
    background-color: #000;
    color: #fff;
  }
  .bg-head {
    background-color: #000;
    border-radius: 0 0 10px 10px ;
  }

  .list-table th:first-child {
    border-bottom-left-radius: 10px;
  }
  .list-table th:last-child {
    border-bottom-right-radius: 10px;
  }
  
  .list-table th,
  .list-table td {
    padding: 10px 16px;
    text-align: left;
  }
  
  .list-table tbody tr:hover {
    background-color: #fff;
  }
</style>