export function getLastReadBook(userBooks, books) {
  // Фильтруем только прочитанные
  const sorted = [...userBooks]
    .filter(b => b.status === 'прочитано' || b.status === 'Прочитано')
    .sort((a, b) => new Date(b.updatedAt || b.addedAt) - new Date(a.updatedAt || a.addedAt))

  const last = sorted[0]
  if (!last) return null

  // Ищем саму книгу
  const book = books.find(b => b._id === last.bookId) || (last.book && last.book[0])
  if (!book) return null

  // Возвращаем и книгу, и пользовательский рейтинг
  return {
    ...book,
    userRating: last.rating ?? null  // 👈 это и есть нужное поле
  }
}