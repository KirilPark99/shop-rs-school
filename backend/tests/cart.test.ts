import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { calculateCartTotal } from '../src/cart.js';

const books: { id: string; priceCents: number }[] = JSON.parse(
  readFileSync(new URL('../data/books.json', import.meta.url), 'utf8'),
);

const hobbit = { bookId: 'book-1', quantity: 1 };
const littlePrince = { bookId: 'book-2', quantity: 1 };

describe('calculateCartTotal', () => {
  it('calculates the total and recalculates it after a quantity change', () => {
    expect(calculateCartTotal([{ ...hobbit, quantity: 2 }, littlePrince], books)).toBe(3448);
    expect(calculateCartTotal([hobbit, littlePrince], books)).toBe(2149);
  });

  it('returns zero for an empty cart', () => {
    expect(calculateCartTotal([], books)).toBe(0);
  });

  it('counts each row when a book is repeated', () => {
    expect(calculateCartTotal([hobbit, hobbit], books)).toBe(2598);
  });

  it('rejects a book not in the catalog', () => {
    expect(calculateCartTotal([{ ...hobbit, bookId: 'missing' }], books)).toBe('UNKNOWN_BOOK');
  });

  it.each([0, -1, 1.5, '2', Number.MAX_SAFE_INTEGER + 1])('rejects quantity %j', (quantity) => {
    expect(calculateCartTotal([{ ...hobbit, quantity }], books)).toBe('INVALID_CART');
  });

  it.each([
    { items: null },
    { items: {} },
    { items: [null] },
    { items: [{ bookId: 1, quantity: 1 }] },
  ])('rejects invalid items %j', ({ items }) => {
    expect(calculateCartTotal(items, books)).toBe('INVALID_CART');
  });

  it('rejects an unsafe line total', () => {
    expect(calculateCartTotal([{ ...hobbit, quantity: Number.MAX_SAFE_INTEGER }], books)).toBe('INVALID_CART');
  });

  it('rejects an unsafe combined total', () => {
    const item = { ...hobbit, quantity: Math.floor(Number.MAX_SAFE_INTEGER / 1299) };
    expect(calculateCartTotal([item, hobbit], books)).toBe('INVALID_CART');
  });
});
