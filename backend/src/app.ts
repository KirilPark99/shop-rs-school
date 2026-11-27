import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import express, { type ErrorRequestHandler, type Response } from 'express';
import { calculateCartTotal } from './cart.js';

type Book = { id: string; title: string; author: string; priceCents: number };

function isBook(value: unknown): value is Book {
  if (typeof value !== 'object' || value === null) return false;
  const { id, title, author, priceCents } = value as Record<string, unknown>;
  return typeof id === 'string' && id.trim() !== '' &&
    typeof title === 'string' && typeof author === 'string' &&
    typeof priceCents === 'number' && Number.isSafeInteger(priceCents) && priceCents >= 0;
}

function loadBooks(): Book[] {
  const data: unknown = JSON.parse(readFileSync(new URL('../data/books.json', import.meta.url), 'utf8'));
  if (!Array.isArray(data) || !data.every(isBook)) {
    throw new Error('Некорректные данные в каталоге');
  }
  if (new Set(data.map((book) => book.id)).size !== data.length) {
    throw new Error('В каталоге повторяются id книг');
  }
  return data;
}

function sendError(res: Response, status: number, code: string, message: string): void {
  res.status(status).json({ error: { code, message } });
}

const books = loadBooks();
const api = express.Router();
export const app = express();

api.get('/books', (_req, res) => {
  res.json(books);
});

api.post('/cart/total', (req, res, next) => {
  const type = req.get('Content-Type')?.split(';', 1)[0].trim().toLowerCase();
  if (type !== 'application/json') {
    sendError(res, 415, 'UNSUPPORTED_MEDIA_TYPE', 'Ожидается Content-Type: application/json');
    return;
  }
  next();
}, express.json({ limit: '100kb' }), (req, res) => {
  const body: unknown = req.body;
  const items = typeof body === 'object' && body !== null && 'items' in body ? body.items : undefined;
  const total = calculateCartTotal(items, books);
  if (total === 'UNKNOWN_BOOK') {
    sendError(res, 400, total, 'Книга не найдена');
  } else if (total === 'INVALID_CART') {
    sendError(res, 400, total, 'Некорректные данные корзины');
  } else {
    res.json({ totalCents: total });
  }
});

api.use((_req, res) => {
  sendError(res, 404, 'NOT_FOUND', 'Маршрут API не найден');
});

const handleApiError: ErrorRequestHandler = (error: unknown, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const status = typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined;
  if (status === 400) {
    sendError(res, 400, 'INVALID_CART', 'Некорректный JSON');
  } else if (status === 413) {
    sendError(res, 413, 'PAYLOAD_TOO_LARGE', 'Тело запроса превышает 100 КБ');
  } else if (status === 415) {
    sendError(res, 415, 'UNSUPPORTED_MEDIA_TYPE', 'Формат тела запроса не поддерживается');
  } else {
    console.error(error);
    sendError(res, 500, 'INTERNAL_ERROR', 'Внутренняя ошибка сервера');
  }
};

api.use(handleApiError);
app.use('/api', api);
app.use(express.static(fileURLToPath(new URL('../../frontend/dist/', import.meta.url))));
