
export function getLastReadBook(userBooks, books) {
  // Фильтруем только «прочитанные»
  const sorted = [...userBooks]
    .filter((b) => b.status === 'прочитано' || b.status === 'Прочитано')
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.addedAt) - new Date(a.updatedAt || a.addedAt)
    );

  const last = sorted[0];
  if (!last) return null;

  // Ищем саму книгу по bookId (или через вложенный last.book[0])
  const book =
    books.find((b) => b._id === last.bookId) || (last.book && last.book[0]);
  if (!book) return null;

  return {
    ...book,
    userRating: last.rating ?? null, // возвращаем объект книги + рейтинг из userBooks
  };
}

// === Добавляем эту функцию ===
export async function fetchLastReadBookForUser(userId) {
  // 1) Загружаем записи user-books для данного userId
  const userBooksRes = await fetch(
    `${import.meta.env.VITE_API_URL}/api/user-books/user/${userId}`
  );
  if (!userBooksRes.ok) {
    console.warn('Не удалось получить userBooks для пользователя', userId);
    return null;
  }
  const userBooks = await userBooksRes.json();

  // 2) Загружаем все книги
  const booksRes = await fetch(`${import.meta.env.VITE_API_URL}/api/books`);
  if (!booksRes.ok) {
    console.warn('Не удалось получить список всех книг');
    return null;
  }
  const books = await booksRes.json();

  // 3) Вызываем существующий getLastReadBook
  return getLastReadBook(userBooks, books);
}