import { describe, it, expect } from 'vitest';
import { filterBooks } from './filters';
import { mockBooks } from './mock-books';

const ids = (books: { id: string }[]) => books.map((book) => book.id);

describe('filterBooks', () => {
  it('returns all books for an empty query', () => {
    expect(ids(filterBooks(mockBooks, '   ', 'default'))).toEqual([
      'book-1',
      'book-2',
      'book-3',
      'book-4',
    ]);
  });

  it('searches by title ignoring case', () => {
    expect(ids(filterBooks(mockBooks, 'HOBBIT', 'default'))).toEqual(['book-1']);
  });

  it('searches by author', () => {
    expect(ids(filterBooks(mockBooks, 'carroll', 'default'))).toEqual(['book-3']);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterBooks(mockBooks, 'harry potter', 'default')).toEqual([]);
  });

  it('sorts by price ascending and descending', () => {
    expect(ids(filterBooks(mockBooks, '', 'price-asc'))).toEqual([
      'book-2',
      'book-4',
      'book-3',
      'book-1',
    ]);
    expect(ids(filterBooks(mockBooks, '', 'price-desc'))[0]).toBe('book-1');
  });

  it('sorts by title', () => {
    expect(ids(filterBooks(mockBooks, '', 'title'))).toEqual([
      'book-3',
      'book-1',
      'book-2',
      'book-4',
    ]);
  });

  it('does not change the original array', () => {
    const copy = [...mockBooks];
    filterBooks(mockBooks, '', 'price-asc');
    expect(mockBooks).toEqual(copy);
  });
});
