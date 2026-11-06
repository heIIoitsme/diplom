<div align="center">
  <img src="./libra-train/src/assets/LibraTrain.png" alt="LibraTrain" width="220" />

  <h1>LibraTrain</h1>

  <p>Full-stack веб-платформа для читателей: каталог книг, личные списки чтения, оценки, отзывы и новости.</p>

  <p>
    <img alt="Vue" src="https://img.shields.io/badge/Vue.js-3.2-42b883?logo=vuedotjs&logoColor=white" />
    <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-ES2020+-F7DF1E?logo=javascript&logoColor=black" />
    <img alt="Node" src="https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white" />
    <img alt="Express" src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" />
    <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" />
    <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" />
    <img alt="JWT" src="https://img.shields.io/badge/Auth-JWT-fb015b?logo=jsonwebtokens&logoColor=white" />
  </p>
</div>

---

## Содержание

- [О проекте](#о-проекте)
- [Возможности](#возможности)
- [Технологический стек](#технологический-стек)
- [Архитектура](#архитектура)
- [Модель данных](#модель-данных)
- [Аутентификация и безопасность](#аутентификация-и-безопасность)
- [Структура проекта](#структура-проекта)
- [Быстрый старт](#быстрый-старт)
- [Переменные окружения](#переменные-окружения)
- [Скрипты npm](#скрипты-npm)
- [Справочник API](#справочник-api)
- [Деплой](#деплой)

> Исходный код приложения находится в папке [`libra-train/`](./libra-train/).

## О проекте

LibraTrain — учебное full-stack приложение для любителей чтения. Пользователь ищет книги в каталоге, ведёт собственные списки («читаю», «прочитано» и т. п.), выставляет оценки и оставляет отзывы, а также читает новости. Рейтинг книги пересчитывается автоматически на основе пользовательских оценок. Данные о книгах, авторах, жанрах, пользователях, списках и отзывах хранятся в MongoDB, доступ к приватным разделам защищён JWT-авторизацией.

Проект построен как единый репозиторий, где и клиент (SPA на Vue), и сервер (REST API на Express) живут в одной кодовой базе и деплоятся вместе.

## Возможности

- 📚 **Каталог книг** — список книг с авторами, жанрами и обложками, детальная страница книги
- 🔎 **Поиск** по каталогу
- 🗂️ **Категории** и тематические подборки
- ⭐ **Личные списки чтения** — статусы и оценки, привязанные к пользователю
- 💬 **Отзывы** на книги с автоматическим пересчётом среднего рейтинга
- 👤 **Аккаунты** — регистрация, вход и личный профиль на JWT
- 🌐 **Публичные профили** других пользователей и их списки
- 📰 **Новости** — лента и отдельные страницы новостей
- 🗺️ **SEO** — автогенерация `sitemap.xml` при сборке

## Технологический стек

### Язык
Весь проект написан на **JavaScript** (ES2020+, ES-модули). Разметка компонентов — на однофайловых компонентах Vue (`.vue`: `<template>` / `<script>` / `<style>`), стили — на **Tailwind CSS 4**.

### Frontend
| Технология | Версия | Назначение |
| --- | --- | --- |
| Vue.js | ^3.2 | UI-фреймворк (SPA) |
| Vue Router | ^4.5 | Клиентская маршрутизация, guard'ы доступа |
| Tailwind CSS | ^4.0 | Utility-first стилизация |
| Axios | ^1.9 | HTTP-клиент с интерсепторами |
| Vuelidate | ^2.0 | Валидация форм |
| @kyvg/vue3-notification | ^3.4 | Всплывающие уведомления |
| jwt-decode | ^4.0 | Декодирование JWT на клиенте |

### Backend
| Технология | Версия | Назначение |
| --- | --- | --- |
| Node.js | 18+ | Среда исполнения |
| Express | ^5.1 | REST API |
| MongoDB (driver) | ^6.16 | Доступ к БД (MongoDB Atlas) |
| jsonwebtoken | ^9.0 | Выпуск и проверка JWT |
| bcryptjs | ^3.0 | Хеширование паролей |
| cors, dotenv | — | CORS-политика, переменные окружения |

### Инструменты
Vue CLI (`@vue/cli-service` ^5.0), Babel, ESLint (`plugin:vue/vue3-essential`), пакет `sitemap` для генерации карты сайта.

## Архитектура

```
┌─────────────────────────┐        HTTP / JSON        ┌──────────────────────────┐
│      Vue 3 SPA (SFC)     │  ───────────────────────► │   Express REST API       │
│  Vue Router · Axios      │  ◄─────────────────────── │   JWT · middleware       │
│  Tailwind · Vuelidate    │                           │                          │
└─────────────────────────┘                           └────────────┬─────────────┘
                                                                     │ MongoDB driver
                                                                     ▼
                                                          ┌──────────────────────┐
                                                          │   MongoDB (Atlas)    │
                                                          │  book · author ·     │
                                                          │  genres · user ·     │
                                                          │  user-books · reviews│
                                                          └──────────────────────┘
```

Ключевые решения:

- **Единый слой доступа к данным.** Класс `DatabaseService` (`src/database/database.service.js`) — синглтон-обёртка над MongoDB-драйвером с ленивым подключением, пулом соединений и универсальными методами `find` / `findOne` / `insert` / `update` / `delete`. Поддерживает «populate» связанных коллекций через `$lookup` в aggregation-пайплайне.
- **Автоматический пересчёт рейтинга.** `rating.service.js` при изменении оценки агрегирует средний рейтинг по коллекции `user-books` и обновляет поле `rating` книги.
- **Интерсепторы на клиенте.** В `main.js` axios автоматически подставляет `Authorization: Bearer <token>`, проверяет срок жизни токена (`jwt-decode`) и разлогинивает пользователя при `401`.
- **Две точки входа сервера.** `src/backend/server.js` — для локального запуска, `api/index.js` — serverless-обёртка для деплоя на Vercel. Набор маршрутов идентичен.

## Модель данных

Основные коллекции MongoDB:

| Коллекция    | Назначение | Ключевые поля |
| ------------ | ---------- | ------------- |
| `user`       | Пользователи | `email`, `username`, `passwordHash`, `role`, `createdAt` |
| `book`       | Книги | `title`, `author` (ref), `rating`, `createdAt` |
| `author`     | Авторы | `name` |
| `genres`     | Жанры | `name`, `slug` |
| `user-books` | Списки чтения (связь user ↔ book) | `userId`, `bookId`, `status`, `rating`, `addedAt` |
| `reviews`    | Отзывы | `bookId`, `userId`, `text`, `addedAt` |
| `news`       | Новости | `title`, `slug`, `content` |

## Аутентификация и безопасность

- Пароли хешируются `bcryptjs` (соль на 10 раундов) — в открытом виде не хранятся.
- При входе выдаётся **JWT** со сроком жизни **2 часа**, подписанный секретом из `JWT_SECRET`.
- Приватные маршруты API защищены middleware `authenticateToken` — он проверяет подпись и наличие токена, возвращая `401`/`403` при ошибке.
- Роль `admin` открывает доступ к административным эндпоинтам (например, полному списку `user-books`).
- Поле `passwordHash` исключается из ответов через `projection` при выдаче профилей.
- На клиенте Vue Router `beforeEach`-guard закрывает разделы с `meta.requiresAuth` для неавторизованных пользователей.

## Структура проекта

Весь код приложения расположен в папке `libra-train/`:

```
libra-train/
├── api/                    # Serverless-точка входа Express (деплой на Vercel)
│   └── index.js
├── public/                 # index.html, favicon, sitemap
├── sitemap.js              # Генерация sitemap.xml перед сборкой
└── src/
    ├── assets/             # Изображения, иконки, шрифты, обложки книг
    ├── backend/            # Локальный Express-сервер
    │   ├── middleware/
    │   │   └── authMiddleware.js   # Проверка JWT
    │   └── server.js
    ├── components/         # Vue-компоненты
    │   ├── MainPage/       # Блоки главной (баннеры, категории, рекомендации)
    │   ├── Modules/        # Переиспользуемые карточки (книга, отзыв, новость…)
    │   ├── Private/        # Профиль и списки текущего пользователя
    │   └── Public/         # Публичные профили и списки других пользователей
    ├── composables/        # useDatabase — переиспользуемая логика
    ├── database/           # Слой доступа к MongoDB + сиды (books.json, news.json…)
    │   ├── database.service.js
    │   └── rating.service.js
    ├── pages/              # Страницы-роуты (Home, Registration, NewsSingle)
    ├── router/             # Конфигурация Vue Router
    ├── App.vue
    ├── main.js             # Точка входа: axios-интерсепторы, плагины
    └── index.css
```

Приложение содержит ~26 Vue-компонентов и слой сервисов на чистом JavaScript.

## Быстрый старт

### Требования
- **Node.js 18+** (проект разрабатывался на Node 22)
- Доступ к базе данных **MongoDB** (например, кластер MongoDB Atlas)

### 1. Переход в папку проекта и установка зависимостей

```bash
cd libra-train
npm install
```

### 2. Настройка окружения

Скопируйте пример переменных окружения и заполните своими значениями:

```bash
cp .env.example .env
```

### 3. Запуск

Frontend (dev-сервер с hot-reload, обычно на `http://localhost:8080`):

```bash
npm run serve
```

Backend (Express API на `http://localhost:3000`):

```bash
node src/backend/server.js
```

## Переменные окружения

| Переменная         | Назначение                                            |
| ------------------ | ----------------------------------------------------- |
| `VUE_APP_API_URL`  | Базовый URL API для фронтенда                         |
| `MONGODB_URI`      | Строка подключения к MongoDB                          |
| `DB_NAME`          | Имя базы данных                                        |
| `JWT_SECRET`       | Секрет для подписи JWT-токенов                        |

> ⚠️ Файл `.env` содержит секреты и не должен попадать в git — он уже добавлен в `.gitignore`. Шаблон см. в `libra-train/.env.example`.

## Скрипты npm

Выполняются из папки `libra-train/`.

| Скрипт | Что делает |
| ------ | ---------- |
| `npm run serve` | Запуск dev-сервера фронтенда с hot-reload |
| `npm run build` | Генерация `sitemap.xml` + production-сборка в `dist/` |
| `npm run lint` | Проверка и авто-фикс кода через ESLint |
| `npm run generate-sitemap` | Отдельная генерация карты сайта |

## Справочник API

Базовый префикс — `/api`. Формат обмена — JSON.

| Метод  | Эндпоинт                        | Описание                          | Авторизация |
| ------ | ------------------------------- | --------------------------------- | ----------- |
| POST   | `/api/register`                 | Регистрация пользователя          | —           |
| POST   | `/api/login`                    | Вход, выдача JWT                   | —           |
| GET    | `/api/books`                    | Список книг (с авторами)          | —           |
| GET    | `/api/books/:id`                | Книга по id                       | —           |
| GET    | `/api/authors`                  | Список авторов                    | —           |
| GET    | `/api/genres`                   | Список жанров                     | —           |
| GET    | `/api/news`                     | Новости                           | —           |
| GET    | `/api/reviews/:bookId`          | Отзывы на книгу                   | —           |
| GET    | `/api/users/:username`          | Публичный профиль пользователя    | —           |
| GET    | `/api/profile`                  | Профиль текущего пользователя     | JWT         |
| GET    | `/api/user-books/book/:bookId`  | Запись списка по книге            | JWT         |
| POST   | `/api/user-books`               | Добавить/обновить книгу в списке  | JWT         |
| DELETE | `/api/user-books/:bookId`       | Удалить книгу из списка           | JWT         |
| POST   | `/api/reviews`                  | Оставить отзыв                    | JWT         |
| GET    | `/api/user-books/all`           | Все списки (админ)               | JWT (admin) |

## Деплой

Приложение рассчитано на деплой на [Vercel](https://vercel.com): бессерверная функция в `api/index.js` обслуживает Express-приложение, фронтенд отдаётся как статика из `dist/`. Секреты (`MONGODB_URI`, `JWT_SECRET` и др.) задаются в переменных окружения проекта Vercel, а не в коде.

---

<div align="center">
  <sub>Учебный проект. Сделано с ❤️ и любовью к книгам.</sub>
</div>
