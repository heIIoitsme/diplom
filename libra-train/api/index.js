import express from 'express';
import dotenv from 'dotenv';
import { dbService } from '../src/database/database.service.js';
dotenv.config();

const app = express()
const port = 3000



app.use('/', express.static('public'))

dbService.connect()
  .then(() => console.log('✅ MongoDB подключен'))
  .catch(err => {
    console.error('❌ Не удалось подключиться к MongoDB:', err);
    process.exit(1);
  });

app.get('/books', async (req, res) => {
  const books = await dbService.find('book', {}, {
    sort: { createdAt: -1 },
    limit: 10,
    populate: [{ from: 'author', localField: 'author', foreignField: '_id', as: 'author' }]
  });
  res.status(200).json(books);
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
  });

