<template>
  <router-link :to="`/book/${book._id}`" class="router-link-custom"><div class="card_container">
    <img 
      class="image" 
      :src="require(`@/assets/covers/${book.cover}`)"
      loading="lazy" 
      :alt="book.title"
    />
    <div class="text_container">
      <div class="cardheader">
        <nameText class="bookname">{{ book.title }}</nameText>
        <authorText class="authorname">{{ book.author[0].fullName }}</authorText>
      </div>
      <div class="cardfooter">
        <stateText class="statename">{{ book.status }}</stateText>
        <ratingText class="ratingname">{{ formattedRating }}</ratingText>
      </div>
    </div>
  </div></router-link>
</template>

<script>
export default {
  name: 'BookCard',
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedRating() {
      return this.book.rating?.toFixed(1).replace('.', ',') || '0,0'
    }
  }
}
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
  transition: transform 0.3s ease;
}
.card_container:hover {
  transform: translateY(-3px);
}
.text_container {
  width: 130px;
  height: 260px;
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
  margin: 0px 8px;
}
.authorname {
  font-family: 'Kreadon';
  font-size: 14px;
  color: #252525;
  margin: 0px 8px;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 4;
	-webkit-box-orient: vertical;
}
.statename {
  font-family: 'Kreadon';
  font-size: 12px;
  display: flex;
  align-items: center;
  text-decoration: underline;
  cursor: default;
}
.statename:hover {
  color:red
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
.router-link-custom{
    text-decoration: none;
    display: inline-block;
    color: inherit;
  }
</style>