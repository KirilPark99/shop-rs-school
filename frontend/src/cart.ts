import type { Book, CartItem } from './types';

export const CART_STORAGE_KEY = 'bookshelf-cart';

const legacyBookIds = new Map([
  ['hobbit', 'book-1'],
  ['little-prince', 'book-2'],
  ['alice', 'book-3'],
  ['treasure-island', 'book-4'],
]);

// Повторное добавление той же книги увеличивает количество, а не создаёт новую строку.
export function addToCart(cart: CartItem[], bookId: string): CartItem[] {
  const exists = cart.some((item) => item.bookId === bookId);
  if (!exists) return [...cart, { bookId, quantity: 1 }];
  return cart.map((item) =>
    item.bookId === bookId ? { ...item, quantity: item.quantity + 1 } : item,
  );
}

// Количество не опускается ниже 1. Для удаления есть removeFromCart.
export function decreaseQuantity(cart: CartItem[], bookId: string): CartItem[] {
  return cart.map((item) =>
    item.bookId === bookId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item,
  );
}

export function removeFromCart(cart: CartItem[], bookId: string): CartItem[] {
  return cart.filter((item) => item.bookId !== bookId);
}

export function getQuantity(cart: CartItem[], bookId: string): number {
  return cart.find((item) => item.bookId === bookId)?.quantity ?? 0;
}

// Число экземпляров для счётчика в меню.
export function countCopies(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function lineTotalCents(priceCents: number, quantity: number): number {
  return priceCents * quantity;
}

// Убирает из корзины книги, которых больше нет в каталоге.
export function keepKnownBooks(cart: CartItem[], books: Book[]): CartItem[] {
  const ids = new Set(books.map((book) => book.id));
  return cart.filter((item) => ids.has(item.bookId));
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.bookId === 'string' &&
    item.bookId.length > 0 &&
    typeof item.quantity === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 1
  );
}

// Разбирает сохранённую строку. Повреждённые данные дают пустую корзину.
export function parseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .filter(isCartItem)
      .map((item) => ({
        bookId: legacyBookIds.get(item.bookId) ?? item.bookId,
        quantity: item.quantity,
      }));
  } catch {
    return [];
  }
}

export function loadCart(storage: Pick<Storage, 'getItem'> = localStorage): CartItem[] {
  try {
    return parseCart(storage.getItem(CART_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[], storage: Pick<Storage, 'setItem'> = localStorage): void {
  try {
    storage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Хранилище недоступно (например, приватный режим) — корзина просто не сохранится.
  }
}
