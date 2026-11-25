import type { Book, SortOrder } from './types';

// Поиск по названию и автору без учёта регистра + сортировка.
export function filterBooks(books: Book[], query: string, sort: SortOrder): Book[] {
  const text = query.trim().toLowerCase();
  const found = books.filter(
    (book) =>
      text === '' ||
      book.title.toLowerCase().includes(text) ||
      book.author.toLowerCase().includes(text),
  );

  switch (sort) {
    case 'price-asc':
      return found.sort((a, b) => a.priceCents - b.priceCents);
    case 'price-desc':
      return found.sort((a, b) => b.priceCents - a.priceCents);
    case 'title':
      return found.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return found;
  }
}
