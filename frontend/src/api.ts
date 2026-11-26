import type { Book, CartItem } from './types';
import { mockBooks } from './mock-books';

// VITE_USE_MOCK=true — работать без сервера (на мок-данных).
// VITE_API_URL — адрес бэкенда на хостинге. Пусто = тот же сайт (/api через прокси Vite).
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const API_BASE = String(import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isBook(value: unknown): value is Book {
  if (typeof value !== 'object' || value === null) return false;
  const book = value as Record<string, unknown>;
  return (
    typeof book.id === 'string' &&
    typeof book.title === 'string' &&
    typeof book.author === 'string' &&
    typeof book.priceCents === 'number'
  );
}

export async function fetchBooks(): Promise<Book[]> {
  if (USE_MOCK) {
    await wait(400);
    return mockBooks;
  }

  const response = await fetch(`${API_BASE}/api/books`);
  if (!response.ok) throw new Error(`GET /api/books failed: ${response.status}`);

  const data: unknown = await response.json();
  if (!Array.isArray(data) || !data.every(isBook)) {
    throw new Error('GET /api/books returned unexpected data');
  }
  return data;
}

export async function fetchCartTotal(items: CartItem[]): Promise<number> {
  if (USE_MOCK) {
    await wait(300);
    return items.reduce((sum, item) => {
      const book = mockBooks.find((b) => b.id === item.bookId);
      return sum + (book ? book.priceCents * item.quantity : 0);
    }, 0);
  }

  const response = await fetch(`${API_BASE}/api/cart/total`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  if (!response.ok) throw new Error(`POST /api/cart/total failed: ${response.status}`);

  const data: unknown = await response.json();
  const totalCents = (data as { totalCents?: unknown } | null)?.totalCents;
  if (typeof totalCents !== 'number') {
    throw new Error('POST /api/cart/total returned unexpected data');
  }
  return totalCents;
}
