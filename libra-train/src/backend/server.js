import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { dbService } from '../database/database.service.js';
import { recalcBookRating } from '../database/rating.service.js';
import { authenticateToken } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const port = 3000;

// --- Middleware
app.use(cors());
app.use(express.json());

// --- Подключение к MongoDB
dbService.connect()
  .then(() => console.log('✅ MongoDB подключен'))
  .catch(err => {
    console.error('❌ Не удалось подключиться к MongoDB:', err);
    process.exit(1);
  });

// --- Регистрация пользователя
app.post('/api/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }
    const userCollection = await dbService.getCollection('user');
    const existingUser = await userCollection.findOne({
      $or: [{ email }, { username }]
    });
    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(409).json({ error: `${field} уже используется` });
    }
    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = {
      email,
      username,
      passwordHash,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await userCollection.insertOne(newUser);
    res.status(201).json({ success: true, userId: result.insertedId });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// --- Логин и выдача JWT
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }
    const userCollection = await dbService.getCollection('user');
    const user = await userCollection.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'Неверный логин или пароль' });
    }
    const bcrypt = await import('bcryptjs');
    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }
    console.log('Перед выдачей токена:', { secret: process.env.JWT_SECRET, userId: user._id });
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    return res.status(200).json({
      success: true,
      message: 'Успешная авторизация',
      token,
      userId: user._id,
      role: user.role
    });
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// --- Публичные маршруты
app.get('/api/books', async (req, res) => {
  const books = await dbService.find('book', {}, {
    sort: { createdAt: -1 },
    limit: 100,
    populate: [{ from: 'author', localField: 'author', foreignField: '_id', as: 'author' }]
  });
  res.status(200).json(books);
});

app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await dbService.findOne('book', req.params.id, {
      populate: [
        { 
          from: 'author', 
          localField: 'author', 
          foreignField: '_id', 
          as: 'author' 
        }
      ]
    }) // id как строка — всё работает
    if (!book) return res.status(404).json({ error: 'Книга не найдена' })
    res.json(book)
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
});

app.get('/api/user-books/user/:userId', async (req, res) => {
  try {
    const userId = new ObjectId(req.params.userId);
    const collection = await dbService.getCollection('user-books');
    console.log('userId:', userId);

    const entries = await collection.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: 'book',
          localField: 'bookId',
          foreignField: '_id',
          as: 'book'
        },
      }
    ]).toArray();

    res.status(200).json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось получить списки пользователя' });
  }
});


app.get('/api/authors', async (req, res) => {
  const authors = await dbService.find('author');
  res.status(200).json(authors);
});

app.get('/api/genres', async (req, res) => {
  const genres = await dbService.find('genres');
  res.status(200).json(genres);
});

app.get('/api/news', async (req, res) => {
  const news = await dbService.find('news');
  res.status(200).json(news);
});

app.get('/api/users', async (req, res) => {
  const users = await dbService.find({}, 'username'); // только логины
  res.status(200).json(users);
});

// --- Защищённые маршруты
app.get('/api/secret', authenticateToken, (req, res) => {
  res.json({ message: `Привет, пользователь ${req.user.userId}` });
});

app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const col = await dbService.getCollection('user');
    const user = await col.findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { passwordHash: 0 } }
    );
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (err) {
    console.error('Ошибка профиля:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});


app.get('/api/users/:username', async (req, res) => {
  try {
    const col  = await dbService.getCollection('user');
    // Ищем пользователя без passwordHash
    const user = await col.findOne(
      { username: req.params.username },
      { projection: { passwordHash: 0 } }
    );
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    // Возвращаем все поля кроме passwordHash
    res.status(200).json(user);
  } catch (err) {
    console.error('Ошибка при получении пользователя:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/user-books', authenticateToken, async (req, res) => {
  try {
    const col = await dbService.getCollection('user-books')
    await col.updateOne(
      { userId: new ObjectId(req.user.userId), bookId: new ObjectId(req.body.bookId) },
      { $set:{ status:req.body.status, addedAt:new Date(req.body.addedAt), rating:req.body.rating } },
      { upsert:true }
    )
    res.status(200).json();
    await recalcBookRating(req.body.bookId);
    console.log('→ POST /api/user-books: recalcBookRating completed for', req.body.bookId);
  }
  catch (err) {
    console.error('Ошибка при получении пользователя:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/user-books/book/:bookId', authenticateToken, async (req, res) => {
  const col = await dbService.getCollection('user-books')
  const entry = await col.findOne({
    userId: new ObjectId(req.user.userId),
    bookId: new ObjectId(req.params.bookId)
  })
  console.log('GET /api/user-books entry:', entry)
  res.json(entry)
})

app.delete('/api/user-books/:bookId', authenticateToken, async (req, res) => {
  const col = await dbService.getCollection('user-books')
  await col.deleteOne({
    userId: new ObjectId(req.user.userId),
    bookId: new ObjectId(req.params.bookId)
  })
  res.json({ success:true })
})

app.get('/api/user-books/all', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    const col = await dbService.getCollection('user-books');
    const all = await col.find().toArray();
    res.json(all);
  } catch (err) {
    console.error('Ошибка при получении всех user-books:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/reviews/:bookId', async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.bookId);
    const reviewCol = await dbService.getCollection('reviews');

    const reviews = await reviewCol.aggregate([
      { $match: { bookId } },
      {
        $lookup: {
          from: 'user',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'user-books',
          let: { userId: '$userId', bookId: '$bookId' },
          pipeline: [
            { 
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', '$$userId'] },
                    { $eq: ['$bookId', '$$bookId'] }
                  ]
                }
              }
            },
            {
              $project: { rating: 1 }
            }
          ],
          as: 'userBook'
        }
      },
      { 
        $addFields: {
          rating: { $arrayElemAt: ['$userBook.rating', 0] }
        }
      },
      {
        $project: {
          _id: 1,
          text: 1,
          addedAt: 1,
          username: '$user.username',
          rating: 1
        }
      },
      { $sort: { addedAt: -1 } }
    ]).toArray();

    res.status(200).json(reviews);
  } catch (err) {
    console.error('Ошибка при получении отзывов:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/reviews', authenticateToken, async (req, res) => {
  try {
    const { bookId, text } = req.body;

    // Базовая валидация
    if (!ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: 'Некорректный ID книги' });
    }
    if (!text || text.trim().length < 3) {
      return res.status(400).json({ error: 'Текст отзыва слишком короткий' });
    }

    const reviewCol = await dbService.getCollection('reviews');

    // Проверка на дубликаты
    const existingReview = await reviewCol.findOne({
      bookId: new ObjectId(bookId),
      userId: new ObjectId(req.user.userId)
    });

    if (existingReview) {
      return res.status(409).json({ 
        error: 'Вы уже оставляли отзыв на эту книгу' 
      });
    }

    // Создаём отзыв
    const newReview = {
      bookId: new ObjectId(bookId),
      userId: new ObjectId(req.user.userId),
      text: text.trim(),
      addedAt: new Date()
    };

    // Сохраняем
    const result = await reviewCol.insertOne(newReview);
    
    res.status(201).json({
      _id: result.insertedId,
      ...newReview
    });

  } catch (err) {
    console.error('Ошибка при добавлении отзыва:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// --- Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});