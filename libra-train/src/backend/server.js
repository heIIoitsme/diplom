import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbService } from '../database/database.service.js';

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Проверка подключения к MongoDB
dbService.connect()
  .then(() => {
    console.log('MongoDB подключен');
  })
  .catch(err => {
    console.error('Не удалось подключиться к MongoDB:', err);
    process.exit(1); // Остановить сервер, если не удалось подключиться
  });

// Регистрация пользователя
app.post('/api/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Валидация данных
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    // Проверка уникальности
    const userCollection = await dbService.getCollection('user');
    
    const existingUser = await userCollection.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(409).json({ 
        error: `${field} уже используется` 
      });
    }

    // Хэширование пароля
    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Создание пользователя
    const newUser = {
      email,
      username,
      passwordHash,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await userCollection.insertOne(newUser);
    
    res.status(201).json({
      success: true,
      userId: result.insertedId
    });

  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/login', async (req, res) => {
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
  
      // Можно сгенерировать токен здесь (например, с JWT)
      return res.status(200).json({ 
        success: true,
        message: 'Успешная авторизация',
        userId: user._id,
        role: user.role
      });
  
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.get('/api/books', async (req, res) => {
    const books = await dbService.find('book', {}, {
        sort: { createdAt: -1 },
        limit: 10,
        populate: [
          {
            from: 'author',         // Название коллекции авторов
            localField: 'author', // Поле в документе book
            foreignField: '_id',    // Поле в коллекции author
            as: 'author'            // Результат будет в поле "author"
          }
        ]
      });
    res.status(200).json(books);
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

app.listen(port, () => {
  console.log(`Сервер запущен на порту http://localhost:${port}`);
});