const { SitemapStream, streamToPromise } = require('sitemap')
const { createWriteStream } = require('fs')
const { resolve } = require('path')
const fetch = require('node-fetch') // или другую библиотеку для HTTP

async function build() {
  const hostname = 'https://diplom-phi-eight.vercel.app'
  const sitemapPath = resolve(__dirname, './public/sitemap.xml')
  const stream = new SitemapStream({ hostname })
  const writeStream = createWriteStream(sitemapPath)
  stream.pipe(writeStream)

  // 1. Главная страница
  stream.write({ url: '/', changefreq: 'daily', priority: 1.0 })
  // 2. Страница со всеми книгами
  stream.write({ url: '/books', changefreq: 'daily', priority: 0.8 })

  // 3. Динамические страницы книг
  // Предположим, у вас есть API вида GET /api/books, который возвращает список книг
  const books = await fetch(`${hostname}/api/books?limit=1000`)
    .then(res => res.json())

  for (const book of books) {
    // book.id или book._id в зависимости от API
    stream.write({
      url: `/book/${book._id || book.id}`,
      changefreq: 'weekly',
      priority: 0.6,
      lastmod: book.updatedAt // если вы возвращаете эту дату в API
    })
  }

  stream.end()
  await streamToPromise(stream)
  console.log('sitemap.xml generated at', sitemapPath)
}

build().catch(console.error)