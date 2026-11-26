import type { Book } from './types';
import { escapeHtml } from './format';

// Обложка ищется по id книги: public/covers/<id>.svg.
// Если файла нет, срабатывает обработчик ошибки в main.ts и показывается заглушка.
export function coverUrl(bookId: string): string {
  return `${import.meta.env.BASE_URL}covers/${encodeURIComponent(bookId)}.svg`;
}

export function renderCover(book: Book, size: 'large' | 'small'): string {
  return `<img class="cover cover--${size}" src="${coverUrl(book.id)}"
    alt="Обложка книги ${escapeHtml(book.title)}" data-cover-title="${escapeHtml(book.title)}">`;
}

export function renderCoverPlaceholder(title: string, size: string): string {
  return `<div class="cover cover--${size} cover--placeholder" role="img"
    aria-label="Нет обложки: ${escapeHtml(title)}"><span>Нет<br>обложки</span></div>`;
}
