# Книжная полка — фронтенд

TypeScript + Vite, без фреймворков. Тесты — Vitest.

## Запуск

```
npm --prefix frontend ci
npm --prefix backend run dev     # терминал 1, API на http://127.0.0.1:3000
npm --prefix frontend run dev    # терминал 2
npm --prefix frontend test
npm --prefix frontend run build
```

Без сервера: создайте `frontend/.env.local` со строкой `VITE_USE_MOCK=true`.

## Структура

| Файл | Что делает |
|---|---|
| `src/main.ts` | состояние, маршруты (#about, #catalog, #cart), обработка кликов |
| `src/api.ts` | `GET /api/books`, `POST /api/cart/total` |
| `src/cart.ts` | логика корзины и localStorage (покрыта тестами) |
| `src/filters.ts` | поиск и сортировка каталога (покрыта тестами) |
| `src/format.ts` | цена `$12.99`, склонение слов |
| `src/views/*` | разметка страниц |
| `public/covers/<id>.svg` | обложки по id книги, без файла — заглушка |
