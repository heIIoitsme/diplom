import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { dbService } from '../src/database/database.service.js';
import { authenticateToken } from '../src/backend/middleware/authMiddleware.js';

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

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// --- Регистрация пользователя
app.post('/register', async (req, res) => {
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
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }
    const userCollection = await dbService.getCollection('user');
    const user = await userCollection.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    const bcrypt = await import('bcryptjs');
    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Неверный пароль' });
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
app.get('/books', async (req, res) => {
  const books = await dbService.find('book', {}, {
    sort: { createdAt: -1 },
    limit: 10,
    populate: [{ from: 'author', localField: 'author', foreignField: '_id', as: 'author' }]
  });
  res.status(200).json(books);
});

app.get('/books/:id', async (req, res) => {
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

app.get('/user-books/:userId', async (req, res) => {
  try {
    const userIdStr = req.params.userId
    const userId = new ObjectId(userIdStr);

    const entries = await dbService.find('user_books', { userId }, {
      populate: [
        {
          from: 'book',
          localField: 'bookId',
          foreignField: '_id',
          as: 'book'
        }
      ]
    })

    res.status(200).json(entries)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Не удалось получить списки пользователя' })
  }
})


app.get('/authors', async (req, res) => {
  const authors = await dbService.find('author');
  res.status(200).json(authors);
});

app.get('/genres', async (req, res) => {
  const genres = await dbService.find('genres');
  res.status(200).json(genres);
});

app.get('/news', async (req, res) => {
  const news = await dbService.find('news');
  res.status(200).json(news);
});

app.get('/users', async (req, res) => {
  const users = await dbService.find({}, 'username'); // только логины
  res.status(200).json(users);
});

// --- Защищённые маршруты
app.get('/secret', authenticateToken, (req, res) => {
  const userId = (req as any).user.userId;
  res.json({ message: `Привет, пользователь ${userId}` });
});

app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const col = await dbService.getCollection('user');
    const userId = (req as any).user.userId;
    const user = await col.findOne(
      { _id: new ObjectId(userId) },
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

app.get('/users/:username', async (req, res) => {
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

// --- Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});

module.exports = app;