import { describe, it, expect } from 'vitest';
import { filterBooks } from './filters';
import { mockBooks } from './mock-books';

const ids = (books: { id: string }[]) => books.map((book) => book.id);

describe('filterBooks', () => {
  it('returns all books for an empty query', () => {
    expect(ids(filterBooks(mockBooks, '   ', 'default'))).toEqual([
      'hobbit',
      'little-prince',
      'alice',
      'treasure-island',
    ]);
  });

  it('searches by title ignoring case', () => {
    expect(ids(filterBooks(mockBooks, 'HOBBIT', 'default'))).toEqual(['hobbit']);
  });

  it('searches by author', () => {
    expect(ids(filterBooks(mockBooks, 'carroll', 'default'))).toEqual(['alice']);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterBooks(mockBooks, 'harry potter', 'default')).toEqual([]);
  });

  it('sorts by price ascending and descending', () => {
    expect(ids(filterBooks(mockBooks, '', 'price-asc'))).toEqual([
      'little-prince',
      'treasure-island',
      'alice',
      'hobbit',
    ]);
    expect(ids(filterBooks(mockBooks, '', 'price-desc'))[0]).toBe('hobbit');
  });

  it('sorts by title', () => {
    expect(ids(filterBooks(mockBooks, '', 'title'))).toEqual([
      'alice',
      'hobbit',
      'little-prince',
      'treasure-island',
    ]);
  });

  it('does not change the original array', () => {
    const copy = [...mockBooks];
    filterBooks(mockBooks, '', 'price-asc');
    expect(mockBooks).toEqual(copy);
  });
});
