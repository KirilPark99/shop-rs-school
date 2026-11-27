import { describe, it, expect } from 'vitest';
import {
  addToCart,
  countCopies,
  decreaseQuantity,
  getQuantity,
  keepKnownBooks,
  lineTotalCents,
  parseCart,
  removeFromCart,
} from './cart';
import { mockBooks } from './mock-books';
import type { CartItem } from './types';

describe('addToCart', () => {
  it('adds a new book with quantity 1', () => {
    expect(addToCart([], 'book-1')).toEqual([{ bookId: 'book-1', quantity: 1 }]);
  });

  it('does not change the original cart', () => {
    const cart: CartItem[] = [{ bookId: 'book-1', quantity: 1 }];
    addToCart(cart, 'book-1');
    expect(cart).toEqual([{ bookId: 'book-1', quantity: 1 }]);
  });
});

describe('decreaseQuantity', () => {
  it('decreases quantity by one', () => {
    const cart: CartItem[] = [{ bookId: 'book-1', quantity: 2 }];
    expect(decreaseQuantity(cart, 'book-1')).toEqual([{ bookId: 'book-1', quantity: 1 }]);
  });

  // Тест «не меньше 1» и «повторное добавление» пишутся вживую на интервью.
});

describe('removeFromCart', () => {
  it('removes only the selected book', () => {
    const cart: CartItem[] = [
      { bookId: 'book-1', quantity: 2 },
      { bookId: 'book-2', quantity: 1 },
    ];
    expect(removeFromCart(cart, 'book-1')).toEqual([{ bookId: 'book-2', quantity: 1 }]);
  });

  it('returns an empty cart after removing the last book', () => {
    expect(removeFromCart([{ bookId: 'book-1', quantity: 1 }], 'book-1')).toEqual([]);
  });
});

describe('counters', () => {
  const cart: CartItem[] = [
    { bookId: 'book-1', quantity: 2 },
    { bookId: 'book-2', quantity: 1 },
  ];

  it('counts all copies', () => {
    expect(countCopies(cart)).toBe(3);
    expect(countCopies([])).toBe(0);
  });

  it('returns quantity of one book or 0', () => {
    expect(getQuantity(cart, 'book-1')).toBe(2);
    expect(getQuantity(cart, 'book-3')).toBe(0);
  });

  it('calculates a line total', () => {
    expect(lineTotalCents(1299, 2)).toBe(2598);
  });
});

describe('keepKnownBooks', () => {
  it('drops books that are not in the catalog', () => {
    const cart: CartItem[] = [
      { bookId: 'book-1', quantity: 1 },
      { bookId: 'deleted-book', quantity: 3 },
    ];
    expect(keepKnownBooks(cart, mockBooks)).toEqual([{ bookId: 'book-1', quantity: 1 }]);
  });
});

describe('parseCart', () => {
  it('restores a saved cart', () => {
    const raw = JSON.stringify([{ bookId: 'book-1', quantity: 2 }]);
    expect(parseCart(raw)).toEqual([{ bookId: 'book-1', quantity: 2 }]);
  });

  it('keeps books from carts saved before the API was added', () => {
    const raw = JSON.stringify([
      { bookId: 'hobbit', quantity: 2 },
      { bookId: 'little-prince', quantity: 1 },
      { bookId: 'alice', quantity: 1 },
      { bookId: 'treasure-island', quantity: 1 },
    ]);
    expect(parseCart(raw)).toEqual([
      { bookId: 'book-1', quantity: 2 },
      { bookId: 'book-2', quantity: 1 },
      { bookId: 'book-3', quantity: 1 },
      { bookId: 'book-4', quantity: 1 },
    ]);
  });

  it('returns an empty cart for missing or broken data', () => {
    expect(parseCart(null)).toEqual([]);
    expect(parseCart('not json')).toEqual([]);
    expect(parseCart('{"bookId":"hobbit"}')).toEqual([]);
  });

  it('skips invalid items', () => {
    const raw = JSON.stringify([
      { bookId: 'book-1', quantity: 0 },
      { bookId: 'book-3', quantity: 1.5 },
      { bookId: 'book-2', quantity: 1 },
    ]);
    expect(parseCart(raw)).toEqual([{ bookId: 'book-2', quantity: 1 }]);
  });
});
