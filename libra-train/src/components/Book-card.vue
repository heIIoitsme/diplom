<template>
  <div class="card_container">
    <img class="image" src="@/assets/image container.svg" alt="missed image" />
    <div class="text_container">
      <div class="cardheader">
        <nameText class="bookname">Vita Nostra: Работа над ошибками</nameText>
        <authorText class="authorname">Харуки Мураками</authorText>
      </div>
      <div class="cardfooter">
        <stateText class="statename">Не прочитано</stateText>
        <ratingText class="ratingname">4,6</ratingText>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Bookcard',
};
</script>

<style scoped>
.cardheader {
  display: flex;
  flex-direction: column;
}
.card_container {
  width: 130px;
  height: 260px;
  border-radius: 10px;
  outline:1px solid #C8C8C8;
  outline-offset: -1px ;
  display: flex;
  z-index: 1;
  flex-direction: column;
}
.text_container {
  width: 130px;
  height: 285px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 5px;
  margin-bottom: 5px;
}
.image {
  width: 130px;
  height: 175px;
  border-radius: 10px;
  z-index: 2;
}
.bookname {
  font-family: 'Kreadon';
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  margin: 0px 5px;
}
.authorname {
  font-family: 'Kreadon';
  font-size: 14px;
  color: #252525;
  margin: 0px 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.statename {
  font-family: 'Kreadon';
  font-size: 11px;
  display: flex;
  align-items: center;
  text-decoration: underline;
}
.ratingname {
  font-family: 'Kreadon';
  font-size: 20px;
}
.cardfooter {
  display: flex;
  gap: 0px;
  flex-direction: row;
  margin: 0px 8px;
  justify-content: space-between;
}
</style>