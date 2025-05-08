<template>
    <div class='container'>
        <div class='first_container'>
            <img
            class='book_img'
            src="@\assets\covers\norvezhskiy-les.jpeg"
            />
            <div class='main_info'>
                <a1>Name</a1>
                <a2>Author</a2>
                <div class='rating_info'>
                    <div>
                        <a3>Рейтинг 4.73</a3>
                        <div>Звездочки</div>
                    </div>
                    <button class='list_button'>
                        <a>+ Добавить в список</a>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'FullBook',
  props: {
    username: {
      type: String,
      required: true
    }
  },
}
</script>

<style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px
  }
  .first_container{
    display: flex;
    flex-direction: row;
    height: 260px;
    width: 1400px;
    border-radius: 20px;
    background-color: #fff;
  }
  .main_info {
    display: flex;
    flex-direction: column;
    padding: 20px;
  }
  .main_info a1 {
    font-size: 48px;
  }
  .main_info a2 {
    font-size: 32px;
  }
  .main_info a3 {
    font-size: 24px;
  }
  .rating_info {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
  .list_button {
    height: 25px;
    width: 150px;
    border-radius: 25px;
    background-color: black;
  }
  .list_button a {
    font-family: Kreadon;
    font-size: 14px;
    color: #fff;
  }
  .book_img {
    height: 220px;
    width: 135px;
    padding: 20px;
    border-radius: 30px;
  }
</style>