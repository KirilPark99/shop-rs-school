import type { AppState } from '../state';
import type { Book } from '../types';
import { escapeHtml, formatPrice, pluralize } from '../format';
import { getQuantity } from '../cart';
import { filterBooks } from '../filters';
import { renderCover } from '../covers';

const tints = ['#e3ebdf', '#e6e8f4', '#efe2e5', '#f2e7d6'];

function renderCard(book: Book, index: number, quantity: number): string {
  return `
    <article class="book-card">
      <div class="book-card__cover" style="background:${tints[index % tints.length]}">
        ${renderCover(book, 'large')}
      </div>
      <h3 class="book-card__title">${escapeHtml(book.title)}</h3>
      <p class="book-card__author">${escapeHtml(book.author)}</p>
      <div class="book-card__bottom">
        <span class="book-card__price">${formatPrice(book.priceCents)}</span>
        <button class="button" type="button" data-action="add" data-id="${escapeHtml(book.id)}">В корзину</button>
      </div>
      <p class="book-card__in-cart">${quantity > 0 ? `В корзине · ${quantity}` : ''}</p>
    </article>`;
}

export function renderLoading(): string {
  const skeleton = '<div class="skeleton"><div class="skeleton__box"></div><div class="skeleton__line"></div></div>';
  return `
    <div class="status">
      <p class="status__title">Загружаем книги…</p>
      <div class="skeletons">${skeleton.repeat(3)}</div>
    </div>`;
}

export function renderBooksError(): string {
  return `
    <div class="status">
      <p class="status__title status__title--error">Не удалось загрузить книги</p>
      <button class="button button--light" type="button" data-action="retry-books">Повторить</button>
    </div>`;
}

// Только сетка и счётчик — их перерисовываем при вводе в поиск, чтобы поле не теряло фокус.
export function renderCatalogResults(state: AppState): string {
  const books = filterBooks(state.books, state.query, state.sort);
  const count = `<p class="page-subtitle">${pluralize(books.length, ['книга', 'книги', 'книг'])}</p>`;

  if (books.length === 0) {
    return `${count}<div class="status"><p class="status__title">Ничего не найдено.</p></div>`;
  }

  const cards = books
    .map((book) => renderCard(book, state.books.indexOf(book), getQuantity(state.cart, book.id)))
    .join('');
  return `${count}<div class="catalog-grid">${cards}</div>`;
}

export function renderCatalog(state: AppState): string {
  let body: string;

  if (state.booksStatus === 'error') {
    body = renderBooksError();
  } else if (state.booksStatus !== 'ready') {
    body = renderLoading();
  } else if (state.books.length === 0) {
    body = '<div class="status"><p class="status__title">Книг пока нет.</p></div>';
  } else {
    body = `
      <div class="toolbar">
        <label class="field">
          <span class="visually-hidden">Поиск</span>
          <input class="field__input" id="search" type="search"
            placeholder="Поиск по названию или автору" value="${escapeHtml(state.query)}">
        </label>
        <label class="field">
          <span class="visually-hidden">Сортировка</span>
          <select class="field__input" id="sort">
            <option value="default"${state.sort === 'default' ? ' selected' : ''}>По умолчанию</option>
            <option value="price-asc"${state.sort === 'price-asc' ? ' selected' : ''}>Сначала дешевле</option>
            <option value="price-desc"${state.sort === 'price-desc' ? ' selected' : ''}>Сначала дороже</option>
            <option value="title"${state.sort === 'title' ? ' selected' : ''}>По названию</option>
          </select>
        </label>
      </div>
      <div id="catalog-results">${renderCatalogResults(state)}</div>`;
  }

  return `<h1 class="page-title">Каталог книг</h1>${body}`;
}
