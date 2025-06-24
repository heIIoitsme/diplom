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
        <div class="bookname">{{ book.title }}</div>
        <div class="authorname">{{ book.author[0].fullName }}</div>
      </div>
      <div class="cardfooter">
        <div class="statename">{{ book.status }}</div>
        <div class="ratingname">{{ formattedRating }}</div>
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
      return this.book.rating?.toFixed(1).replace('.', ',') || '—'
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
  height: 280px;
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
  border-radius: 10px;
  display: flex;
  flex-grow: 1;
  flex-wrap:nowrap;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 5px;
  margin-bottom: 5px;
}
.image {
  width: 130px;
  height: 185px;
  border-radius: 10px;
  z-index: 2;
  object-fit: cover;
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
  color: #555555;
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
  color:#E63946
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