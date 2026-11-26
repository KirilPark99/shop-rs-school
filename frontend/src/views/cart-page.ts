import type { AppState } from '../state';
import type { Book, CartItem } from '../types';
import { escapeHtml, formatPrice, pluralize } from '../format';
import { countCopies, lineTotalCents } from '../cart';
import { renderCover } from '../covers';
import { renderBooksError, renderLoading } from './catalog';

function renderRow(book: Book, item: CartItem): string {
  const id = escapeHtml(book.id);
  return `
    <div class="cart-row">
      <div class="cart-row__book">
        ${renderCover(book, 'small')}
        <div>
          <p class="cart-row__title">${escapeHtml(book.title)}</p>
          <p class="cart-row__author">${escapeHtml(book.author)}</p>
        </div>
      </div>
      <div class="counter" role="group" aria-label="Количество">
        <button class="counter__button" type="button" data-action="dec" data-id="${id}"
          aria-label="Уменьшить" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
        <span class="counter__value">${item.quantity}</span>
        <button class="counter__button" type="button" data-action="inc" data-id="${id}"
          aria-label="Увеличить">+</button>
      </div>
      <div class="cart-row__sum">
        <span class="cart-row__price">${formatPrice(lineTotalCents(book.priceCents, item.quantity))}</span>
        <button class="link-button" type="button" data-action="remove" data-id="${id}">Удалить</button>
      </div>
    </div>`;
}

function renderTotal(state: AppState): string {
  if (state.totalStatus === 'error') {
    return `
      <p class="summary__error">Не удалось рассчитать сумму</p>
      <button class="button button--light" type="button" data-action="retry-total">Повторить</button>`;
  }
  if (state.totalStatus !== 'ready') {
    return '<p class="summary__loading">Считаем сумму…</p>';
  }
  return `<p class="summary__total" data-total>${formatPrice(state.totalCents)}</p>`;
}

function renderEmpty(state: AppState): string {
  const total =
    state.totalStatus === 'error'
      ? renderTotal(state)
      : state.totalStatus === 'ready'
        ? `<p class="status__total">Итого <span data-total>${formatPrice(state.totalCents)}</span></p>`
        : '<p class="status__total">Считаем сумму…</p>';
  return `
    <div class="status">
      <p class="status__title">Корзина пуста</p>
      ${total}
      <a class="button" href="#catalog">В каталог</a>
    </div>`;
}

export function renderCartPage(state: AppState): string {
  const title = '<h1 class="page-title">Корзина</h1>';

  if (state.cart.length === 0) return title + renderEmpty(state);
  if (state.booksStatus === 'error') return title + renderBooksError();
  if (state.booksStatus !== 'ready') return title + renderLoading();

  const rows = state.cart
    .map((item) => {
      const book = state.books.find((b) => b.id === item.bookId);
      return book ? renderRow(book, item) : '';
    })
    .join('');

  return `
    ${title}
    <p class="page-subtitle">${pluralize(state.cart.length, ['позиция', 'позиции', 'позиций'])}</p>
    <div class="cart-layout">
      <div class="cart-table">
        <div class="cart-table__head" aria-hidden="true">
          <span>Книга</span><span>Количество</span><span>Сумма</span>
        </div>
        ${rows}
      </div>
      <aside class="summary" aria-live="polite">
        <p class="summary__label">Итого</p>
        ${renderTotal(state)}
        <p class="summary__copies">${pluralize(countCopies(state.cart), ['экземпляр', 'экземпляра', 'экземпляров'])}</p>
        <a class="button button--accent" href="#catalog">В каталог</a>
      </aside>
    </div>`;
}
