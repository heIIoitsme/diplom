<template>
    <div class="container">
      <img class="image" src="" alt="missed image" />
      <bookname class="bookname">Название 1</bookname>
    </div>
</template>

<script>
export default {
  name: 'Book-card',
};
</script>

<style scoped>
.container {
  width: 130px;
  height: 260px;
  border-radius: 10px;
  stroke: 1px #c8c8c8;
  display: flex;
  flex-direction: column;
}
.image {
  width: 130px;
  height: 175px;
  border-radius: 10px;
}
.bookname {
  font-family: Arial, sans-serif;
}
</style>