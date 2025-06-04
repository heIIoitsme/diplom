import { ObjectId } from 'mongodb';
import { dbService } from './database.service.js';

export async function recalcBookRating(bookId) {
  const bookObjectId    = new ObjectId(bookId);
  const userBooksCol    = await dbService.getCollection('user-books');
  const booksCol        = await dbService.getCollection('book');

  // 1) Считаем средний рейтинг только по документам user-books текущей книги
  const [{ avgRating } = { avgRating: null }] = await userBooksCol.aggregate([
    { $match: { bookId: bookObjectId, rating: { $ne: null } } },
    { $group: { _id: null, avgRating: { $avg: '$rating' } } }
  ]).toArray();

  // 2) Округляем до десятых (или сбрасываем в null, если оценок нет)
  const newRating = avgRating !== null
    ? parseFloat(avgRating.toFixed(2))
    : null;

  // 3) Обновляем одну книгу в коллекции book
  const result = await booksCol.updateOne(
    { _id: bookObjectId },
    { $set: { rating: newRating, updatedAt: new Date() } }
  );
  console.log(`→ recalcBookRating: matched=${result.matchedCount}, modified=${result.modifiedCount}, newRating=${newRating}`);
  return newRating;
}