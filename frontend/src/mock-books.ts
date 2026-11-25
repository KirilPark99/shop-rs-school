import type { Book } from './types';

// Временные данные, пока API напарника не готов.
// id должны совпадать с id на сервере.
export const mockBooks: Book[] = [
  { id: 'hobbit', title: 'The Hobbit', author: 'J. R. R. Tolkien', priceCents: 1299 },
  { id: 'little-prince', title: 'The Little Prince', author: 'Antoine de Saint-Exupéry', priceCents: 850 },
  { id: 'alice', title: 'Alice’s Adventures in Wonderland', author: 'Lewis Carroll', priceCents: 1075 },
  { id: 'treasure-island', title: 'Treasure Island', author: 'Robert Louis Stevenson', priceCents: 950 },
];
