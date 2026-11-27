# Книжная полка

Учебный магазин: фронтенд на TypeScript и Vite, API на Express. Каталог хранится в `backend/data/books.json`, корзина — в браузере. Общую сумму сервер считает по ценам из каталога.

## Установка

Нужны Node.js 24 и npm. Команды выполняются из корня репозитория.

```sh
npm --prefix backend ci
npm --prefix frontend ci
```

## Разработка

Запустите команды в двух терминалах:

```sh
npm --prefix backend run dev
npm --prefix frontend run dev
```

Откройте адрес, который выведет Vite. Запросы к `/api` Vite отправляет на `127.0.0.1:3000`.

## Тесты

```sh
npm --prefix backend test
npm --prefix frontend test
```

## Запуск сборки

Остановите локальный dev-сервер API, если он занимает порт 3000.

```sh
npm --prefix backend run build
npm --prefix frontend run build
npm --prefix backend start
```

Откройте `http://localhost:3000`. Express раздаёт `frontend/dist` и API по одному адресу. Для деплоя выполните те же команды сборки и запуска на Node.js 24. В сборке фронтенда не включайте моки и не задавайте отдельный `VITE_API_URL`. На сервере нужны `backend/dist`, `backend/data/books.json`, зависимости бэкенда и `frontend/dist`. Порт задаётся через `PORT`, по умолчанию — `3000`.

## API

- `GET /api/books` — список книг с `id`, `title`, `author` и `priceCents`.
- `POST /api/cart/total` — принимает `{ "items": [{ "bookId": "book-1", "quantity": 2 }] }`, возвращает `{ "totalCents": 2598 }`. Нужен заголовок `Content-Type: application/json`.

Контрольная покупка: два экземпляра *The Hobbit* и один *The Little Prince* стоят $34.48. После уменьшения количества *The Hobbit* до одного — $21.49. После удаления всех книг — $0.00.
