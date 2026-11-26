import './style.css';
import type { AppState } from './state';
import type { Route, SortOrder } from './types';
import { fetchBooks, fetchCartTotal } from './api';
import {
  addToCart,
  decreaseQuantity,
  keepKnownBooks,
  loadCart,
  removeFromCart,
  saveCart,
} from './cart';
import type { CartItem } from './types';
import { renderCoverPlaceholder } from './covers';
import { renderHeader } from './views/header';
import { renderAbout } from './views/about';
import { renderCatalog, renderCatalogResults } from './views/catalog';
import { renderCartPage } from './views/cart-page';

const app = document.querySelector<HTMLDivElement>('#app')!;

const state: AppState = {
  route: 'about',
  books: [],
  booksStatus: 'idle',
  cart: loadCart(),
  totalStatus: 'idle',
  totalCents: 0,
  query: '',
  sort: 'default',
};

// ---------- Отрисовка ----------

function render(): void {
  let page = '';
  if (state.route === 'about') page = renderAbout();
  if (state.route === 'catalog') page = renderCatalog(state);
  if (state.route === 'cart') page = renderCartPage(state);

  app.innerHTML = `
    <div class="shell">
      ${renderHeader(state)}
      <main class="page">${page}</main>
    </div>`;
}

function renderResultsOnly(): void {
  const results = document.querySelector('#catalog-results');
  if (results) results.innerHTML = renderCatalogResults(state);
}

// ---------- Данные ----------

async function loadBooks(): Promise<void> {
  state.booksStatus = 'loading';
  render();
  try {
    state.books = await fetchBooks();
    state.booksStatus = 'ready';
    const cleaned = keepKnownBooks(state.cart, state.books);
    if (cleaned.length !== state.cart.length) {
      updateCart(cleaned);
      return;
    }
  } catch (error) {
    console.error(error);
    state.booksStatus = 'error';
  }
  render();
}

// Номер последнего запроса: ответ на старый список позиций не показываем.
let totalRequestId = 0;

async function recalcTotal(): Promise<void> {
  const requestId = ++totalRequestId;
  const items = state.cart.map((item) => ({ ...item }));
  state.totalStatus = 'loading';
  render();
  try {
    const totalCents = await fetchCartTotal(items);
    if (requestId !== totalRequestId) return;
    state.totalCents = totalCents;
    state.totalStatus = 'ready';
  } catch (error) {
    if (requestId !== totalRequestId) return;
    console.error(error);
    state.totalStatus = 'error';
  }
  render();
}

function updateCart(cart: CartItem[]): void {
  state.cart = cart;
  saveCart(cart);
  if (state.route === 'cart') {
    void recalcTotal();
  } else {
    state.totalStatus = 'idle';
    render();
  }
}

// ---------- Маршруты ----------

function parseRoute(hash: string): Route {
  const name = hash.replace('#', '');
  return name === 'catalog' || name === 'cart' ? name : 'about';
}

function openRoute(): void {
  const route = parseRoute(location.hash);
  const changed = route !== state.route;
  state.route = route;

  if (route !== 'about' && state.booksStatus === 'idle') void loadBooks();
  if (route === 'cart') void recalcTotal();
  else render();

  if (changed) window.scrollTo(0, 0);
}

// ---------- События ----------

app.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
  if (!button) return;
  const id = button.dataset.id ?? '';

  switch (button.dataset.action) {
    case 'add':
      updateCart(addToCart(state.cart, id));
      break;
    case 'inc':
      updateCart(addToCart(state.cart, id));
      break;
    case 'dec':
      updateCart(decreaseQuantity(state.cart, id));
      break;
    case 'remove':
      updateCart(removeFromCart(state.cart, id));
      break;
    case 'retry-books':
      void loadBooks();
      break;
    case 'retry-total':
      void recalcTotal();
      break;
  }
});

app.addEventListener('input', (event) => {
  const target = event.target as HTMLElement;
  if (target.id === 'search') {
    state.query = (target as HTMLInputElement).value;
    renderResultsOnly();
  }
});

app.addEventListener('change', (event) => {
  const target = event.target as HTMLElement;
  if (target.id === 'sort') {
    state.sort = (target as HTMLSelectElement).value as SortOrder;
    renderResultsOnly();
  }
});

// Нет картинки для книги — показываем заглушку.
app.addEventListener(
  'error',
  (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement) || !img.dataset.coverTitle) return;
    const size = img.classList.contains('cover--small') ? 'small' : 'large';
    img.outerHTML = renderCoverPlaceholder(img.dataset.coverTitle, size);
  },
  true,
);

// Корзина изменилась в другой вкладке.
window.addEventListener('storage', () => {
  state.cart = loadCart();
  if (state.route === 'cart') void recalcTotal();
  else render();
});

window.addEventListener('hashchange', openRoute);
openRoute();
